@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay release toolkit - build / publish / pack, one script
REM
REM  Four jobs in one file (they used to be three files):
REM    release   full release   : build + dev-output + output(tag)
REM              + output-core + export + atomic push   (was release.bat)
REM    dev       dev sync       : build + push dev-output only,
REM              plus a local zip of the build tree  (was release-dev.bat)
REM    pack      local packages : export output / output-core from their
REM              branches when release\ is missing, then zip into scripts\
REM              (was pack-local.bat)
REM    core      local diff     : zip only the files added/modified between
REM              two versions; no branch, tag, or push
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
REM    release.bat release ^<version^> [baseline] [--push-only]
REM    release.bat dev [--no-zip] [--push-only] [--password]
REM    release.bat pack [output|core|all] [--password]
REM    release.bat core ^<version^> ^<baseline^> [--password]
REM
REM    version    tag name, must start with "v", e.g. v1.5.3 (required)
REM    baseline   tag/commit that output-core diffs against, e.g. v1.5
REM               default: latest v* tag reachable from output branch
REM    --push-only  skip build/commit/tag and only push refs that already
REM               exist locally. Finish a release whose push failed
REM               (network down, proxy off, ...) without rebuilding.
REM    --no-zip   (dev) skip the local zip of the build tree
REM    output|core|all  (pack) which package to zip; default all
REM    --password (dev/pack/core) prompt once, hidden, and AES-256 encrypt
REM               every local zip this command writes. WW_ZIP_PASSWORD
REM               supplies the password without a prompt (automation).
REM               dev --push-only / --no-zip write no zip and ignore it.
REM
REM  Flags may appear in any order:
REM    release.bat release v1.5.3 --push-only      works
REM    release.bat release --push-only v1.5.3      works too
REM
REM  Examples:
REM    release.bat release v1.5.3            tag v1.5.3, core: v1.5.2 -> v1.5.3
REM    release.bat release v1.6.0 v1.5       tag v1.6.0, core: v1.5 -> v1.6.0
REM    release.bat release --push-only v1.5.3   push existing refs only
REM    release.bat dev                       build + zip + sync dev-output
REM    release.bat dev --push-only           push the existing local dev-output
REM    release.bat pack all                  export (if needed) + zip both
REM    release.bat pack all --password       both zips, password protected
REM    release.bat core v1.6 v1.5.6          local diff pack v1.5.6 -^> v1.6
REM    release.bat core v1.6 v1.5.6 --password   same, password protected
REM
REM  Notes:
REM  - Uses plumbing git commands, never switches branches, never
REM    touches your worktree.
REM  - release pushes its refs in ONE atomic push, so the tag and the four
REM    branch heads always reach the remote together (the workflow relies on
REM    that). Because that push is atomic, a SINGLE rejected ref (typically a
REM    tag that already exists on the remote) takes every branch down with it,
REM    so the remote is probed BEFORE pushing: an identical tag is dropped
REM    from the ref list, a conflicting tag aborts with instructions.
REM  - dev is pushed too (by release), because the -dev asset is built from it.
REM  - dev mode makes no tag and merges into no release branch; the local zip
REM    is written next to this script as WhichWay-dev-<sha7>.zip with a
REM    WhichWay/ top level - same layout as the CI archives (drop-in install).
REM  - release mode exports the output / output-core trees into the gitignored
REM    release\ folder so the packages survive locally; zip them with
REM    "release.bat pack". pack re-exports a missing or empty folder from the
REM    output / output-core branch, so it also works on a fresh clone; a
REM    missing branch or a failed export is a hard error (exit code 1).
REM  - Build output goes to apps/core/extension/WhichWay (overwritten).
REM  - The worktree must be clean in build mode (the build reads it).
REM  - The CI workflow is injected into the committed tree: GitHub only runs a
REM    workflow for a tag push when that file exists at the tagged commit.
REM  - Scratch files live in %TEMP%\whichway-release, so a failed run never
REM    dirties the repo.
REM  - Password mode uses Windows' own bsdtar (System32\tar.exe) with ZIP
REM    AES-256; no extra archiver is installed or required. The password is
REM    asked once per command and kept in a temp file only until the zips
REM    are written.
REM  - Windows Explorer's built-in unzip cannot open AES zips; use 7-Zip,
REM    WinRAR or Bandizip to extract them.
REM  - Pauses before pushing so you can review.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- derive paths from script location (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
for %%I in ("%REPO%\..\..\..") do set "ROOT=%%~fI"
set "BUILD=%ROOT%\apps\core\extension\WhichWay"
set "RELDIR=%REPO%\release"

REM ---- scratch files live in %TEMP% so a failed run never dirties the repo ----
set "TEMPDIR=%TEMP%\whichway-release"
if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
set "TMPIDX=%TEMPDIR%\index.tmp"
set "COREIDX=%TEMPDIR%\core-index.tmp"
set "MSGDEV=%TEMPDIR%\msg-dev.txt"
set "MSGOUT=%TEMPDIR%\msg-out.txt"
set "MSGCORE=%TEMPDIR%\msg-core.txt"
set "DESCTMP=%TEMPDIR%\describe.tmp"
set "LSRTMP=%TEMPDIR%\ls-remote.tmp"
set "ZIPLIST=%TEMPDIR%\ziplist.txt"
set "ZIPPASSFILE=%TEMPDIR%\zip-pass.txt"
del "%ZIPPASSFILE%" 2>nul

cd /d "%REPO%" || (echo [ERROR] repo dir not found: %REPO% & exit /b 1)

REM ============================================================
REM command dispatch
REM ============================================================
set "CMD=%~1"
if "%CMD%"=="" goto :usage
if /i "%CMD%"=="release" (
	shift
	goto :do_release
)
if /i "%CMD%"=="dev" (
	shift
	goto :do_dev
)
if /i "%CMD%"=="pack" (
	shift
	goto :do_pack
)
if /i "%CMD%"=="core" (
	shift
	goto :do_core
)
echo [ERROR] unknown command "%CMD%".
echo.
echo   A version is not a command: write the subcommand first, e.g.
echo       release.bat release v1.5.3
echo.
goto :usage

REM ============================================================
REM release: build + dev-output + output(tag) + output-core + push
REM ============================================================
:do_release
set "PUSHONLY="
set "VERSION="
set "BASELINE="
:release_args
if "%~1"=="" goto :release_args_done
if /i "%~1"=="--push-only" (
	set "PUSHONLY=1"
) else if "%VERSION%"=="" (
	set "VERSION=%~1"
) else if "%BASELINE%"=="" (
	set "BASELINE=%~1"
) else (
	echo [ERROR] too many arguments: %~1
	goto :usage
)
shift
goto :release_args
:release_args_done

if "%VERSION%"=="" (
	echo [Usage] release.bat release ^<version^> [baseline] [--push-only]
	echo.
	echo   release.bat release v1.5.3             full build + release
	echo   release.bat release v1.5.3 v1.5.2      output-core baseline v1.5.2
	echo   release.bat release --push-only v1.5.3  push existing refs only
	echo.
	echo existing tags:
	call :list_tags
	goto :the_end
)

REM ---- normalize version ----
call :normalize_version "%VERSION%" || exit /b 1

REM ---- precheck: working tree must be clean (build mode only) ----
if not defined PUSHONLY (
	call :require_clean_tree || exit /b 1
)

REM ---- precheck: the four release branches must exist ----
call :require_branches dev dev-output output output-core || exit /b 1

REM ---- remember current branch + dev head ----
call :remember_head

echo [INFO] version  = %VERSION%
if defined PUSHONLY (
	echo [INFO] mode     = release --push-only ^(no build: push the refs that are already local^)
) else (
	echo [INFO] mode     = release: full build + release
)
call :report_head
if defined PUSHONLY goto :refs_ready

REM ---- precheck: the tag must not exist yet ----
set "TAGEXIST="
for /f "delims=" %%x in ('git rev-parse --verify --quiet "refs/tags/%VERSION%" 2^>nul') do set "TAGEXIST=1"
if defined TAGEXIST (
	set "TAGAT="
	set "OUTAT="
	for /f "delims=" %%x in ('git rev-parse "refs/tags/%VERSION%"') do set "TAGAT=%%x"
	for /f "delims=" %%x in ('git rev-parse refs/heads/output 2^>nul') do set "OUTAT=%%x"
	echo [ERROR] tag %VERSION% already exists locally. Delete it or use another version:
	echo             git tag -d %VERSION%
	echo         Prefer a NEW version number: the same tag may also exist on the
	echo         remote already, and a remote tag can never be overwritten by a
	echo         normal push.
	if /i "!TAGAT!"=="!OUTAT!" (
		echo.
		echo         If this tag is YOUR finished release that never reached origin,
		echo         do not rebuild - finish the push with:
		echo             scripts\release.bat release --push-only %VERSION%
	)
	exit /b 1
)

REM ---- baseline (previous output tag) ----
if "%BASELINE%"=="" (
	call :describe_output_tag
	set "BASELINE=!DESCRIBE!"
	if "!BASELINE!"=="" (
		echo [ERROR] no tag found on output branch. Pass baseline explicitly, e.g.
		echo             release.bat release %VERSION% v1.5
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
		echo             release.bat release vX.Y.Z
		echo         only if that remote tag is a leftover you mean to replace:
		echo             git push origin :refs/tags/%VERSION%
		echo             release.bat release --push-only %VERSION%
		echo.
		echo existing tags ^(local^):
		call :list_tags
		exit /b 1
	)
)

if not exist "%REPO%\.github\workflows\release.yml" (
	echo [WARN] .github/workflows/release.yml is missing: nothing will attach the three
	echo        branch archives to the GitHub Release; you would have to add them by hand.
)
echo.

REM ---- [1/6] build ----
echo [1/6] build extension...
call :require_vite || exit /b 1
call :do_build || exit /b 1

REM ---- [2/6] dev-output ----
echo [2/6] create dev-output commit...
call :make_dev_output || exit /b 1

REM ---- [3/6] output: merge commit (no-ff) + the release tag ----
echo [3/6] create output merge commit and tag %VERSION%...
> "%MSGOUT%" echo output: %VERSION% merge from dev-output
>> "%MSGOUT%" echo release assets built from output / output-core / dev
>> "%MSGOUT%" echo dev-commit: !DEVSHA!
>> "%MSGOUT%" echo baseline: %BASELINE%
set "MERGE="
for /f "delims=" %%c in ('git commit-tree !TREE! -p output -p dev-output -F "%MSGOUT%"') do set MERGE=%%c
if "!MERGE!"=="" (
	echo [ERROR] commit-tree failed, output not created.
	exit /b 1
)
git update-ref refs/heads/output !MERGE!
git tag %VERSION% !MERGE!
echo       output = !MERGE!  ^(tag %VERSION%^)

REM ---- [4/6] output-core: incremental pack (Node helper handles CJK paths) ----
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
>> "%MSGCORE%" echo baseline %BASELINE% -^> %VERSION% (output)
>> "%MSGCORE%" echo overwrite install to upgrade
set "CORE="
for /f "delims=" %%c in ('git commit-tree !CORETREE! -p output-core -F "%MSGCORE%"') do set CORE=%%c
if "!CORE!"=="" (
	echo [ERROR] commit-tree failed, output-core not created.
	exit /b 1
)
git update-ref refs/heads/output-core !CORE!
echo       output-core = !CORE!

REM ---- [5/6] cleanup scratch files ----
del "%COREIDX%" "%MSGDEV%" "%MSGOUT%" "%MSGCORE%" "%DESCTMP%" 2>nul
rd /s /q "%TEMPDIR%" 2>nul

REM ============================================================
REM release [6/6] push (shared by --push-only)
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

REM ---- leave the packages on disk: export the output / output-core trees ----
echo [INFO] exporting local packages into the release folder...
call :export_tree "!MERGE!" "!RELDIR!\output"
call :export_tree "!CORE!" "!RELDIR!\output-core"
echo.
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
		echo          release.bat release vX.Y.Z
		echo   2^) Only if the remote tag is a leftover you mean to replace:
		echo          git push origin :refs/tags/%VERSION%
		echo          release.bat release --push-only %VERSION%
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
	echo             scripts\release.bat release --push-only %VERSION%
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
	del "%LSRTMP%" 2>nul
	rd /s /q "%TEMPDIR%" 2>nul
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
echo        local copies stayed in %RELDIR% - zip them with:
echo            scripts\release.bat pack
echo        still on !ORIGBRANCH!, worktree untouched.
goto :the_end

REM ============================================================
REM remote unreachable: turn git's error into an actionable hint
REM ============================================================
:remote_unreachable
echo [ERROR] cannot reach remote "origin". git said:
type "%LSRTMP%"
echo.
call :network_hints
echo [HINT] Nothing was pushed and nothing else was touched. Once the network is
echo [HINT] back, finish the release without rebuilding:
echo [HINT]     scripts\release.bat release --push-only %VERSION%
exit /b 1

REM ============================================================
REM dev: build + dev-output + local zip + push dev-output only
REM ============================================================
:do_dev
set "PUSHONLY="
set "NOZIP="
set "WANTPASS="
:dev_args
if "%~1"=="" goto :dev_args_done
if /i "%~1"=="--push-only" (
	set "PUSHONLY=1"
) else if /i "%~1"=="--no-zip" (
	set "NOZIP=1"
) else if /i "%~1"=="--password" (
	set "WANTPASS=1"
) else (
	echo [ERROR] unknown option: %~1
	echo.
	echo   release.bat dev                  build + pack zip + sync dev-output
	echo   release.bat dev --no-zip         same, but skip the local zip
	echo   release.bat dev --push-only      push the existing local dev-output only
	echo   release.bat dev --password       AES-256 encrypt the local zip
	exit /b 1
)
shift
goto :dev_args
:dev_args_done

if defined PUSHONLY if defined WANTPASS (
	echo [WARN] --password ignored: --push-only creates no zip.
	set "WANTPASS="
)
if defined NOZIP if defined WANTPASS (
	echo [WARN] --password ignored: --no-zip creates no zip.
	set "WANTPASS="
)

REM ---- precheck: working tree must be clean (build mode only) ----
if not defined PUSHONLY (
	call :require_clean_tree || exit /b 1
)

REM ---- precheck: dev + dev-output must exist ----
call :require_branches dev dev-output || exit /b 1

REM ---- remember current branch + dev head ----
call :remember_head

if defined PUSHONLY (
	echo [INFO] mode     = dev --push-only ^(no build, no zip: push the existing local dev-output^)
) else if defined NOZIP (
	echo [INFO] mode     = dev: build + sync dev-output ^(local zip skipped: --no-zip^)
) else (
	echo [INFO] mode     = dev: build + pack zip + sync dev-output
)
call :report_head
if defined PUSHONLY goto :dev_push

REM ---- [1/3] build ----
echo [1/3] build extension...
call :require_vite || exit /b 1
call :do_build || exit /b 1

REM ---- [2/3] dev-output ----
echo [2/3] create dev-output commit...
call :make_dev_output || exit /b 1

REM ---- [3/3] local package: build tree -> scripts\WhichWay-dev-<sha7>.zip ----
if defined NOZIP (
	echo [INFO] pack build tree into a zip... skipped ^(--no-zip^)
) else (
	echo [INFO] pack build tree into a zip...
	call :zip_build
	set "ZIPERR=!ERRORLEVEL!"
	call :zip_cleanup_password
	if not "!ZIPERR!"=="0" (
		echo [ERROR] packing failed. Nothing was pushed; fix it or re-run with --no-zip.
		exit /b 1
	)
)

REM ============================================================
REM dev push: dev-output only (with pause)
REM ============================================================
:dev_push
set "DOCOMMIT="
for /f "delims=" %%a in ('git rev-parse refs/heads/dev-output') do set "DOCOMMIT=%%a"
if "!DOCOMMIT!"=="" (
	echo [ERROR] cannot read refs/heads/dev-output.
	exit /b 1
)

echo.
echo [INFO] ref to publish:
echo       dev-output   !DOCOMMIT!
if !DEVAHEAD! GTR 0 echo       ^(note: dev has !DEVAHEAD! unpushed commit^(s^) - dev mode does not push dev^)
echo.
echo     Press any key to push, Ctrl+C to cancel. The local commit is kept.
pause >nul

git push origin dev-output
if errorlevel 1 (
	echo.
	echo [ERROR] push failed. The dev-output commit is still local, so you can retry without
	echo         rebuilding:
	echo             scripts\release.bat dev --push-only
	echo         Manual equivalent:
	echo             git push origin dev-output
	echo         Remote moved ahead ^(rejected as non-fast-forward^)? Check with:
	echo             git fetch origin ^&^& git log --oneline dev-output..origin/dev-output
	call :network_hints
	rd /s /q "%TEMPDIR%" 2>nul
	exit /b 1
)

rd /s /q "%TEMPDIR%" 2>nul
echo.
echo [DONE] dev-output synced: !DOCOMMIT!
if defined ZIPPATH echo        local package: !ZIPPATH!
echo        pushed: dev-output only ^(no tag, no output / output-core, no release^)
echo        still on !ORIGBRANCH!, worktree untouched.
goto :the_end

REM ============================================================
REM pack: export (if needed) + zip release\output / output-core
REM ============================================================
:do_pack
set "MODE="
set "WANTPASS="
:pack_args
if "%~1"=="" goto :pack_args_done
if /i "%~1"=="--password" (
	set "WANTPASS=1"
) else if "%MODE%"=="" (
	set "MODE=%~1"
) else (
	echo [ERROR] too many arguments: %~1
	echo        usage: release.bat pack [output^|core^|all] [--password]
	exit /b 1
)
shift
goto :pack_args
:pack_args_done
if "%MODE%"=="" set "MODE=all"
if /i not "%MODE%"=="all" if /i not "%MODE%"=="output" if /i not "%MODE%"=="core" (
	echo [ERROR] unknown mode "%MODE%". Use output, core, or all.
	exit /b 1
)

REM ---- version for the zip names: latest v* tag on output ----
call :describe_output_tag
set "VERSION=!DESCRIBE!"
if "!VERSION!"=="" set "VERSION=local"

echo [INFO] repo     = %REPO%
echo [INFO] version  = !VERSION!
echo [INFO] mode     = %MODE%
echo [INFO] release  = !RELDIR!
echo.

REM Mode dispatch lives in :pack_mode: cmd swallows the exit code of
REM "exit /b 1" when it follows other commands inside one (...) block, so the
REM chain is kept at top level inside a subroutine (verified on this box).
call :pack_mode "%MODE%"
set "PACKERR=!ERRORLEVEL!"
call :zip_cleanup_password
if not "!PACKERR!"=="0" exit /b 1

echo.
echo [DONE] archives are in %SCRIPTS%
goto :the_end

REM ============================================================
REM pack_mode <output|core|all>
REM ============================================================
:pack_mode
if /i "%~1"=="all" goto :pack_mode_all
call :ensure_pack_tree "%~1" || exit /b 1
call :pack_one "%~1" || exit /b 1
exit /b 0
:pack_mode_all
call :ensure_pack_tree output || exit /b 1
call :ensure_pack_tree core || exit /b 1
call :pack_one output || exit /b 1
call :pack_one core || exit /b 1
exit /b 0

REM ============================================================
REM ensure_pack_tree <output|core>
REM   Make sure release\<dir> exists and is non-empty. When it is missing
REM   (fresh clone, release\ deleted, previous run cleaned up), export the
REM   branch tree into it so "pack" no longer depends on a prior "release".
REM   A missing branch or a failed export is fatal: pack must never report
REM   success without producing a package.
REM ============================================================
:ensure_pack_tree
if /i "%~1"=="output" (
	set "PACKBRANCH=output"
	set "PACKDEST=!RELDIR!\output"
) else (
	set "PACKBRANCH=output-core"
	set "PACKDEST=!RELDIR!\output-core"
)
set "PACKSHA="
for /f "delims=" %%s in ('git rev-parse --verify --quiet "refs/heads/!PACKBRANCH!" 2^>nul') do set PACKSHA=%%s
if "!PACKSHA!"=="" (
	echo [ERROR] branch !PACKBRANCH! not found locally - nothing to pack.
	echo         Create it with "scripts\release.bat release ^<version^>".
	exit /b 1
)
set "PACKTREE="
if exist "!PACKDEST!" for /f "delims=" %%f in ('dir /b "!PACKDEST!" 2^>nul') do set PACKTREE=1
if defined PACKTREE (
	echo       using existing !PACKDEST!
	exit /b 0
)
echo exporting !PACKBRANCH! ^( !PACKSHA! ^) into !PACKDEST! ...
call :export_tree "!PACKSHA!" "!PACKDEST!"
if errorlevel 1 (
	echo [ERROR] could not export !PACKBRANCH! into !PACKDEST! - see above.
	exit /b 1
)
exit /b 0

REM ============================================================
REM pack_one <output|core>: zip release\<dir> into scripts\<zip>
REM   Layout: the zip holds the extension content at its ROOT (no WhichWay/
REM   folder), because that is what the exported tree is. The dev zip built
REM   by "release.bat dev" instead carries a WhichWay/ top level - that one is
REM   the drop-in install pack.
REM ============================================================
:pack_one
if /i "%~1"=="output" (
	set "SRC=!RELDIR!\output"
	set "ZIP=!SCRIPTS!WhichWay-!VERSION!.zip"
) else (
	set "SRC=!RELDIR!\output-core"
	set "ZIP=!SCRIPTS!WhichWay-!VERSION!-core.zip"
)
if not exist "!SRC!" (
	echo [ERROR] !SRC! not found after export.
	exit /b 1
)
set "ANY="
for /f "delims=" %%f in ('dir /b "!SRC!" 2^>nul') do set ANY=1
if not defined ANY (
	echo [ERROR] !SRC! is empty after export.
	exit /b 1
)
call :resolve_zip_password || exit /b 1
if exist "!ZIP!" del "!ZIP!" 2>nul
echo packing !SRC! ...
call :zip_flat "!SRC!" "!ZIP!" || (
	echo [ERROR] failed to zip !SRC!
	exit /b 1
)
echo       wrote !ZIP!
exit /b 0

REM ============================================================
REM core <version> <baseline>: local diff pack
REM   Zip only the files added/modified between <baseline> and <version>,
REM   taken from <version>'s tree. LOCAL ONLY: no commit, no branch update,
REM   no tag, no push - it only writes a zip under scripts\.
REM ============================================================
:do_core
set "NEWVER="
set "OLDVER="
set "WANTPASS="
:core_args
if "%~1"=="" goto :core_args_done
if /i "%~1"=="--password" (
	set "WANTPASS=1"
) else if "%NEWVER%"=="" (
	set "NEWVER=%~1"
) else if "%OLDVER%"=="" (
	set "OLDVER=%~1"
) else (
	echo [ERROR] too many arguments: %~1
	goto :core_usage
)
shift
goto :core_args
:core_args_done
if "%NEWVER%"=="" goto :core_usage
if "%OLDVER%"=="" goto :core_usage

set "NEWSHA="
for /f "delims=" %%s in ('git rev-parse --verify --quiet "%NEWVER%" 2^>nul') do set NEWSHA=%%s
if "!NEWSHA!"=="" (
	echo [ERROR] version "%NEWVER%" is not a valid tag/commit.
	echo.
	echo existing tags:
	call :list_tags
	exit /b 1
)
set "OLDSHA="
for /f "delims=" %%s in ('git rev-parse --verify --quiet "%OLDVER%" 2^>nul') do set OLDSHA=%%s
if "!OLDSHA!"=="" (
	echo [ERROR] baseline "%OLDVER%" is not a valid tag/commit.
	echo.
	echo existing tags:
	call :list_tags
	exit /b 1
)

REM ---- filenames must stay valid on Windows: "/" is legal in a ref ----
set "ZIPVER=!NEWVER:/=-!"
set "ZIPOLD=!OLDVER:/=-!"

echo [INFO] repo     = %REPO%
echo [INFO] version  = %NEWVER%  ^(!NEWSHA!^)
echo [INFO] baseline = %OLDVER%  ^(!OLDSHA!^)
echo [INFO] mode     = core: local diff pack %OLDVER% -^> %NEWVER%
echo [INFO]            ^(zip only - no branch, no tag, no push^)
echo.

git merge-base --is-ancestor "%OLDVER%" "%NEWVER%" >nul 2>&1
if errorlevel 1 (
	echo [WARN] %OLDVER% is not an ancestor of %NEWVER%. If you swapped them,
	echo [WARN] the diff goes the wrong way; usage is version then baseline.
	echo.
)

if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
set "DIFFIDX=%TEMPDIR%\core-diff-index.tmp"
set "DIFFTMP=%TEMPDIR%\core-diff-tree.tmp"
del "%DIFFIDX%" "%DIFFTMP%" 2>nul

echo [1/3] collect added/modified files...
node "%SCRIPTS%make-core-index.cjs" "!OLDSHA!" "!NEWSHA!" "%DIFFIDX%"
if errorlevel 1 (
	del "%DIFFIDX%" "%DIFFTMP%" 2>nul
	echo [ERROR] make-core-index failed.
	exit /b 1
)
set "CORESIZE=0"
for %%A in ("%DIFFIDX%") do set "CORESIZE=%%~zA"
if not defined CORESIZE set "CORESIZE=0"
if !CORESIZE! LEQ 1 (
	del "%DIFFIDX%" "%DIFFTMP%" 2>nul
	echo [ERROR] no added or modified files between %OLDVER% and %NEWVER% -
	echo         nothing to pack ^(a delete-only change yields an empty core pack^).
	exit /b 1
)

echo [2/3] build the diff tree...
set "GIT_INDEX_FILE=%DIFFTMP%"
git read-tree --empty
git update-index --index-info < "%DIFFIDX%"
if errorlevel 1 (
	set "GIT_INDEX_FILE="
	del "%DIFFIDX%" "%DIFFTMP%" 2>nul
	echo [ERROR] git update-index --index-info failed.
	exit /b 1
)
set "CORETREE="
for /f "delims=" %%t in ('git write-tree') do set CORETREE=%%t
set "GIT_INDEX_FILE="
del "%DIFFIDX%" "%DIFFTMP%" 2>nul
if "!CORETREE!"=="" (
	echo [ERROR] diff tree build failed.
	exit /b 1
)

echo [3/3] export and zip...
set "COREDEST=!RELDIR!\output-core-!ZIPVER!-!ZIPOLD!"
call :export_tree "!CORETREE!" "!COREDEST!"
if errorlevel 1 (
	echo [ERROR] could not export the diff tree - see above.
	exit /b 1
)
set "COREZIP=%SCRIPTS%WhichWay-!ZIPVER!-!ZIPOLD!-core.zip"
call :resolve_zip_password || exit /b 1
if exist "!COREZIP!" del "!COREZIP!" 2>nul
echo packing !COREDEST! ...
call :zip_flat "!COREDEST!" "!COREZIP!"
set "ZIPERR=!ERRORLEVEL!"
call :zip_cleanup_password
if not "!ZIPERR!"=="0" (
	echo [ERROR] failed to zip !COREDEST!
	exit /b 1
)
for %%z in ("!COREZIP!") do set "COREZIPSIZE=%%~zz"
echo.
echo [DONE] core pack written: !COREZIP!  ^(!COREZIPSIZE! bytes^)
echo        contains only files added/modified from %OLDVER% to %NEWVER%.
echo        local only: no branch was updated, no tag created, nothing pushed.
goto :the_end

:core_usage
echo [Usage] release.bat core ^<version^> ^<baseline^> [--password]
echo.
echo   release.bat core v1.6 v1.5.6
echo       zip the files added/modified from v1.5.6 to v1.6 into
echo       scripts\WhichWay-v1.6-v1.5.6-core.zip
echo       ^(extracted tree: release\output-core-v1.6-v1.5.6^)
echo   release.bat core v1.6 v1.5.6 --password
echo       same, but AES-256 password protected
echo   Local only: no branch update, no tag, no push.
echo.
echo existing tags:
call :list_tags
exit /b 1

REM ============================================================
REM resolve_zip_password - one hidden prompt per command
REM   No-op unless --password was given. Sets ZIPENC=1 and writes the
REM   password to %ZIPPASSFILE% (removed by zip_cleanup_password).
REM   Re-entrant so "pack all" asks once and reuses the answer.
REM ============================================================
:resolve_zip_password
if not defined WANTPASS exit /b 0
if defined ZIPENC exit /b 0
if not exist "%TEMPDIR%" md "%TEMPDIR%" 2>nul
del "%ZIPPASSFILE%" 2>nul
if defined WW_ZIP_PASSWORD echo [INFO] using password from WW_ZIP_PASSWORD
set "WW_PASSFILE=%ZIPPASSFILE%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPTS%zip-encrypt.ps1" -Mode prompt
if errorlevel 1 (
	echo [ERROR] no archive password was set - aborted.
	if exist "%ZIPPASSFILE%" del "%ZIPPASSFILE%" 2>nul
	exit /b 1
)
if not exist "%ZIPPASSFILE%" (
	echo [ERROR] the password helper produced no password file.
	exit /b 1
)
set "ZIPENC=1"
echo [INFO] archive password accepted ^(AES-256^).
echo [WARN] Windows Explorer cannot open AES zips; use 7-Zip / WinRAR / Bandizip.
exit /b 0

:zip_cleanup_password
if exist "%ZIPPASSFILE%" del "%ZIPPASSFILE%" 2>nul
set "ZIPENC="
exit /b 0

REM ============================================================
REM find_bsdtar - prefer Windows' bsdtar and prove it is bsdtar
REM   "where tar" often finds GNU tar from Git/MSYS first. GNU tar cannot
REM   write ZIP archives (it happily makes a TAR named .zip) and has no
REM   --options/--passphrase, so it must never be used for these packages.
REM ============================================================
:find_bsdtar
set "TARBIN="
if exist "%SystemRoot%\System32\tar.exe" set "TARBIN=%SystemRoot%\System32\tar.exe"
if defined TARBIN (
	"%TARBIN%" --version 2>nul | findstr /i /c:"bsdtar" >nul
	if errorlevel 1 set "TARBIN="
)
if defined TARBIN exit /b 0
for /f "delims=" %%t in ('where tar 2^>nul') do (
	if not defined TARBIN (
		"%%t" --version 2>nul | findstr /i /c:"bsdtar" >nul
		if not errorlevel 1 set "TARBIN=%%t"
	)
)
if defined TARBIN exit /b 0
exit /b 1

REM ============================================================
REM zip_flat <srcDir> <zipPath>
REM   Contents of srcDir at the root of the archive. Without --password the
REM   old Compress-Archive path is used (PowerShell only, via process env
REM   vars: a CJK path never reaches the command line, no tar dependency).
REM   With --password, bsdtar writes a ZIP with AES-256 encryption; the
REM   wildcard keeps the same flat layout and includes dotfiles.
REM ============================================================
:zip_flat
call :resolve_zip_password || exit /b 1
if not defined ZIPENC goto :zip_flat_plain
call :find_bsdtar || (
	echo [ERROR] password-protected zips need Windows bsdtar, but no bsdtar was found.
	exit /b 1
)
set "WW_LAYOUT=flat"
set "WW_SRC=%~1"
set "WW_ZIP=%~2"
set "WW_PASSFILE=%ZIPPASSFILE%"
set "WW_TAR=!TARBIN!"
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPTS%zip-encrypt.ps1" -Mode zip
if errorlevel 1 exit /b 1
if not exist "%~2" exit /b 1
exit /b 0

:zip_flat_plain
set "WP_SRC=%~1"
set "WP_ZIP=%~2"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path ($env:WP_SRC + '\*') -DestinationPath $env:WP_ZIP -CompressionLevel Optimal -Force"
if errorlevel 1 exit /b 1
if not exist "%~2" exit /b 1
exit /b 0

REM ============================================================
REM zip_build - dev package: build tree -> scripts\WhichWay-dev-<sha7>.zip
REM   <sha7> is the short dev-output commit. Returns 0 and sets ZIPPATH/ZIPNAME.
REM ============================================================
:zip_build
set "ZIPPATH="
set "ZIPNAME="
set "SHORT="
for /f "delims=" %%s in ('git rev-parse --short=7 refs/heads/dev-output') do set SHORT=%%s
if "!SHORT!"=="" set "SHORT=local"
set "ZIPNAME=WhichWay-dev-!SHORT!.zip"
set "ZIPPATH=%SCRIPTS%!ZIPNAME!"
call :resolve_zip_password || exit /b 1
if exist "!ZIPPATH!" del "!ZIPPATH!" 2>nul
call :zip_wrapped "%ROOT%\apps\core\extension" "WhichWay" "!ZIPPATH!" || exit /b 1
for %%z in ("!ZIPPATH!") do set "ZIPSIZE=%%~zz"
echo       !ZIPNAME!  ^(!ZIPSIZE! bytes, top level WhichWay/^)
exit /b 0

REM ============================================================
REM zip_wrapped <parentDir> <entryName> <zipPath>
REM   - Windows bsdtar is preferred: far faster than Compress-Archive on
REM     asset-heavy trees. PowerShell is only a fallback for older systems.
REM   - "-C parentDir entryName" gives the <entryName>/ top level the CI
REM     archives also use (drop-in install).
REM   - With --password the archive is AES-256 encrypted through
REM     zip-encrypt.ps1. There is deliberately NO unencrypted fallback:
REM     a missing bsdtar is an error, so a password request can never
REM     silently produce an open archive.
REM   - Sanity checks (tar path only) mirror the CI ones: every entry stays
REM     under <entryName>/, and no CI-only .github/ or packaging scripts/
REM     entry may appear. Listing an AES zip needs no password, so the
REM     checks also cover encrypted archives.
REM ============================================================
:zip_wrapped
set "PARENT=%~1"
set "ENTRY=%~2"
set "TARGET=%~3"
call :resolve_zip_password || exit /b 1
if defined ZIPENC (
	call :find_bsdtar || (
		echo [ERROR] password-protected zips need Windows bsdtar, but no bsdtar was found.
		exit /b 1
	)
	set "WW_LAYOUT=wrapped"
	set "WW_PARENT=%PARENT%"
	set "WW_ENTRY=%ENTRY%"
	set "WW_ZIP=!TARGET!"
	set "WW_PASSFILE=%ZIPPASSFILE%"
	set "WW_TAR=!TARBIN!"
	powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPTS%zip-encrypt.ps1" -Mode zip
	if errorlevel 1 (
		del "!TARGET!" 2>nul
		exit /b 1
	)
	goto :zip_wrapped_sanity
)

set "TARBIN="
call :find_bsdtar
if defined TARBIN (
	"%TARBIN%" -a -c -f "!TARGET!" -C "%PARENT%" "%ENTRY%"
	if errorlevel 1 (
		del "!TARGET!" 2>nul
		set "TARBIN="
	)
)
if not defined TARBIN (
	echo       ^(tar.exe unavailable, falling back to PowerShell Compress-Archive^)
	set "WP_SRC=%PARENT%\%ENTRY%"
	set "WP_ZIP=!TARGET!"
	powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -LiteralPath $env:WP_SRC -DestinationPath $env:WP_ZIP -CompressionLevel Optimal -Force"
	if errorlevel 1 exit /b 1
)
if not exist "!TARGET!" (
	echo [ERROR] zip was not created: !TARGET!
	exit /b 1
)

:zip_wrapped_sanity
if defined TARBIN (
	"%TARBIN%" -tf "!TARGET!" > "%ZIPLIST%" 2>nul
	set "ZIPLISTBYTES="
	for %%l in ("%ZIPLIST%") do set "ZIPLISTBYTES=%%~zl"
	if not defined ZIPLISTBYTES set "ZIPLISTBYTES=0"
	if "!ZIPLISTBYTES!"=="0" (
		echo [ERROR] zip sanity failed: cannot list the archive.
		del "!TARGET!" 2>nul
		exit /b 1
	)
	REM every entry must live under <entryName>/ ...
	findstr /v /b /l /c:"%ENTRY%/" "%ZIPLIST%" >nul
	if not errorlevel 1 (
		echo [ERROR] zip sanity failed: entries outside %ENTRY%\.
		del "!TARGET!" 2>nul
		exit /b 1
	)
	REM ... and the install pack must not ship CI-only or packaging files
	findstr /b /l /c:"%ENTRY%/.github/" /c:"%ENTRY%/scripts/" "%ZIPLIST%" >nul
	if not errorlevel 1 (
		echo [ERROR] zip sanity failed: it contains .github\ or scripts\.
		del "!TARGET!" 2>nul
		exit /b 1
	)
	del "%ZIPLIST%" 2>nul
)
exit /b 0

REM ============================================================
REM do_build - rebuild apps/core/extension/WhichWay and prove it is not empty
REM ============================================================
:do_build
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
exit /b 0

REM ============================================================
REM make_dev_output - commit the build tree onto dev-output via a temp index.
REM   Sets TREE (the build tree, reused by the output merge) and DOCOMMIT.
REM ============================================================
:make_dev_output
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
	echo [WARN] a workflow, so no release assets would be generated once this tree is
	echo [WARN] tagged.
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
>> "%MSGDEV%" echo output dir apps/core/extension/WhichWay
>> "%MSGDEV%" echo dev-commit: !DEVSHA!
set "DOCOMMIT="
for /f "delims=" %%c in ('git commit-tree !TREE! -p dev-output -F "%MSGDEV%"') do set DOCOMMIT=%%c
if "!DOCOMMIT!"=="" (
	echo [ERROR] commit-tree failed, dev-output not created.
	exit /b 1
)
git update-ref refs/heads/dev-output !DOCOMMIT!
echo       dev-output = !DOCOMMIT!
del "%MSGDEV%" 2>nul
exit /b 0

REM ============================================================
REM export_tree <tree-sha> <target-dir>
REM   Extract a commit's tree into a fresh directory with git itself:
REM   read-tree into a private index, then checkout-index into the
REM   target. Git writes the NTFS names from its UTF-8 paths directly,
REM   so CJK file names survive.
REM
REM   Do NOT switch this back to "git archive" + "tar -xf": GNU tar
REM   (first "tar" on PATH, from Git) converts the UTF-8 names using the
REM   ANSI code page (GBK) under cmd.exe, turning every Chinese name into
REM   mojibake; Windows bsdtar cannot read the pax headers git archive
REM   writes for those names.
REM
REM   Leaves the output / output-core packages on disk for
REM   "release.bat pack" to zip. GIT_INDEX_FILE is cleared afterwards so
REM   the release flow keeps using its own temp index.
REM ============================================================
:export_tree
if "%~1"=="" exit /b 1
if "%~2"=="" exit /b 1
if exist "%~2" rd /s /q "%~2" 2>nul
if exist "%~2" (
	echo [WARN] cannot remove %~2 - export skipped.
	exit /b 1
)
if not exist "%~2" md "%~2" 2>nul
if not exist "%~2" (
	echo [WARN] cannot create %~2 - export skipped.
	exit /b 1
)
set "EXPORTIDX=%TEMPDIR%\export-tree.idx"
del "%EXPORTIDX%" 2>nul
set "GIT_INDEX_FILE=%EXPORTIDX%"
git -C "%REPO%" read-tree "%~1"
if errorlevel 1 (
	set "GIT_INDEX_FILE="
	del "%EXPORTIDX%" 2>nul
	echo [WARN] read-tree failed for %~1 - export skipped.
	exit /b 1
)
git -C "%REPO%" --work-tree="%~2" checkout-index -a -f
if errorlevel 1 (
	set "GIT_INDEX_FILE="
	del "%EXPORTIDX%" 2>nul
	echo [WARN] checkout-index failed for %~1 - export skipped.
	exit /b 1
)
set "GIT_INDEX_FILE="
del "%EXPORTIDX%" 2>nul
set "EXPORTED="
for /f "delims=" %%f in ('dir /b "%~2" 2^>nul') do set EXPORTED=1
if not defined EXPORTED (
	echo [WARN] %~2 is empty after export.
	exit /b 1
)
echo       exported %~1 -^> %~2
exit /b 0

REM ============================================================
REM describe_output_tag - latest v* tag on the output branch into %DESCRIBE%
REM   NOTE: inside "for /f ('cmd')" cmd turns "=" into a space, which breaks
REM   --abbrev=0 / --match=v*. So run the command normally, capture the result
REM   into a temp file, then read that file back.
REM ============================================================
:describe_output_tag
set "DESCRIBE="
git describe --tags --abbrev=0 --match=v* --exclude=*-core --exclude=*-dev output > "%DESCTMP%" 2>nul
for /f "usebackq delims=" %%t in ("%DESCTMP%") do set DESCRIBE=%%t
del "%DESCTMP%" 2>nul
exit /b 0

REM ============================================================
REM small shared prechecks
REM ============================================================
:require_clean_tree
set HASCHANGES=
for /f "delims=" %%i in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
	echo [ERROR] working tree has uncommitted changes. Commit or stash first:
	git status --short
	exit /b 1
)
exit /b 0

:require_branches
for %%b in (%*) do (
	git rev-parse --verify --quiet "refs/heads/%%b" >nul 2>&1 || (
		echo [ERROR] branch %%b missing. Initialize it first.
		exit /b 1
	)
)
exit /b 0

:require_vite
set "VITEBIN=%REPO%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" set "VITEBIN=%ROOT%\node_modules\.bin\vite.CMD"
if not exist "%VITEBIN%" (
	echo [ERROR] vite not found. Run "pnpm install" in the workspace root first.
	exit /b 1
)
exit /b 0

:remember_head
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set ORIGBRANCH=%%b
set "DEVSHA="
for /f "delims=" %%d in ('git rev-parse refs/heads/dev') do set DEVSHA=%%d
set "DEVAHEAD=0"
for /f "delims=" %%n in ('git rev-list --count origin/dev..refs/heads/dev 2^>nul') do set DEVAHEAD=%%n
exit /b 0

:report_head
echo [INFO] branch   = %ORIGBRANCH%   dev head = !DEVSHA!  ^(dev unpushed: !DEVAHEAD!^)
if /i not "%ORIGBRANCH%"=="dev" (
	echo [WARN] current branch is %ORIGBRANCH%, not dev. dev-output is built from this
	echo        working tree, and the -dev release asset is built from the dev branch,
	echo        which may not match. Switch to dev first if you meant to publish dev.
)
echo.
exit /b 0

:normalize_version
set "CAND=%~1"
set "VFIRST=%CAND:~0,1%"
if /i not "%VFIRST%"=="v" (
	echo [ERROR] version must start with "v", e.g. v1.5.3
	exit /b 1
)
if "%CAND%"=="v" (
	echo [ERROR] version must not be just "v".
	exit /b 1
)
if /i "%VFIRST%"=="V" set "CAND=v%CAND:~1%"
set "VERSION=%CAND%"
exit /b 0

:network_hints
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
exit /b 0

:list_tags
git tag -l "v*"
exit /b 0

REM ============================================================
REM usage + clean exit
REM ============================================================
:usage
echo WhichWay release toolkit
echo.
echo   scripts\release.bat release ^<version^> [baseline] [--push-only]
echo   scripts\release.bat dev [--no-zip] [--push-only] [--password]
echo   scripts\release.bat pack [output^|core^|all] [--password]
echo   scripts\release.bat core ^<version^> ^<baseline^> [--password]
echo.
echo   release   full release: build + dev-output + output(tag) + output-core
echo             + export into release\ + atomic push of all refs and the tag
echo   dev       build + push dev-output only, plus WhichWay-dev-^<sha7^>.zip
echo             next to this script ^(no tag, no release, dev itself not pushed^)
echo   pack      export output / output-core from their branches when
echo             release\ is missing, then zip them into scripts\
echo   core      zip only the files added/modified between baseline and
echo             version into scripts\WhichWay-^<version^>-^<baseline^>-core.zip
echo             ^(local only - no branch, tag, or push^)
echo.
echo   version   tag name starting with "v", e.g. v1.5.3
echo   baseline  tag/commit output-core diffs against; default = latest v* on output
echo             ^(core: required, e.g. release.bat core v1.6 v1.5.6^)
echo   --password  (dev/pack/core) AES-256 encrypt every local zip; asks once,
echo             hidden. Set WW_ZIP_PASSWORD to supply it non-interactively.
echo             Explorer cannot open AES zips - use 7-Zip / WinRAR / Bandizip.
echo   Flags may come in any order. Every mode pauses before pushing.
echo.
echo   Used to be three scripts: release-dev.bat and pack-local.bat are now the
echo   "dev" and "pack" commands of this one file.
echo.
echo existing tags:
call :list_tags
goto :the_end

:the_end
endlocal
exit /b 0
