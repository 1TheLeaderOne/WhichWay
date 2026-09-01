@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ====================================================================
REM  驶舰之向（WhichWay）一键发布三分支
REM
REM    dev-output  = 本次构建产物的全量快照
REM    output      = 大版本合并自 dev-output，并打 tag
REM    output-core = 两次版本间的增量包（只含变动文件）
REM
REM  用法:
REM      release.bat 版本号 [output-core 基线]
REM
REM      版本号        新 tag 名，如 v1.4.3（必填）
REM      基线          output-core 增量包对比的起点 tag/commit，如 v1.4
REM                    省略则取 output 分支上最近一个 tag
REM
REM  示例:
REM      release.bat v1.4.3            REM output-core: v1.4.2 -> v1.4.3
REM      release.bat v1.5.0 v1.4       REM output-core: v1.4   -> v1.5.0
REM
REM  说明：
REM  - 全程用底层 git 命令构造提交，不切换分支、不动你的工作区
REM  - 本文件必须为 UTF-8 编码 + CRLF 行尾（cmd 批处理要求）
REM  - 推送前会暂停等你确认
REM ====================================================================

set "REPO=F:/无名杀/packages/extension/WhichWay"
set "ROOT=F:/无名杀"
set "BUILD=%ROOT%\apps\core\extension\WhichWay"
set "SCRIPTS=%REPO%\scripts"

cd /d "%REPO%" || (echo [错误] 仓库目录不存在: %REPO% & exit /b 1)

REM ---- 参数解析 ----
set "VERSION=%~1"
set "BASELINE=%~2"
if "%VERSION%"=="" (
	echo [用法] release.bat ^<版本号^> [output-core 基线]
	echo.
	echo 已有 tag:
	git tag -l "v*"
	exit /b 1
)

REM ---- 前置检查：工作区必须干净（保护未提交改动）----
set HASCHANGES=
for /f "delims=" %%i in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
	echo [错误] 工作区有未提交改动，发布前请先处理：
	git status --short
	exit /b 1
)

REM ---- 基线解析 ----
if "%BASELINE%"=="" (
	for /f "delims=" %%t in ('git describe --tags --abbrev=0 output 2^>nul') do set BASELINE=%%t
	if "!BASELINE!"=="" (
		echo [错误] output 分支上找不到任何 tag，无法确定 output-core 基线。请显式传入第二参数。
		exit /b 1
	)
)
git rev-parse --verify --quiet "%BASELINE%" >nul 2>&1 || (
	echo [错误] 基线 "%BASELINE%" 不是有效的 tag/commit。
	exit /b 1
)

REM 校验三分支都存在
for %%b in (dev-output output output-core) do (
	git rev-parse --verify --quiet "refs/heads/%%b" >nul 2>&1 || (
		echo [错误] 缺少分支 %%b，请先初始化（见仓库笔记中的首次发布流程）。
		exit /b 1
	)
)

echo [信息] 版本=%VERSION%  基线=%BASELINE%
echo.

REM ---- 记录当前分支 ----
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set ORIGBRANCH=%%b

REM ====================================================================
REM [1/6] 构建扩展
REM ====================================================================
echo [1/6] 构建扩展...
REM 先尝试清理旧产物；失败不中断（vite 的 emptyOutDir 会再处理）
if exist "%BUILD%" (
	rd /s /q "%BUILD%" 2>nul
	if exist "%BUILD%" (
		echo [警告] 旧产物目录删除失败（可能被占用），尝试重命名规避...
		ren "%BUILD%" "WhichWay-stale-%RANDOM%" 2>nul
	)
)
cd /d "%ROOT%"
call pnpm --filter ./packages/extension/WhichWay build
if errorlevel 1 (
	cd /d "%REPO%"
	echo [错误] 构建失败
	exit /b 1
)
cd /d "%REPO%"

REM 临时文件
set "TMPIDX=%REPO%\.release-idx"
set "COREIDX=%SCRIPTS%\core-index.tmp"
set "MSGDEV=%SCRIPTS%\msg-dev.txt"
set "MSGOUT=%SCRIPTS%\msg-out.txt"
set "MSGCORE=%SCRIPTS%\msg-core.txt"

REM ====================================================================
REM [2/6] dev-output：用临时索引把构建产物构造为新提交（不动工作区）
REM ====================================================================
echo [2/6] 生成 dev-output 提交...
del "%TMPIDX%" 2>nul
set "GIT_INDEX_FILE=%TMPIDX%"
git read-tree --empty
git --work-tree="%BUILD%" add -A
set "TREE="
for /f "delims=" %%t in ('git write-tree') do set TREE=%%t
set "GIT_INDEX_FILE="
del "%TMPIDX%" 2>nul
if "!TREE!"=="" (
	echo [错误] write-tree 失败（构建产物目录是否可写？）
	exit /b 1
)

> "%MSGDEV%" echo dev-output: 构建自 !ORIGBRANCH!
>>"%MSGDEV%" echo 产物目录 apps/core/extension/WhichWay，由 release.bat 生成。
set "DOCOMMIT="
for /f "delims=" %%c in ('git commit-tree !TREE! -p dev-output -F "%MSGDEV%"') do set DOCOMMIT=%%c
if "!DOCOMMIT!"=="" (
	echo [错误] commit-tree 失败，dev-output 未生成。
	exit /b 1
)
git update-ref refs/heads/dev-output !DOCOMMIT!
echo       dev-output = !DOCOMMIT!

REM ====================================================================
REM [3/6] output：构造 --no-ff 合并提交并打 tag
REM ====================================================================
echo [3/6] 生成 output 合并提交并打 tag %VERSION%...
> "%MSGOUT%" echo output: %VERSION% 大版本合并自 dev-output
>>"%MSGOUT%" echo 增量对比见 output-core（基线 %BASELINE% -^> %VERSION%）。
set "MERGE="
for /f "delims=" %%c in ('git commit-tree !TREE! -p output -p dev-output -F "%MSGOUT%"') do set MERGE=%%c
if "!MERGE!"=="" (
	echo [错误] commit-tree 失败，output 未生成。
	exit /b 1
)
git update-ref refs/heads/output !MERGE!
git tag %VERSION% !MERGE!
echo       output = !MERGE!  ^(tag %VERSION%^)

REM ====================================================================
REM [4/6] output-core：增量包（用 Node 小助手生成 index-info，稳妥处理中文路径）
REM ====================================================================
echo [4/6] 生成 output-core 增量包（%BASELINE% -^> %VERSION%）...
node "%SCRIPTS%\make-core-index.cjs" "%BASELINE%" "!MERGE!" "%COREIDX%"
if errorlevel 1 (
	echo [错误] 增量索引生成失败
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
	echo [错误] output-core 树构造失败。
	exit /b 1
)

> "%MSGCORE%" echo output-core: %VERSION% 增量包
>>"%MSGCORE%" echo 基线 %BASELINE% -^> %VERSION%（output）
>>"%MSGCORE%" echo 覆盖安装到 %BASELINE% 即可升级；删除项不含在内。
set "CORE="
for /f "delims=" %%c in ('git commit-tree !CORETREE! -p output-core -F "%MSGCORE%"') do set CORE=%%c
if "!CORE!"=="" (
	echo [错误] commit-tree 失败，output-core 未生成。
	exit /b 1
)
git update-ref refs/heads/output-core !CORE!
echo       output-core = !CORE!

REM ====================================================================
REM [5/6] 清理临时文件
REM ====================================================================
del "%COREIDX%" "%MSGDEV%" "%MSGOUT%" "%MSGCORE%" 2>nul

REM ====================================================================
REM [6/6] 推送（暂停确认）
REM ====================================================================
echo.
echo [信息] 本地已完成，即将推送：
echo     dev-output  !DOCOMMIT!
echo     output      !MERGE!  ^(tag %VERSION%^)
echo     output-core !CORE!
echo     tag         %VERSION%
echo.
echo     按 [任意键] 推送，按 [Ctrl+C] 取消（本地提交已保留，可手动 push）
pause >nul
git push origin dev-output output output-core
if errorlevel 1 (
	echo [错误] 分支推送失败（可手动 git push origin dev-output output output-core 重试）
	exit /b 1
)
git push origin %VERSION%
if errorlevel 1 (
	echo [错误] tag 推送失败（可手动 git push origin %VERSION% 重试）
	exit /b 1
)
echo.
echo [完成] 发布完成：%VERSION%
echo       当前仍在 !ORIGBRANCH! 分支，工作区未受影响。
endlocal
