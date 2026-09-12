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
REM  One release = ONE tag:
REM    <version>    points at the output branch head (merge commit)
REM
REM  GitHub Actions (.github/workflows/release.yml) fires on that tag and
REM  attaches three archives to the GitHub Release, so a single release page
REM  carries all three variants:
REM    WhichWay-<version>.zip        full package  (tag tree)
REM    WhichWay-<version>-core.zip   incremental   (output-core branch)
REM    WhichWay-<version>-dev.zip    source        (dev branch)
REM
REM  Usage:
REM    release.bat <version> [baseline]
REM
REM    version   tag name, must start with "v", e.g. v1.5.2 (required)
REM    baseline  tag/commit that output-core diffs against, e.g. v1.5
REM              default: latest v* tag reachable from output branch
REM
REM  Examples:
REM    release.bat v1.5.2        -> tag v1.5.2, output-core: v1.5.1 -> v1.5.2
REM    release.bat v1.6.0 v1.5   -> tag v1.6.0, output-core: v1.5 -> v1.6.0
REM
REM  Notes:
REM  - Uses plumbing git commands, never switches branches, never
REM    touches your worktree.
REM  - Branches and the tag are pushed in ONE atomic push, so the tag and
REM    the three branch heads always reach the remote together (the workflow
REM    relies on that).
REM  - dev is pushed too, because the -dev asset is built from the dev branch.
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
	echo   release.bat v1.5.2          tag v1.5.2, baseline = previous v* tag
	echo   release.bat v1.5.2 v1.5     tag v1.5.2, output-core baseline v1.5
	echo.
	echo existing tags:
	git tag -l "v*"
	exit /b 1
)

REM ---- normalize version ----
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

REM ---- precheck: the tag must not exist yet ----
set "TAGEXIST="
for /f "delims=" %%x in ('git rev-parse --verify --quiet "refs/tags/%VERSION%" 2^>nul') do set "TAGEXIST=1"
if defined TAGEXIST (
	echo [ERROR] tag %VERSION% already exists. Delete it or use another version:
	echo         git tag -d %VERSION%
	exit /b 1
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
echo [INFO] baseline = %BASELINE%
echo [INFO] branch   = %ORIGBRANCH%   dev head = !DEVSHA!  ^(dev unpushed: !DEVAHEAD!^)
if /i not "%ORIGBRANCH%"=="dev" (
	echo [WARN] current branch is %ORIGBRANCH%, not dev. The -dev release asset is built
	echo        from the dev branch, which may not match the source used for this build.
)
if not exist "%REPO%\.github\workflows\release.yml" (
	echo [WARN] .github/workflows/release.yml is missing: nothing will attach the three
	echo        branch archives to the GitHub Release; you would have to add them by hand.
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
REM [2/6] dev-output: build tree via temp index, commit, update-ref
REM ============================================================
echo [2/6] create dev-output commit...
del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
git --work-tree="%BUILD%" add -A
REM ---- The tagged tree must contain the CI workflow: GitHub only runs a
REM      workflow for a tag push when that file exists at the tagged commit.
REM      It is injected into the tree here, not into the build dir, so the
REM      local build output stays clean and the release archives can still
REM      exclude .github.
if exist "%REPO%\.github\workflows\release.yml" (
	set "WFBLOB="
	for /f "delims=" %%h in ('git hash-object -w "%REPO%\.github\workflows\release.yml"') do set WFBLOB=%%h
	if not "!WFBLOB!"=="" git update-index --add --cacheinfo 100644,!WFBLOB!,.github/workflows/release.yml
) else (
	echo [WARN] .github/workflows/release.yml missing: the tagged tree will not carry
	echo [WARN] a workflow, so no release assets will be generated for that tag.
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
set "DOCOMMIT="
for /f "delims=" %%c in ('git commit-tree !TREE! -p dev-output -F "%MSGDEV%"') do set DOCOMMIT=%%c
if "!DOCOMMIT!"=="" (
	echo [ERROR] commit-tree failed, dev-output not created.
	exit /b 1
)
git update-ref refs/heads/dev-output !DOCOMMIT!
echo       dev-output = !DOCOMMIT!

REM ============================================================
REM [3/6] output: merge commit (no-ff) + the release tag
REM ============================================================
echo [3/6] create output merge commit and tag %VERSION%...
> "%MSGOUT%" echo output: %VERSION% merge from dev-output
>>"%MSGOUT%" echo release assets built from output / output-core / dev
>>"%MSGOUT%" echo dev-commit: !DEVSHA!
>>"%MSGOUT%" echo baseline: %BASELINE%
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
echo       output-core = !CORE!

REM ============================================================
REM [5/6] cleanup scratch files
REM ============================================================
del "%COREIDX%" "%MSGDEV%" "%MSGOUT%" "%MSGCORE%" "%DESCTMP%" 2>nul
rd /s /q "%TEMPDIR%" 2>nul

REM ============================================================
REM [6/6] push (with pause)
REM ============================================================
echo.
echo [INFO] local done. About to push (atomic: all refs or none):
echo       dev-output   !DOCOMMIT!
echo       output       !MERGE!   ^(tag %VERSION%^)
echo       output-core  !CORE!
echo       dev          !DEVSHA!   ^(dev unpushed: !DEVAHEAD!^)
echo       tag          %VERSION%
echo.
echo     Press any key to push, Ctrl+C to cancel. Local commits and tags are kept.
pause >nul
git push --atomic origin dev-output output output-core dev %VERSION%
if errorlevel 1 (
	echo [ERROR] push failed. With --atomic nothing was pushed; local commits and
	echo         the tag are kept. Retry:
	echo             git push --atomic origin dev-output output output-core dev %VERSION%
	echo         If the remote does not support --atomic, drop the flag and push
	echo         branches first, then the tag.
	exit /b 1
)
echo.
echo [DONE] release %VERSION% complete.
echo        pushed: dev-output / output / output-core / dev / tag %VERSION%
echo        GitHub Actions now attaches to the %VERSION% release:
echo          WhichWay-%VERSION%.zip        ^(output^)
echo          WhichWay-%VERSION%-core.zip   ^(output-core^)
echo          WhichWay-%VERSION%-dev.zip    ^(dev^)
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
