@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 首先统计所有MP3文件的总数
set file_count=0
for /r %%f in (*.mp3) do (
    set /a file_count+=1
)

if %file_count% equ 0 (
    echo 没有找到MP3文件。
    pause
    exit /b
)

echo 总共发现 %file_count% 个MP3文件需要压缩...
echo.

set processed=0
:: 遍历当前目录及所有子目录中的 MP3 文件
for /r %%f in (*.mp3) do (
    set /a processed+=1
    call :progress !processed! !file_count! "%%f"
    
    :: 生成临时文件路径
    set "temp_file=%%~dpnf_compressed.mp3"

    :: 使用 ffmpeg 压缩 MP3 并覆盖原文件
    ffmpeg -i "%%f" -vn -c:a libmp3lame -qscale:a 2 "!temp_file!" -y >nul 2>&1

    :: 删除原文件
    del "%%f" >nul 2>&1

    :: 重新命名压缩后的文件，覆盖原文件
    ren "!temp_file!" "%%~nxf" >nul 2>&1
)

echo.
echo 所有 MP3 文件已压缩并替换原文件。
pause
exit /b

:progress
setlocal
set current=%1
set total=%2
set filename=%~3

:: 计算百分比
set /a percent=(current * 100) / total

:: 创建进度条 (50个字符宽)
set progress=
set /a progress_length=percent / 2
for /l %%i in (1,1,!progress_length!) do set "progress=!progress!█"
set /a remaining=50 - progress_length
for /l %%i in (1,1,!remaining!) do set "progress=!progress! "

:: 显示进度信息
cls
echo 正在处理: !filename!
echo.
echo 进度: [!progress!] !percent!%%
echo 已完成 !current! / !total! 个文件
endlocal
exit /b

