@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  WhichWay pack-local
REM
REM  Zip the packages that release.bat left in the local release\
REM  folder into this scripts\ folder.
REM
REM    release\output       -> WhichWay-<version>.zip
REM    release\output-core  -> WhichWay-<version>-core.zip
REM
REM  Usage:
REM    pack-local.bat            -> pack both (default)
REM    pack-local.bat all        -> pack both
REM    pack-local.bat output     -> pack output only
REM    pack-local.bat core       -> pack output-core only
REM
REM  <version> is the latest v* tag on the output branch; falls back to
REM  "local" when the repo has no tags yet.
REM
REM  Notes:
REM  - Reads the directories release.bat exported; run release.bat first.
REM  - Zips with PowerShell Compress-Archive (no tar dependency).
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

REM ---- derive paths from script location (no hardcoded drive) ----
set "SCRIPTS=%~dp0"
for %%I in ("%SCRIPTS%..") do set "REPO=%%~fI"
set "RELDIR=%REPO%\release"

REM ---- args ----
set "MODE=%~1"
if "%MODE%"=="" set "MODE=all"

REM ---- version for the zip names ----
set "VERSION="
for /f "delims=" %%t in ('git -C "%REPO%" describe --tags --abbrev=0 --exclude=*-core --exclude=*-dev output 2^>nul') do set "VERSION=%%t"
if "!VERSION!"=="" set "VERSION=local"

echo [INFO] repo     = %REPO%
echo [INFO] version  = !VERSION!
echo [INFO] mode     = %MODE%
echo [INFO] release  = !RELDIR!
echo.

if /i "%MODE%"=="output" (
	call :pack output
) else if /i "%MODE%"=="core" (
	call :pack core
) else if /i "%MODE%"=="all" (
	call :pack output
	call :pack core
) else (
	echo [ERROR] unknown mode "%MODE%". Use output, core, or all.
	exit /b 1
)

echo.
echo [DONE] archives are in %SCRIPTS%
endlocal
exit /b 0

REM ============================================================
REM pack <output|core>: zip release\<dir> into scripts\<zip>
REM ============================================================
:pack
if /i "%~1"=="output" (
	set "SRC=!RELDIR!\output"
	set "ZIP=!SCRIPTS!WhichWay-!VERSION!.zip"
) else (
	set "SRC=!RELDIR!\output-core"
	set "ZIP=!SCRIPTS!WhichWay-!VERSION!-core.zip"
)
if not exist "!SRC!" (
	echo [WARN] !SRC! not found.
	echo [WARN] Run scripts\release.bat first to export it. Skipping.
	exit /b 0
)
set "ANY="
for /f "delims=" %%f in ('dir /b "!SRC!" 2^>nul') do set ANY=1
if not defined ANY (
	echo [WARN] !SRC! is empty. Skipping.
	exit /b 0
)
if exist "!ZIP!" del "!ZIP!" 2>nul
echo packing !SRC! ...
set "WP_SRC=!SRC!"
set "WP_ZIP=!ZIP!"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path ($env:WP_SRC + '\*') -DestinationPath $env:WP_ZIP -CompressionLevel Optimal -Force"
if errorlevel 1 (
	echo [ERROR] failed to zip !SRC!
	exit /b 1
)
echo       wrote !ZIP!
exit /b 0
