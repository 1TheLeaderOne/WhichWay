@echo off
setlocal enabledelayedexpansion

:: 设置压缩质量（JPEG 85%，PNG 6级压缩）
set "jpg_quality=85"
set "png_compression=6"

:: 获取当前文件夹路径
set "folder=%CD%"

:: 递归查找所有 PNG 和 JPG 图片
for /r "%folder%" %%F in (*.jpg *.jpeg *.png) do (
    set "input=%%F"
    set "output=%%~dpnF_compressed%%~xF"

    echo 压缩: "!input!" -> "!output!"

    if /I "%%~xF"==".jpg" (
        magick convert "!input!" -quality %jpg_quality% "!output!"
    ) else if /I "%%~xF"==".png" (
        magick convert "!input!" -strip -define png:compression-level=%png_compression% "!output!"
    )

    :: 替换原文件
    if exist "!output!" (
        move /Y "!output!" "!input!"
    )
)

echo 压缩完成！
pause
