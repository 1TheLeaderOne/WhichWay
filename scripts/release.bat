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
REM    release.bat --push-only <version>
REM
REM    version    tag name, must start with "v", e.g. v1.5.3 (required)
REM    baseline   tag/commit that output-core diffs against, e.g. v1.5
REM               default: latest v* tag reachable from output branch
REM    --push-only  skip build/commit/tag entirely and only push the refs that
REM                 already exist locally. Use it to finish a release whose
REM                 push failed (network down, proxy off, ...) without
REM                 rebuilding and re-tagging.
REM
REM  Examples:
REM    release.bat v1.5.3               -> tag v1.5.3, output-core: v1.5.2 -> v1.5.3
REM    release.bat v1.6.0 v1.5          -> tag v1.6.0, output-core: v1.5 -> v1.6.0
REM    release.bat --push-only v1.5.3   -> push existing deps/branches/tag only
REM
REM  Notes:
REM  - Uses plumbing git commands, never switches branches, never
REM    touches your worktree.
REM  - Branches and the tag are pushed in ONE atomic push, so the tag and
REM    the three branch heads always reach the remote together (the workflow
REM    relies on that).
REM  - Because that push is atomic, a SINGLE rejected ref (typically a tag
REM    that already exists on the remote) takes every branch down with it.
REM    The remote is therefore probed BEFORE pushing: an identical tag is
REM    dropped from the ref list, a conflicting tag aborts with instructions.
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
set "PUSHONLY="
set "VERSION="
set "BASELINE="
if /i "%~1"=="--push-only" (
	set "PUSHONLY=1"
	set "VERSION=%~2"
	set "BASELINE=%~3"
) else (
	set "VERSION=%~1"
	set "BASELINE=%~2"
)
if "%VERSION%"=="" (
	echo [Usage] release.bat ^<version^> [baseline]
	echo         release.bat --push-only ^<version^>
	echo.
	echo   release.bat v1.5.3              full build + release, tag v1.5.3
	echo   release.bat v1.5.3 v1.5.2       same, output-core baseline v1.5.2
	echo   release.bat --push-only v1.5.3   push existing refs only - no rebuild
	echo.
	echo existing tags:
	git tag -l "v*"
	exit /b 1
)

REM ---- normalize version ----
set "VFIRST=%VERSION:~0,1%"
if /i not "%VFIRST%"=="v" (
	echo [ERROR] version must start with "v", e.g. v1.5.3
	exit /b 1
)
if "%VERSION%"=="v" (
	echo [ERROR] version must not be just "v".
	exit /b 1
)
if /i "%VFIRST%"=="V" set "VERSION=v%VERSION:~1%"

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

REM ---- precheck: the four release branches must exist ----
for %%b in (dev dev-output output output-core) do (
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

echo [INFO] version  = %VERSION%
if defined PUSHONLY (
	echo [INFO] mode     = push-only ^(no build: push the refs that are already local^)
) else (
	echo [INFO] mode     = full build + release
)
echo [INFO] branch   = %ORIGBRANCH%   dev head = !DEVSHA!  ^(dev unpushed: !DEVAHEAD!^)
if /i not "%ORIGBRANCH%"=="dev" (
	echo [WARN] current branch is %ORIGBRANCH%, not dev. The -dev release asset is built
	echo        from the dev branch, which may not match the source used for this build.
)
echo.

if defined PUSHONLY goto :refs_ready

REM ---- precheck: the tag must not exist yet ----
set "TAGEXIST="
for /f "delims=" %%x in ('git rev-parse --verify --quiet "refs/tags/%VERSION%" 2^>nul') do set "TAGEXIST=1"
if defined TAGEXIST (
	echo [ERROR] tag %VERSION% already exists locally. Delete it or use another version:
	echo             git tag -d %VERSION%
	echo         Prefer a NEW version number: the same tag may also exist on the
	echo         remote already, and a remote tag can never be overwritten by a
	echo         normal push.
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
echo [INFO] baseline = %BASELINE%   ^(output-core will contain the diff %BASELINE% -^> %VERSION%^)

REM ---- early check: has this version been released already? ----
REM Cheap remote probe BEFORE the (slow) build. A version that already exists
REM on the remote can never be pushed: the tag would be rejected, and because
REM the push is atomic that rejection would take all four branches with it.
REM The same probe runs again right before pushing; this one only exists to
REM fail fast instead of after a multi-minute build.
set "LSRTMP=%TEMPDIR%\ls-remote.tmp"
set "REMOTEPRE="
echo [INFO] probing origin for an existing %VERSION% tag...
git ls-remote --tags origin "refs/tags/%VERSION%" > "%LSRTMP%" 2>&1
if errorlevel 1 (
	echo [WARN] cannot probe origin right now - network / proxy problem? The build will
	echo [WARN] continue; the push step checks the remote again before pushing.
	echo [WARN] git said:
	type "%LSRTMP%"
	echo.
) else (
	for /f "usebackq tokens=1" %%a in ("%LSRTMP%") do if not defined REMOTEPRE set "REMOTEPRE=%%a"
	if defined REMOTEPRE (
		echo.
		echo [ERROR] tag %VERSION% ALREADY EXISTS on origin at !REMOTEPRE!.
		echo [ERROR] A released version can not be published twice - pick a NEW one:
		echo             release.bat vX.Y.Z
		echo         only if that remote tag is a leftover you mean to replace:
		echo             git push origin :refs/tags/%VERSION%
		echo             release.bat --push-only %VERSION%
		echo.
		echo existing tags ^(local^):
		git tag -l "v*"
		exit /b 1
	)
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
echo [4/6] create output-core incremental pack ^(%BASELINE% -^> %VERSION%^)...
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
:refs_ready
REM ---- push-only mode: re-read the refs that the build step would have left
REM      in memory (nothing was rebuilt, so they must come from the repo).
if defined PUSHONLY (
	set "DOCOMMIT="
	set "MERGE="
	set "CORE="
	for /f "delims=" %%a in ('git rev-parse refs/heads/dev-output') do set "DOCOMMIT=%%a"
	for /f "delims=" %%a in ('git rev-parse refs/heads/output') do set "MERGE=%%a"
	for /f "delims=" %%a in ('git rev-parse refs/heads/output-core') do set "CORE=%%a"
	if "!MERGE!"=="" (
		echo [ERROR] cannot read refs/heads/output.
		exit /b 1
	)
)
set "PUSHREFS=dev dev-output output output-core"
set "PUSHTAG=%VERSION%"

echo.
echo [INFO] refs to publish:
echo       dev-output   !DOCOMMIT!
echo       output       !MERGE!   ^(tag %VERSION%^)
echo       output-core  !CORE!
echo       dev          !DEVSHA!   ^(dev unpushed: !DEVAHEAD!^)
echo.

REM ============================================================
REM remote preflight: reachability + release-tag collision
REM
REM The push below is atomic: if ANY ref is rejected, NOTHING is pushed - a
REM tag that already exists on the remote would silently keep all four
REM branches from being published. So the remote tag is checked first and
REM dropped from the ref list when the remote already has it at the SAME
REM commit; a tag that points elsewhere aborts with a fix, because GitHub
REM would otherwise keep serving the OLD release for this version.
REM ============================================================
set "LSRTMP=%TEMPDIR%\ls-remote.tmp"
if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
set "REMOTETAGHASH="
echo [INFO] checking origin - reachability + release-tag collision...
git ls-remote --tags origin "refs/tags/%VERSION%" > "%LSRTMP%" 2>&1
if errorlevel 1 goto :remote_unreachable

for /f "usebackq tokens=1" %%a in ("%LSRTMP%") do if not defined REMOTETAGHASH set "REMOTETAGHASH=%%a"

if defined REMOTETAGHASH (
	set "LOCALTAGHASH="
	for /f "delims=" %%a in ('git rev-parse "refs/tags/%VERSION%"') do set "LOCALTAGHASH=%%a"
	if /i "!LOCALTAGHASH!"=="!REMOTETAGHASH!" (
		echo [INFO] tag %VERSION% is already on origin at !REMOTETAGHASH! - it will be
		echo [INFO] skipped, only the four branches are pushed.
		set "PUSHTAG="
	) else (
		echo.
		echo [ERROR] tag %VERSION% ALREADY EXISTS on origin, pointing at a DIFFERENT commit:
		echo           origin : !REMOTETAGHASH!
		echo           local  : !LOCALTAGHASH!
		echo [ERROR] The push is atomic, so with this tag in the list NOTHING would be
		echo [ERROR] pushed - not even the branches. Pick one of these:
		echo.
		echo   1^) Recommended - publish under a NEW version number:
		echo          release.bat vX.Y.Z
		echo   2^) Only if the remote tag is a leftover you mean to replace:
		echo          git push origin :refs/tags/%VERSION%
		echo          release.bat --push-only %VERSION%
		echo.
		exit /b 1
	)
)

if defined PUSHTAG (
	echo [INFO] will push ^(atomic^): !PUSHREFS! %VERSION%
) else (
	echo [INFO] will push ^(atomic^): !PUSHREFS!   ^(tag %VERSION% already on origin^)
)
echo.
echo     Press any key to push, Ctrl+C to cancel. Local commits and tags are kept.
pause >nul

if defined PUSHTAG (
	git push --atomic origin !PUSHREFS! %VERSION%
) else (
	git push --atomic origin !PUSHREFS!
)
if errorlevel 1 (
	echo.
	echo [ERROR] push failed. With --atomic nothing was pushed; every commit and the
	echo         tag are still local, so you can retry WITHOUT rebuilding:
	echo             scripts\release.bat --push-only %VERSION%
	echo         Manual equivalent:
	if defined PUSHTAG (
		echo             git push --atomic origin !PUSHREFS! %VERSION%
	) else (
		echo             git push --atomic origin !PUSHREFS!
	)
	echo         If the remote rejects --atomic, push branches first, then the tag:
	echo             git push origin !PUSHREFS!
	if defined PUSHTAG echo             git push origin %VERSION%
	echo         Remote moved ahead ^(re-run failed after a partial push^)? Check with:
	echo             git fetch origin ^&^& git log --oneline HEAD..origin/output
	exit /b 1
)

del "%LSRTMP%" 2>nul
rd /s /q "%TEMPDIR%" 2>nul

echo.
echo [DONE] release %VERSION% complete.
if defined PUSHTAG (
	echo        pushed: dev-output / output / output-core / dev / tag %VERSION%
) else (
	echo        pushed: dev-output / output / output-core / dev
	echo        tag %VERSION% was already up to date on origin.
)
echo        GitHub Actions now attaches to the %VERSION% release:
echo          WhichWay-%VERSION%.zip        ^(output^)
echo          WhichWay-%VERSION%-core.zip   ^(output-core^)
echo          WhichWay-%VERSION%-dev.zip    ^(dev^)
echo        still on !ORIGBRANCH!, worktree untouched.
endlocal
exit /b 0

REM ============================================================
REM remote unreachable: turn git's error into an actionable hint
REM ============================================================
:remote_unreachable
echo [ERROR] cannot reach remote "origin". git said:
type "%LSRTMP%"
echo.
findstr /i /c:"could not connect" /c:"failed to connect" /c:"connection refused" /c:"operation timed out" /c:"could not resolve host" /c:"proxy" "%LSRTMP%" >nul 2>&1
if not errorlevel 1 (
	echo [HINT] Network / proxy problem. If you use a local proxy, start it first and
	echo [HINT] check what git is pointed at:
	echo [HINT]     git config --global --get http.proxy
	echo [HINT]     git config --global http.proxy http://127.0.0.1:7897
)
findstr /i /c:"CRYPT_E_REVOCATION_OFFLINE" /c:"schannel" "%LSRTMP%" >nul 2>&1
if not errorlevel 1 (
	echo [HINT] Windows TLS revocation check failed ^(common when a proxy is involved^).
	echo [HINT] Fix the proxy, or disable that check for git:
	echo [HINT]     git config --global http.schannelCheckRevoke false
)
echo [HINT] Nothing was pushed and nothing else was touched. Once the network is
echo [HINT] back, finish the release without rebuilding:
echo [HINT]     scripts\release.bat --push-only %VERSION%
exit /b 1
