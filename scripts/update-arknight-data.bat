@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay - one-key updater for the Arknights game data
REM
REM  Files (json/arknight/, tracked by git):
REM    character_table.json     charword_table.json
REM    handbook_team_table.json char_patch_table.json
REM
REM  Mirrors WhichWayArknight.updateArknigtData() in
REM  src/arknight/index.ts -- keep the file list and the base url
REM  in sync with that function.
REM
REM  Pipeline: download to %TEMP% -> validate -> compare -> install.
REM  The repo is not written until every file passed validation, so a
REM  failed or interrupted run never leaves half-updated data behind.
REM
REM  Usage:
REM    update-arknight-data.bat                 update + sync
REM    update-arknight-data.bat --check         dry run, report only
REM    update-arknight-data.bat --source-only   skip built extension + cache
REM    update-arknight-data.bat --url <base>    use another base url
REM    update-arknight-data.bat --no-pause      no key press at the end
REM
REM  Notes:
REM  - curl runs with --ssl-no-revoke: on some dev machines the Windows
REM    schannel revocation check fails with CRYPT_E_REVOCATION_OFFLINE
REM    (0x80092013) and every download would abort without it.
REM  - Behind a proxy:  set HTTPS_PROXY=http://127.0.0.1:7897
REM    (curl picks HTTPS_PROXY / https_proxy up from the environment)
REM  - The JSON check uses node; without node only a size check runs.
REM  - The inline node script must stay free of "!" and "&": this file
REM    runs with delayed expansion enabled, which eats "!" even inside
REM    double quotes, and an unquoted separator breaks the command.
REM  - The built extension (when it exists) gets the same files, and
REM    json/cache/arknight.json is dropped so the slim runtime cache
REM    is rebuilt on the next start instead of being served stale.
REM  - After a real update commit json/arknight/, or repack, so the
REM    running game picks the new data up.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- paths derived from this script (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
for %%I in ("%REPO%\..\..\..") do set "ROOT=%%~fI"
set "DATADIR=%REPO%\json\arknight"
set "EXTDIR=%ROOT%\apps\core\extension\WhichWay"
set "BUILDDIR=%EXTDIR%\json\arknight"
set "TMPDIR=%TEMP%\whichway-arknight"

REM ---- must match updateFile / updateUrl in src/arknight/index.ts ----
set "FILES=character_table charword_table handbook_team_table char_patch_table"
set "URL=https://torappu.prts.wiki/gamedata/latest/excel/"

set "CHECKONLY="
set "SOURCEONLY="
set "NOPAUSE="
set "KEEPTMP="

:parse
if "%~1"=="" goto :parsed
if /i "%~1"=="--check" (
	set "CHECKONLY=1"
	shift
	goto :parse
)
if /i "%~1"=="--source-only" (
	set "SOURCEONLY=1"
	shift
	goto :parse
)
if /i "%~1"=="--no-pause" (
	set "NOPAUSE=1"
	shift
	goto :parse
)
if /i "%~1"=="--url" (
	if "%~2"=="" (
		echo [ERROR] --url needs a value, e.g. --url https://example.com/excel/
		goto :fail
	)
	set "URL=%~2"
	shift
	shift
	goto :parse
)
echo [ERROR] unknown option: %~1
echo         see the usage header at the top of this file.
goto :fail
:parsed

if not "%URL:~-1%"=="/" (
	echo [ERROR] base url must end with a slash: %URL%
	goto :fail
)

REM ---- tools ----
set "NOCURL="
set "NONODE="
where curl.exe >nul 2>&1
if errorlevel 1 set "NOCURL=1"
where node >nul 2>&1
if errorlevel 1 set "NONODE=1"
if defined NOCURL echo [WARN] curl.exe not found - falling back to PowerShell downloads
if defined NONODE echo [WARN] node not found - only the size check will run
if defined CHECKONLY echo [INFO] --check: nothing will be written

if not exist "%DATADIR%" md "%DATADIR%" 2>nul
if not exist "%DATADIR%" (
	echo [ERROR] cannot create the data dir: %DATADIR%
	goto :fail
)
if exist "%TMPDIR%" rd /s /q "%TMPDIR%" 2>nul
md "%TMPDIR%" 2>nul
if not exist "%TMPDIR%" (
	echo [ERROR] cannot create the temp dir: %TMPDIR%
	goto :fail
)

echo.
echo [1/4] downloading from %URL%
for %%F in (%FILES%) do (
	echo        %%F.json
	if defined NOCURL (
		set "ARKURL=%URL%%%F.json"
		set "ARKOUT=%TMPDIR%\%%F.json"
		powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; [Net.ServicePointManager]::CheckCertificateRevocationList=$false; try { Invoke-WebRequest -UseBasicParsing -Uri $env:ARKURL -OutFile $env:ARKOUT -ErrorAction Stop } catch { exit 1 }"
	) else (
		curl.exe --ssl-no-revoke -fsSL --retry 3 --retry-delay 2 --connect-timeout 20 --progress-bar -o "%TMPDIR%\%%F.json" "%URL%%%F.json"
	)
	if errorlevel 1 (
		echo [ERROR] download failed: %%F.json
		goto :fail_download
	)
)

echo.
echo [2/4] validating
REM NOTE: the script below must not contain "!" (delayed expansion eats it)
REM       nor "&" (cmd would split the line even inside the quotes).
if defined NONODE (
	for %%F in (%FILES%) do (
		for %%A in ("%TMPDIR%\%%F.json") do (
			if %%~zA LSS 4096 (
				echo [ERROR] %%F.json looks truncated: %%~zA bytes
				set "KEEPTMP=1"
				goto :fail_invalid
			)
		)
	)
	echo [WARN] node is missing, only the size check ran
) else (
	node -e "const fs=require('fs'),path=require('path');const dir=process.argv[1];const voiceKeys=['voiceLangDict','voiceLangTypeDict','charDefaultTypeDict'];const rules={character_table:d=>Object.keys(d).length>200,charword_table:d=>voiceKeys.every(k=>k in d),handbook_team_table:d=>Object.keys(d).length>0,char_patch_table:d=>'patchChars' in d};let bad=0;for(const name in rules){const f=path.join(dir,name+'.json');let d=null;try{d=JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));}catch(e){console.log('[ERROR] '+name+'.json is not valid JSON: '+e.message);bad++;continue;}if(rules[name](d)){console.log('[ OK ] '+name+'.json '+fs.statSync(f).size+' bytes');}else{console.log('[ERROR] '+name+'.json has an unexpected structure');bad++;}}process.exit(bad?1:0);" "%TMPDIR%"
	if errorlevel 1 (
		set "KEEPTMP=1"
		goto :fail_invalid
	)
)

echo.
echo [3/4] comparing with the installed data
set "CHANGED=0"
for %%F in (%FILES%) do (
	if exist "%DATADIR%\%%F.json" (
		fc /b "%TMPDIR%\%%F.json" "%DATADIR%\%%F.json" >nul 2>&1
		if errorlevel 1 (
			echo        changed  %%F.json
			set "CHANGED=1"
		) else (
			echo        same     %%F.json
		)
	) else (
		echo        new      %%F.json
		set "CHANGED=1"
	)
)
if "!CHANGED!"=="0" (
	echo.
	echo [DONE] already up to date - nothing to install.
	goto :end_ok
)
if defined CHECKONLY (
	echo.
	echo [DONE] newer data is available ^(dry run, nothing was written^).
	echo        re-run without --check to install it.
	goto :end_ok
)

echo.
echo [4/4] installing
for %%F in (%FILES%) do (
	copy /y "%TMPDIR%\%%F.json" "%DATADIR%\%%F.json" >nul
	if errorlevel 1 (
		echo [ERROR] cannot write %DATADIR%\%%F.json
		goto :fail_write
	)
)
echo        source tree : %DATADIR%
if defined SOURCEONLY (
	echo        built ext   : skipped ^(--source-only^)
) else (
	if exist "%EXTDIR%\" (
		if not exist "%BUILDDIR%" md "%BUILDDIR%" 2>nul
		for %%F in (%FILES%) do (
			copy /y "%TMPDIR%\%%F.json" "%BUILDDIR%\%%F.json" >nul
		)
		echo        built ext   : %BUILDDIR%
		if exist "%EXTDIR%\json\cache\arknight.json" (
			del "%EXTDIR%\json\cache\arknight.json" 2>nul
			echo        dropped        json\cache\arknight.json
		)
	) else (
		echo        built ext   : not found, skipped ^(%EXTDIR%^)
	)
)
if exist "%REPO%\json\cache\arknight.json" (
	del "%REPO%\json\cache\arknight.json" 2>nul
	echo        dropped        json\cache\arknight.json
)

echo.
echo [DONE] Arknights data updated.
for %%F in (%FILES%) do (
	for %%A in ("%DATADIR%\%%F.json") do echo        %%F.json  %%~zA bytes  %%~tA
)
echo.
echo Next:
echo   - commit the data : git add json/arknight ^&^& git commit -m "data: update arknights data"
echo   - or repack       : scripts\release.bat vX.Y.Z
echo   - the game reads the new data after a restart.
goto :end_ok

REM ============================================================
REM  failure exits -- none of them has written into the repo
REM ============================================================
:fail_download
echo.
echo [ERROR] the download did not complete: nothing was written.
echo [HINT] network / proxy:  set HTTPS_PROXY=http://127.0.0.1:7897
echo [HINT] keep --ssl-no-revoke if curl reports CRYPT_E_REVOCATION_OFFLINE
echo [HINT] another mirror:  --url ^<base url ending with a slash^>
goto :fail

:fail_invalid
echo.
echo [ERROR] the downloaded data failed validation: nothing was written.
echo [HINT] the raw downloads are kept for inspection:
echo            %TMPDIR%
echo [HINT] upstream may have changed shape - then update the rules in this
echo [HINT] script, see updateArknigtData in src/arknight/index.ts.
set "KEEPTMP=1"
goto :fail

:fail_write
echo.
echo [ERROR] writing into the data dir failed.
echo [HINT] close the game / editor holding the files and retry.
goto :fail

:end_ok
rd /s /q "%TMPDIR%" 2>nul
if not defined NOPAUSE (
	echo.
	pause
)
endlocal
exit /b 0

:fail
if not defined KEEPTMP rd /s /q "%TMPDIR%" 2>nul
if not defined NOPAUSE (
	echo.
	pause
)
endlocal
exit /b 1
