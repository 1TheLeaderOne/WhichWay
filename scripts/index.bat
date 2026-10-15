@echo off
setlocal

REM ============================================================
REM  WhichWay scripts launcher - a numbered menu over this folder
REM
REM  Thin shell on purpose: the menu, its labels and every per-script
REM  "how to use" block live in index-menu.mjs. Batch can not print Chinese
REM  reliably (switching the code page from a bat needs a for /f probe of
REM  chcp, and that child cmd drains piped stdin - see find-arkid.bat), and
REM  duplicating each script's help text here would go stale on the first edit.
REM
REM  Usage:
REM    index.bat                 menu: type a number, read that script's
REM                              usage, pass arguments, confirm, run it
REM    index.bat 3 [args...]     run number 3 directly, no prompts
REM    index.bat --list          print the numbered list only
REM    index.bat --help          show this usage
REM
REM  Notes:
REM  - Numbering is produced by index-menu.mjs (grouped by purpose). Run
REM    "index.bat --list" to see the numbers before calling one non-interactive.
REM  - The launcher does not soften any script: the destructive ones
REM    (split-illustration, rename-to-arkid, compress-skin --inplace) still
REM    default to dry-run/check mode unless YOU type the real flag.
REM  - Children get inherited stdio and cwd = this extension folder, so their
REM    own prompts (release.bat pause before push, find-arkid loop) behave
REM    exactly as when double-clicked.
REM  - index-menu.mjs and this file are not listed in the menu (a launcher
REM    entry for itself is only noise).
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement).
REM ============================================================

set "SCRIPTS=%~dp0"

where node >nul
if errorlevel 1 (
	echo [ERROR] node not found in PATH.
	exit /b 1
)

node "%SCRIPTS%index-menu.mjs" %*
exit /b %ERRORLEVEL%
