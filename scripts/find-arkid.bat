@echo off
setlocal

REM ============================================================
REM  WhichWay find-arkid
REM
REM  Look up an Arknights operator id from its name (Chinese name typed in the
REM  console, or an id fragment).
REM
REM  Usage:
REM    find-arkid.bat                 interactive loop, q or empty line quits
REM    find-arkid.bat NAME [NAME...]  one-shot query, any number of names
REM    find-arkid.bat (input from a file, one name per line, redirected stdin)
REM
REM  Examples:
REM    find-arkid.bat warmy        gives char_4081_warmy   (id substring)
REM    find-arkid.bat amiya amiya2 gives a fuzzy list of Amiya forms
REM    Type a Chinese name in the console for the exact match, e.g. the 6-star
REM    Caster whose id is char_4081_warmy.
REM
REM  Notes:
REM  - Data source: json arknight folder, character_table.json plus the
REM    patchChars of char_patch_table.json (alter forms share the base name, so
REM    both tables are queried). Missing data: run update-arknight-data.bat.
REM  - All parsing and matching lives in find-arkid.mjs; batch can not read an
REM    8 MB JSON, and node keeps UTF-8 on stdin/stdout.
REM  - The UTF-8 console switch happens inside find-arkid.mjs, NOT here, and the
REM    old codepage is restored on exit. A for /f probe of chcp in this file
REM    would spawn a child cmd that inherits and drains redirected/piped stdin,
REM    so node would read EOF at once and the interactive mode would print
REM    nothing. node uses stdio ignore for its own chcp calls instead.
REM  - Two batch traps this file has to respect: redirection characters in REM
REM    lines are still parsed by cmd (a placeholder written with angle brackets
REM    becomes a real redirect), and a POSIX path like /dev/null does not exist
REM    here - discard output to nul instead.
REM  - Keep this file ASCII-only + CRLF (cmd batch requirement); the Chinese
REM    names are typed by the user, never stored in this file.
REM ============================================================

set "SCRIPTS=%~dp0"

where node >nul
if errorlevel 1 (
	echo [ERROR] node not found in PATH.
	exit /b 1
)

node "%SCRIPTS%find-arkid.mjs" %*
exit /b %ERRORLEVEL%
