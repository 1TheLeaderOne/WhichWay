@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay one-key release
REM
REM  Branches involved:
REM    dev          source branch (development)
REM    dev-output   build tree produced from dev
REM    output       full package, merge of output + dev-output
REM    output-core  incremental pack (overwrite install to upgrade)
REM
REM  Tags created by every release (pick one in GitHub "New release"):
REM    <version>       -> output       full package
REM    <version>-core  -> output-core  incremental pack
REM    <version>-dev   -> dev          source at release time
REM
REM  Usage:
REM    release.bat <version> [baseline]
REM
REM    version   tag base name, must start with "v", e.g. v1.5.2 (required)
REM    baseline  tag/commit that output-core diffs against, e.g. v1.5
REM              default: latest v* tag reachable from output branch
REM
REM  Examples:
REM    release.bat v1.5.2        -> tags v1.5.2 / v1.5.2-core / v1.5.2-dev
REM                                 output-core: v1.5.1 -> v1.5.2
REM    release.bat v1.6.0 v1.5   -> tags v1.6.0 / v1.6.0-core / v1.6.0-dev
REM                                 output-core: v1.5 -> v1.6.0
REM
REM  Notes:
REM  - Uses plumbing git commands, never switches branches, never
REM    touches your worktree.
REM  - The -dev tag always points at refs/heads/dev, so commit everything
REM    you want to release on dev before running this script.
REM  - Build output goes to apps/core/extension/WhichWay (overwritten).
REM  - Scratch files (temp index, commit messages, baseline) are written to
REM    %TEMP%\whichway-release, so a failed run never dirties the repo.
REM  - Pauses before pushing so you can review.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- derive paths from script location (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
for %%I in ("%REPO%\..\..\..") do set "ROOT=%%~fI"
set "BUILD=%ROOT%\apps\core\extension\WhichWay"

REM ---- scratch files live in %TEMP% so a failed run never dirties the repo ----
set "TEMPDIR=%TEMP%\whichway-release"
if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
set "TMPIDX=%TEMPDIR%\index.tmp"
set "COREIDX=%TEMPDIR%\core-index.tmp"
set "MSGDEV=%TEMPDIR%\msg-dev.txt"
set "MSGOUT=%TEMPDIR%\msg-out.txt"
set "MSGCORE=%TEMPDIR%\msg-core.txt"
set "DESCTMP=%TEMPDIR%\baseline.tmp"

cd /d "%REPO%" || (echo [ERROR] repo dir not found: %REPO% & exit /b 1)

REM ---- args ----
set "VERSION=%~1"
set "BASELINE=%~2"
if "%VERSION%"=="" (
	echo [Usage] release.bat ^<version^> [baseline]
	echo.
	echo   release.bat v1.5.2          creates v1.5.2 / v1.5.2-core / v1.5.2-dev
	echo   release.bat v1.5.2 v1.5     same, output-core baseline v1.5
	echo.
	echo existing tags:
	git tag -l "v*"
	exit /b 1
)

REM ---- normalize version + derive the per-branch tag names ----
set "VFIRST=%VERSION:~0,1%"
if /i not "%VFIRST%"=="v" (
	echo [ERROR] version must start with "v", e.g. v1.5.2
	exit /b 1
)
if "%VERSION%"=="v" (
	echo [ERROR] version must not be just "v".
	exit /b 1
)
if /i "%VFIRST%"=="V" set "VERSION=v%VERSION:~1%"
set "TAGCORE=%VERSION%-core"
set "TAGDEV=%VERSION%-dev"

REM ---- precheck: working tree must be clean ----
set HASCHANGES=
for /f "delims=" %%i in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
	echo [ERROR] working tree has uncommitted changes. Commit or stash first:
	git status --short
	exit /b 1
)

REM ---- precheck: the four release branches must exist ----
for %%b in (dev dev-output output output-core) do (
	git rev-parse --verify --quiet "refs/heads/%%b" >nul 2>&1 || (
		echo [ERROR] branch %%b missing. Initialize it first.
		exit /b 1
	)
)

REM ---- precheck: none of the three tags may exist yet ----
for %%t in (%VERSION% %TAGCORE% %TAGDEV%) do (
	set "TAGEXIST="
	for /f "delims=" %%x in ('git rev-parse --verify --quiet "refs/tags/%%t" 2^>nul') do set "TAGEXIST=1"
	if defined TAGEXIST (
		echo [ERROR] tag %%t already exists. Delete it or use another version:
		echo         git tag -d %%t
		exit /b 1
	)
)

REM ---- baseline (previous output tag) ----
REM NOTE: inside "for /f ('cmd')" cmd turns "=" into a space, which breaks
REM       --abbrev=0 / --match=v*. So run the command normally, capture the
REM       result into a temp file, then read that file back.
if "%BASELINE%"=="" (
	git describe --tags --abbrev=0 --match=v* --exclude=*-core --exclude=*-dev output > "%DESCTMP%" 2>nul
	for /f "usebackq delims=" %%t in ("%DESCTMP%") do set BASELINE=%%t
	del "%DESCTMP%" 2>nul
	if "!BASELINE!"=="" (
		echo [ERROR] no tag found on output branch. Pass baseline explicitly, e.g. release.bat %VERSION% v1.5
		exit /b 1
	)
)
git rev-parse --verify --quiet "%BASELINE%" >nul 2>&1 || (
	echo [ERROR] baseline "%BASELINE%" is not a valid tag/commit.
	exit /b 1
)

REM ---- remember current branch + dev head ----
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set ORIGBRANCH=%%b
set "DEVSHA="
for /f "delims=" %%d in ('git rev-parse refs/heads/dev') do set DEVSHA=%%d
set "DEVAHEAD=0"
for /f "delims=" %%n in ('git rev-list --count origin/dev..refs/heads/dev 2^>nul') do set DEVAHEAD=%%n

echo [INFO] version  = %VERSION%
echo [INFO] tags     = %VERSION%  %TAGCORE%  %TAGDEV%
echo [INFO] baseline = %BASELINE%
echo [INFO] branch   = %ORIGBRANCH%   dev head = !DEVSHA!  ^(unpushed: !DEVAHEAD!^)
if /i not "%ORIGBRANCH%"=="dev" (
	echo [WARN] current branch is %ORIGBRANCH%, not dev. The %TAGDEV% tag points at
	echo        refs/heads/dev, which may differ from the source used for this build.
)
echo.

REM ---- precheck: build toolchain (vite) ----
set "VITEBIN=%REPO%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" set "VITEBIN=%ROOT%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" (
	echo [ERROR] vite not found. Run "pnpm install" in the workspace root first.
	exit /b 1
)

REM ============================================================
REM [1/7] build
REM ============================================================
echo [1/7] build extension...
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

REM ---- build sanity: a no-op/failed build must never become an empty release ----
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
REM [2/7] dev-output: build tree via temp index, commit, update-ref
REM ============================================================
echo [2/7] create dev-output commit...
del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
git --work-tree="%BUILD%" add -A
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
set "DOCOMMIT="
for /f "delims=" %%c in ('git commit-tree !TREE! -p dev-output -F "%MSGDEV%"') do set DOCOMMIT=%%c
if "!DOCOMMIT!"=="" (
	echo [ERROR] commit-tree failed, dev-output not created.
	exit /b 1
)
git update-ref refs/heads/dev-output !DOCOMMIT!
echo       dev-output = !DOCOMMIT!

REM ============================================================
REM [3/7] output: merge commit (no-ff) + full-package tag
REM ============================================================
echo [3/7] create output merge commit and tag %VERSION%...
> "%MSGOUT%" echo output: %VERSION% merge from dev-output
>>"%MSGOUT%" echo incremental diff published on output-core branch
set "MERGE="
for /f "delims=" %%c in ('git commit-tree !TREE! -p output -p dev-output -F "%MSGOUT%"') do set MERGE=%%c
if "!MERGE!"=="" (
	echo [ERROR] commit-tree failed, output not created.
	exit /b 1
)
git update-ref refs/heads/output !MERGE!
git tag %VERSION% !MERGE!
echo       output = !MERGE!  ^(tag %VERSION%^)

REM ============================================================
REM [4/7] output-core: incremental pack (Node helper handles CJK paths)
REM ============================================================
echo [4/7] create output-core incremental pack (%BASELINE% -^> %VERSION%)...
node "%SCRIPTS%make-core-index.cjs" "%BASELINE%" "!MERGE!" "%COREIDX%"
if errorlevel 1 (
	echo [ERROR] make-core-index failed.
	exit /b 1
)

REM ---- guard: an empty index-info file makes update-index fail and would
REM      silently produce an empty output-core pack.
set "CORESIZE=0"
for %%A in ("%COREIDX%") do set "CORESIZE=%%~zA"
if not defined CORESIZE set "CORESIZE=0"
if !CORESIZE! LEQ 1 (
	echo [WARN] incremental pack is EMPTY - no added or modified file between
	echo [WARN] %BASELINE% and %VERSION%. output-core will be created empty; only a
	echo [WARN] release that purely deletes files can legitimately look like this.
)
del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
if !CORESIZE! GTR 1 (
	git update-index --index-info < "%COREIDX%"
	if errorlevel 1 (
		set "GIT_INDEX_FILE="
		echo [ERROR] git update-index --index-info failed.
		exit /b 1
	)
)
set "CORETREE="
for /f "delims=" %%t in ('git write-tree') do set CORETREE=%%t
set "GIT_INDEX_FILE="
del "%TMPIDX%" 2>nul
if "!CORETREE!"=="" (
	echo [ERROR] output-core tree build failed.
	exit /b 1
)

> "%MSGCORE%" echo output-core: %VERSION% incremental pack
>>"%MSGCORE%" echo baseline %BASELINE% -^> %VERSION% (output)
>>"%MSGCORE%" echo overwrite install to upgrade
set "CORE="
for /f "delims=" %%c in ('git commit-tree !CORETREE! -p output-core -F "%MSGCORE%"') do set CORE=%%c
if "!CORE!"=="" (
	echo [ERROR] commit-tree failed, output-core not created.
	exit /b 1
)
git update-ref refs/heads/output-core !CORE!
git tag %TAGCORE% !CORE!
echo       output-core = !CORE!  ^(tag %TAGCORE%^)

REM ============================================================
REM [5/7] dev: tag the source branch head
REM ============================================================
echo [5/7] tag dev head as %TAGDEV%...
if "!DEVSHA!"=="" (
	echo [ERROR] could not resolve refs/heads/dev.
	exit /b 1
)
git tag %TAGDEV% !DEVSHA!
echo       dev = !DEVSHA!  ^(tag %TAGDEV%^)

REM ============================================================
REM [6/7] cleanup scratch files
REM ============================================================
del "%COREIDX%" "%MSGDEV%" "%MSGOUT%" "%MSGCORE%" "%DESCTMP%" 2>nul
rd /s /q "%TEMPDIR%" 2>nul

REM ============================================================
REM [7/7] push (with pause)
REM ============================================================
echo.
echo [INFO] local done. About to push (atomic: all refs or none):
echo     branches:
echo       dev-output   !DOCOMMIT!
echo       output       !MERGE!   ^(tag %VERSION%^)
echo       output-core  !CORE!   ^(tag %TAGCORE%^)
echo       dev          !DEVSHA!   ^(tag %TAGDEV%^)  unpushed commits: !DEVAHEAD!
echo     tags:
echo       %VERSION%  %TAGCORE%  %TAGDEV%
echo.
echo     Press any key to push, Ctrl+C to cancel. Local commits and tags are kept.
pause >nul
git push --atomic origin dev-output output output-core dev %VERSION% %TAGCORE% %TAGDEV%
if errorlevel 1 (
	echo [ERROR] push failed. With --atomic nothing was pushed; local commits and
	echo         tags are kept. Retry:
	echo             git push --atomic origin dev-output output output-core dev %VERSION% %TAGCORE% %TAGDEV%
	echo         If the remote does not support --atomic, drop the flag and push
	echo         branches first, then tags.
	exit /b 1
)
echo.
echo [DONE] release %VERSION% complete.
echo        tags pushed: %VERSION%  %TAGCORE%  %TAGDEV%
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
