@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay dev-output sync
REM
REM  Builds the extension, packs the build tree into a local zip inside this
REM  scripts folder, and pushes ONLY the dev-output branch (the build tree
REM  produced from dev). Use it when you just want the build branch up to
REM  date without doing a release:
REM    - no tag, no output / output-core merge
REM    - no GitHub Release, no CI archives (but a local zip is made)
REM    - dev itself is not pushed either
REM
REM  Full release (all branches + tag + CI archives): scripts\release.bat
REM
REM  Usage:
REM    release-dev.bat                build + pack zip + sync dev-output
REM    release-dev.bat --no-zip       same, but skip the local zip
REM    release-dev.bat --push-only    push the existing local dev-output only
REM                                   (no build, so no zip either)
REM
REM  Local package (on by default):
REM    Written next to this script as WhichWay-dev-<sha7>.zip, where <sha7>
REM    is the short dev-output commit. Top-level entry is WhichWay/ and the
REM    tree comes straight from the build dir, so it never contains .github
REM    or scripts/ - same layout as the CI release archives (drop-in install).
REM
REM  Notes:
REM  - Uses plumbing git commands: never switches branches, never touches
REM    your worktree (HEAD stays where it is).
REM  - The worktree must be clean in build mode (the build reads it).
REM  - Build output goes to apps/core/extension/WhichWay (overwritten).
REM  - The CI workflow is injected into the committed tree: GitHub only runs
REM    a workflow for a tag push when that file exists at the tagged commit,
REM    and dev-output is what later merges into that tagged tree.
REM  - Scratch files live in %TEMP%\whichway-dev, so a failed run never
REM    dirties the repo.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- derive paths from script location (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
for %%I in ("%REPO%\..\..\..") do set "ROOT=%%~fI"
set "BUILD=%ROOT%\apps\core\extension\WhichWay"

REM ---- scratch files live in %TEMP% so a failed run never dirties the repo ----
set "TEMPDIR=%TEMP%\whichway-dev"
if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
set "TMPIDX=%TEMPDIR%\index.tmp"
set "MSGDEV=%TEMPDIR%\msg-dev.txt"

cd /d "%REPO%" || (echo [ERROR] repo dir not found: %REPO% & exit /b 1)

REM ---- args ---- (loop so --no-zip can be combined with --push-only) ----
set "PUSHONLY="
set "NOZIP="
:parseargs
if "%~1"=="" goto :argsdone
if /i "%~1"=="--push-only" (
	set "PUSHONLY=1"
) else if /i "%~1"=="--no-zip" (
	set "NOZIP=1"
) else (
	echo [ERROR] unknown option: %~1
	echo.
	echo   release-dev.bat               build + pack zip + sync dev-output
	echo   release-dev.bat --no-zip       same, but skip the local zip
	echo   release-dev.bat --push-only    push the existing local dev-output only
	exit /b 1
)
shift
goto :parseargs
:argsdone

REM ---- precheck: working tree must be clean (build mode only) ----
if not defined PUSHONLY (
	set HASCHANGES=
	for /f "delims=" %%i in ('git status --porcelain') do set HASCHANGES=1
	if defined HASCHANGES (
		echo [ERROR] working tree has uncommitted changes. Commit or stash first:
		git status --short
		exit /b 1
	)
)

REM ---- precheck: dev + dev-output must exist ----
for %%b in (dev dev-output) do (
	git rev-parse --verify --quiet "refs/heads/%%b" >nul 2>&1 || (
		echo [ERROR] branch %%b missing. Initialize it first.
		exit /b 1
	)
)

REM ---- remember current branch + dev head ----
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set ORIGBRANCH=%%b
set "DEVSHA="
for /f "delims=" %%d in ('git rev-parse refs/heads/dev') do set DEVSHA=%%d
set "DEVAHEAD=0"
for /f "delims=" %%n in ('git rev-list --count origin/dev..refs/heads/dev 2^>nul') do set DEVAHEAD=%%n

if defined PUSHONLY (
	echo [INFO] mode     = push-only ^(no build, no zip: push the existing local dev-output^)
) else if defined NOZIP (
	echo [INFO] mode     = build + sync dev-output ^(local zip skipped: --no-zip^)
) else (
	echo [INFO] mode     = build + pack zip + sync dev-output
)
echo [INFO] branch   = %ORIGBRANCH%   dev head = !DEVSHA!  ^(dev unpushed: !DEVAHEAD!^)
if /i not "%ORIGBRANCH%"=="dev" (
	echo [WARN] current branch is %ORIGBRANCH%, not dev: dev-output will be built from that
	echo        working tree. Switch to dev first if you meant to publish dev.
)
echo.

if defined PUSHONLY goto :push

REM ---- precheck: build toolchain (vite) ----
set "VITEBIN=%REPO%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" set "VITEBIN=%ROOT%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" (
	echo [ERROR] vite not found. Run "pnpm install" in the workspace root first.
	exit /b 1
)

REM ============================================================
REM [1/4] build
REM ============================================================
echo [1/4] build extension...
if exist "%BUILD%" (
	rd /s /q "%BUILD%" 2>nul
	if exist "%BUILD%" (
		echo [WARN] could not remove old build dir, renaming instead...
		ren "%BUILD%" "WhichWay-stale-%RANDOM%" 2>nul
	)
)
cd /d "%ROOT%"
call pnpm --filter ./packages/extension/WhichWay build
if errorlevel 1 (
	cd /d "%REPO%"
	echo [ERROR] build failed.
	exit /b 1
)
cd /d "%REPO%"

REM ---- build sanity: a no-op/failed build must never become an empty branch ----
if not exist "%BUILD%" (
	echo [ERROR] build produced no output directory: %BUILD%
	echo         Check that "pnpm --filter ./packages/extension/WhichWay build" really ran
	echo         ^(pnpm exits 0 with "No projects found" when the workspace pattern misses^).
	exit /b 1
)
set "BUILTANY="
for /f "delims=" %%f in ('dir /b "%BUILD%" 2^>nul') do set "BUILTANY=1"
if not defined BUILTANY (
	echo [ERROR] build output directory is empty: %BUILD%
	exit /b 1
)

REM ============================================================
REM [2/4] dev-output: build tree via temp index, commit, update-ref
REM ============================================================
echo [2/4] create dev-output commit...
del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
git --work-tree="%BUILD%" add -A
REM ---- The committed tree must contain the CI workflow: GitHub only runs a
REM      workflow for a tag push when that file exists at the tagged commit.
REM      It is injected into the tree here, not into the build dir, so the
REM      local build output stays clean and the release archives can still
REM      exclude .github.
if exist "%REPO%\.github\workflows\release.yml" (
	set "WFBLOB="
	for /f "delims=" %%h in ('git hash-object -w "%REPO%\.github\workflows\release.yml"') do set WFBLOB=%%h
	if not "!WFBLOB!"=="" git update-index --add --cacheinfo 100644,!WFBLOB!,.github/workflows/release.yml
) else (
	echo [WARN] .github/workflows/release.yml missing: the committed tree will not carry
	echo [WARN] a workflow, so no release assets would be generated once this tree is tagged.
)
set "TREE="
for /f "delims=" %%t in ('git write-tree') do set TREE=%%t
set "GIT_INDEX_FILE="
del "%TMPIDX%" 2>nul
if "!TREE!"=="" (
	echo [ERROR] write-tree failed. Is the build dir readable?
	exit /b 1
)

> "%MSGDEV%" echo dev-output: build from !ORIGBRANCH!
>>"%MSGDEV%" echo output dir apps/core/extension/WhichWay
>>"%MSGDEV%" echo dev-commit: !DEVSHA!
set "DOCOMMIT="
for /f "delims=" %%c in ('git commit-tree !TREE! -p dev-output -F "%MSGDEV%"') do set DOCOMMIT=%%c
if "!DOCOMMIT!"=="" (
	echo [ERROR] commit-tree failed, dev-output not created.
	exit /b 1
)
git update-ref refs/heads/dev-output !DOCOMMIT!
echo       dev-output = !DOCOMMIT!
del "%MSGDEV%" 2>nul

REM ============================================================
REM [3/4] local package: build tree -> scripts\WhichWay-dev-<sha7>.zip
REM ============================================================
if defined NOZIP (
	echo [3/4] pack build tree into a zip... skipped ^(--no-zip^)
) else (
	echo [3/4] pack build tree into a zip...
	call :pack_zip
	if errorlevel 1 (
		echo [ERROR] packing failed. Nothing was pushed; fix it or re-run with --no-zip.
		exit /b 1
	)
)

REM ============================================================
REM [4/4] push dev-output (with pause)
REM ============================================================
:push
set "DOCOMMIT="
for /f "delims=" %%a in ('git rev-parse refs/heads/dev-output') do set "DOCOMMIT=%%a"
if "!DOCOMMIT!"=="" (
	echo [ERROR] cannot read refs/heads/dev-output.
	exit /b 1
)

echo.
echo [INFO] ref to publish:
echo       dev-output   !DOCOMMIT!
if !DEVAHEAD! GTR 0 echo       ^(note: dev has !DEVAHEAD! unpushed commit^(s^) - this script does not push dev^)
echo.
echo     Press any key to push, Ctrl+C to cancel. The local commit is kept.
pause >nul

git push origin dev-output
if errorlevel 1 (
	echo.
	echo [ERROR] push failed. The dev-output commit is still local, so you can retry without
	echo         rebuilding:
	echo             scripts\release-dev.bat --push-only
	echo         Manual equivalent:
	echo             git push origin dev-output
	echo         Remote moved ahead ^(rejected as non-fast-forward^)? Check with:
	echo             git fetch origin ^&^& git log --oneline dev-output..origin/dev-output
	rd /s /q "%TEMPDIR%" 2>nul
	exit /b 1
)

rd /s /q "%TEMPDIR%" 2>nul
echo.
echo [DONE] dev-output synced: !DOCOMMIT!
if defined ZIPPATH echo        local package: !ZIPPATH!
echo        pushed: dev-output only ^(no tag, no output / output-core, no release^)
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
exit /b 0

REM ============================================================
REM [3/4] pack_zip - zip the build tree into this scripts folder.
REM
REM   - tar.exe (bsdtar, Win10 1803+) is used when available: far faster
REM     than Compress-Archive on asset-heavy trees. PowerShell is only a
REM     fallback for older systems.
REM   - -C <extension dir> + "WhichWay" gives the WhichWay/ top level that
REM     the CI archives also use (drop-in install).
REM   - Sanity checks (tar path only) mirror the CI ones: every entry stays
REM     under WhichWay/, and no CI-only .github/ or packaging scripts/ entry
REM     may appear.
REM   - Returns 0 on success (sets ZIPPATH / ZIPNAME), 1 on failure.
REM ============================================================
:pack_zip
set "ZIPPATH="
set "ZIPNAME="
set "SHORT="
for /f "delims=" %%s in ('git rev-parse --short=7 refs/heads/dev-output') do set SHORT=%%s
if "!SHORT!"=="" set "SHORT=local"
set "ZIPNAME=WhichWay-dev-!SHORT!.zip"
set "ZIPPATH=%SCRIPTS%!ZIPNAME!"
if exist "!ZIPPATH!" del "!ZIPPATH!" 2>nul

set "TARBIN="
for /f "delims=" %%t in ('where tar 2^>nul') do if not defined TARBIN set "TARBIN=%%t"
if defined TARBIN (
	"%TARBIN%" -a -c -f "!ZIPPATH!" -C "%ROOT%\apps\core\extension" "WhichWay"
	if errorlevel 1 (
		del "!ZIPPATH!" 2>nul
		set "TARBIN="
	)
)
if not defined TARBIN (
	echo       ^(tar.exe unavailable, falling back to PowerShell Compress-Archive^)
	powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -LiteralPath '%BUILD%' -DestinationPath '!ZIPPATH!' -CompressionLevel Optimal -Force"
	if errorlevel 1 (
		echo [ERROR] Compress-Archive failed.
		exit /b 1
	)
)
if not exist "!ZIPPATH!" (
	echo [ERROR] zip was not created: !ZIPPATH!
	exit /b 1
)

REM ---- sanity: list entries, then check the layout (ASCII prefixes only) ----
if defined TARBIN (
	"%TARBIN%" -tf "!ZIPPATH!" > "%TEMPDIR%\ziplist.txt" 2>nul
	set "ZIPLISTBYTES="
	for %%l in ("%TEMPDIR%\ziplist.txt") do set "ZIPLISTBYTES=%%~zl"
	if not defined ZIPLISTBYTES set "ZIPLISTBYTES=0"
	if "!ZIPLISTBYTES!"=="0" (
		echo [ERROR] zip sanity failed: cannot list the archive.
		del "!ZIPPATH!" 2>nul
		exit /b 1
	)
	REM every entry must live under WhichWay/ ...
	findstr /v /b /l /c:"WhichWay/" "%TEMPDIR%\ziplist.txt" >nul
	if not errorlevel 1 (
		echo [ERROR] zip sanity failed: entries outside WhichWay\.
		del "!ZIPPATH!" 2>nul
		exit /b 1
	)
	REM ... and the install pack must not ship CI-only or packaging files
	findstr /b /l /c:"WhichWay/.github/" /c:"WhichWay/scripts/" "%TEMPDIR%\ziplist.txt" >nul
	if not errorlevel 1 (
		echo [ERROR] zip sanity failed: it contains .github\ or scripts\.
		del "!ZIPPATH!" 2>nul
		exit /b 1
	)
	del "%TEMPDIR%\ziplist.txt" 2>nul
)

for %%z in ("!ZIPPATH!") do set "ZIPSIZE=%%~zz"
echo       !ZIPNAME!  ^(!ZIPSIZE! bytes, top level WhichWay/^)
exit /b 0
