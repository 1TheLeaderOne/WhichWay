@echo off
setlocal

REM ============================================================
REM  WhichWay find-skinvoice
REM
REM  Look up which skins of an operator carry their OWN voice set, and print
REM  the skinId to put into skill({ audio: ... }).
REM
REM  Usage:
REM    find-skinvoice.bat                      interactive loop, q or empty line quits
REM    find-skinvoice.bat NAME [NAME...]       one-shot, any number of queries
REM    find-skinvoice.bat (input from a file, one name per line, redirected stdin)
REM
REM  The query accepts either form:
REM    - the operator id,        e.g. char_003_kalts
REM    - the Chinese name,       e.g. the name of Kal'tsit (typed in the console)
REM  An id fragment or partial name also works and prints every hit.
REM
REM  Examples:
REM    find-skinvoice.bat char_003_kalts
REM      -> char_003_kalts@boc#6   (the "Remnant" outfit, 38 voice lines, CN/JP/KR/EN)
REM
REM  Why this matters:
REM    Some skins ship an entirely different voice set. Kal'tsit's "Remnant"
REM    outfit differs from the default in 37 of 38 lines. To use it for a skill,
REM    the audio field takes the skinId as a key:
REM
REM      audio: { "char_003_kalts@boc#6": ["bu-shu1", "bu-shu2"] }
REM
REM    Note the skinId uses "@" (char_003_kalts@boc#6) while the underlying voice
REM    folder uses "_" (char_003_kalts_boc#6). Always copy the skinId printed
REM    here; do not convert by hand.
REM
REM  Notes:
REM  - Data source: json/arknight folder - skin_table.json (which skins carry a
REM    voiceId) plus charword_table.json (languages and line count per voice
REM    set). Missing data: run update-arknight-data.bat.
REM  - All parsing and matching lives in find-skinvoice.mjs; batch can not read
REM    a 2.7 MB JSON, and node keeps UTF-8 on stdin/stdout.
REM  - The UTF-8 console switch happens inside find-skinvoice.mjs, NOT here, and
REM    the old codepage is restored on exit. A for /f probe of chcp in this file
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

node "%SCRIPTS%find-skinvoice.mjs" %*
exit /b %ERRORLEVEL%
