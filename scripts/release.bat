@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay one-key release (dev-output / output / output-core)
REM
REM  Usage:
REM    release.bat <version> [baseline]
REM
REM    version   new tag name, e.g. v1.4.3 (required)
REM    baseline  tag/commit that output-core diffs against, e.g. v1.4
REM              default: latest tag reachable from output branch
REM
REM  Examples:
REM    release.bat v1.4.3          -> output-core: v1.4.2 .. v1.4.3
REM    release.bat v1.5.0 v1.4     -> output-core: v1.4   .. v1.5.0
REM
REM  Notes:
REM  - Uses plumbing git commands, never switches branches, never
REM    touches your worktree.
REM  - Build output goes to apps/core/extension/WhichWay (overwritten).
REM  - Pauses before pushing so you can review.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- derive paths from script location (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
for %%I in ("%REPO%\..\..\..") do set "ROOT=%%~fI"
set "BUILD=%ROOT%\apps\core\extension\WhichWay"

cd /d "%REPO%" || (echo [ERROR] repo dir not found: %REPO% & exit /b 1)

REM ---- args ----
set "VERSION=%~1"
set "BASELINE=%~2"
if "%VERSION%"=="" (
	echo [Usage] release.bat ^<version^> [baseline]
	echo.
	echo existing tags:
	git tag -l "v*"
	exit /b 1
)

REM ---- precheck: working tree must be clean ----
set HASCHANGES=
for /f "delims=" %%i in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
	echo [ERROR] working tree has uncommitted changes. Commit or stash first:
	git status --short
	exit /b 1
)

REM ---- baseline ----
if "%BASELINE%"=="" (
	for /f "delims=" %%t in ('git describe --tags --abbrev=0 output 2^>nul') do set BASELINE=%%t
	if "!BASELINE!"=="" (
		echo [ERROR] no tag found on output branch. Pass baseline explicitly, e.g. release.bat %VERSION% v1.4
		exit /b 1
	)
)
git rev-parse --verify --quiet "%BASELINE%" >nul 2>&1 || (
	echo [ERROR] baseline "%BASELINE%" is not a valid tag/commit.
	exit /b 1
)

REM ---- check the three branches exist ----
for %%b in (dev-output output output-core) do (
	git rev-parse --verify --quiet "refs/heads/%%b" >nul 2>&1 || (
		echo [ERROR] branch %%b missing. Initialize it first.
		exit /b 1
	)
)

echo [INFO] version=%VERSION%  baseline=%BASELINE%
echo.

REM ---- remember current branch ----
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set ORIGBRANCH=%%b

REM ---- precheck: build toolchain (vite) ----
set "VITEBIN=%REPO%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" set "VITEBIN=%ROOT%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" (
	echo [ERROR] vite not found. Run "pnpm install" in the workspace root first.
	exit /b 1
)

REM ============================================================
REM [1/6] build
REM ============================================================
echo [1/6] build extension...
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

set "TMPIDX=%REPO%\.release-idx"
set "COREIDX=%SCRIPTS%core-index.tmp"
set "MSGDEV=%SCRIPTS%msg-dev.txt"
set "MSGOUT=%SCRIPTS%msg-out.txt"
set "MSGCORE=%SCRIPTS%msg-core.txt"

REM ============================================================
REM [2/6] dev-output: build tree via temp index, commit, update-ref
REM ============================================================
echo [2/6] create dev-output commit...
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
REM [3/6] output: merge commit (no-ff) + tag
REM ============================================================
echo [3/6] create output merge commit and tag %VERSION%...
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
REM [4/6] output-core: incremental pack (Node helper handles CJK paths)
REM ============================================================
echo [4/6] create output-core incremental pack (%BASELINE% -^> %VERSION%)...
node "%SCRIPTS%make-core-index.cjs" "%BASELINE%" "!MERGE!" "%COREIDX%"
if errorlevel 1 (
	echo [ERROR] make-core-index failed.
	exit /b 1
)

del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
git update-index --index-info < "%COREIDX%"
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
echo       output-core = !CORE!

REM ============================================================
REM [5/6] cleanup temp files
REM ============================================================
del "%COREIDX%" "%MSGDEV%" "%MSGOUT%" "%MSGCORE%" 2>nul

REM ============================================================
REM [6/6] push (with pause)
REM ============================================================
echo.
echo [INFO] local done. About to push:
echo     dev-output  !DOCOMMIT!
echo     output      !MERGE!  ^(tag %VERSION%^)
echo     output-core !CORE!
echo     tag         %VERSION%
echo.
echo     Press any key to push, Ctrl+C to cancel. Local commits are kept.
pause >nul
git push origin dev-output output output-core
if errorlevel 1 (
	echo [ERROR] branch push failed. Retry: git push origin dev-output output output-core
	exit /b 1
)
git push origin %VERSION%
if errorlevel 1 (
	echo [ERROR] tag push failed. Retry: git push origin %VERSION%
	exit /b 1
)
echo.
echo [DONE] release %VERSION% complete.
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
