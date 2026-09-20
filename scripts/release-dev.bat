@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay dev-output sync
REM
REM  Builds the extension and pushes ONLY the dev-output branch
REM  (the build tree produced from dev). Use it when you just want
REM  the build branch up to date without doing a release:
REM    - no tag, no output / output-core merge
REM    - no GitHub Release, no archives
REM    - dev itself is not pushed either
REM
REM  Full release (all branches + tag + archives): scripts\release.bat
REM
REM  Usage:
REM    release-dev.bat                build + sync dev-output
REM    release-dev.bat --push-only    push the existing local dev-output only
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

REM ---- args ----
set "PUSHONLY="
if /i "%~1"=="--push-only" (
	set "PUSHONLY=1"
) else if not "%~1"=="" (
	echo [ERROR] unknown option: %~1
	echo.
	echo   release-dev.bat               build + sync dev-output
	echo   release-dev.bat --push-only   push the existing local dev-output only
	exit /b 1
)

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
	echo [INFO] mode     = push-only ^(no build: push the existing local dev-output^)
) else (
	echo [INFO] mode     = build + sync dev-output
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
REM [1/3] build
REM ============================================================
echo [1/3] build extension...
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
REM [2/3] dev-output: build tree via temp index, commit, update-ref
REM ============================================================
echo [2/3] create dev-output commit...
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
REM [3/3] push dev-output (with pause)
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
echo        pushed: dev-output only ^(no tag, no output / output-core, no release^)
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
exit /b 0
