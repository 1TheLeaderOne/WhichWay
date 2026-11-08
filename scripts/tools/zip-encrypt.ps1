# WhichWay release helper - archive password prompt + AES-256 zip creation.
#
# release.bat calls this script so the password is never echoed and never
# expanded by cmd. All data travels through environment variables because
# the repository path contains CJK characters:
#
#   prompt mode : WW_PASSFILE          where to write the password
#                 WW_ZIP_PASSWORD      optional, skips the interactive prompt
#
#   zip mode    : WW_PASSFILE WW_TAR WW_LAYOUT WW_ZIP
#                 flat    -> WW_SRC
#                 wrapped -> WW_PARENT WW_ENTRY
#
# Requires Windows bsdtar (C:\Windows\System32\tar.exe, Windows 10 1803+).
param(
    [ValidateSet("prompt", "zip")]
    [string]$Mode = "prompt"
)

$ErrorActionPreference = "Stop"

function Fail {
    param([string]$Message)
    [Console]::Error.WriteLine("[ERROR] $Message")
    exit 1
}

# Quote one argv element for a native Windows process (MSVCRT rules), so a
# password with spaces, quotes or trailing backslashes reaches tar intact.
function Quote-NativeArg {
    param([string]$Value)
    if ($Value.Length -gt 0 -and $Value -notmatch '[\s"]') {
        return $Value
    }
    $builder = New-Object System.Text.StringBuilder
    [void]$builder.Append('"')
    $backslashes = 0
    foreach ($ch in $Value.ToCharArray()) {
        if ($ch -eq [char]'\') {
            $backslashes++
            continue
        }
        if ($ch -eq [char]'"') {
            if ($backslashes -gt 0) {
                [void]$builder.Append(('\' * (2 * $backslashes)))
            }
            [void]$builder.Append('\"')
            $backslashes = 0
            continue
        }
        if ($backslashes -gt 0) {
            [void]$builder.Append(('\' * $backslashes))
            $backslashes = 0
        }
        [void]$builder.Append($ch)
    }
    if ($backslashes -gt 0) {
        [void]$builder.Append(('\' * (2 * $backslashes)))
    }
    [void]$builder.Append('"')
    return $builder.ToString()
}

function Read-PlainPassword {
    param([string]$Prompt)
    $secure = Read-Host -AsSecureString $Prompt
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

function Save-PasswordFile {
    param([string]$Path, [string]$Password)
    $parent = [System.IO.Path]::GetDirectoryName($Path)
    if (-not [string]::IsNullOrEmpty($parent) -and -not [System.IO.Directory]::Exists($parent)) {
        [void][System.IO.Directory]::CreateDirectory($parent)
    }
    [System.IO.File]::WriteAllText($Path, $Password, (New-Object System.Text.UTF8Encoding($false)))
}

function Invoke-Tar {
    param([string]$TarPath, [string[]]$TarArgs)
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $TarPath
    $startInfo.Arguments = (($TarArgs | ForEach-Object { Quote-NativeArg $_ }) -join " ")
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardError = $true
    $process = [System.Diagnostics.Process]::Start($startInfo)
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    if (-not [string]::IsNullOrEmpty($stderr)) {
        [Console]::Error.Write($stderr)
    }
    return $process.ExitCode
}

# True when the archive has at least one local file header that is AES
# encrypted: general-purpose flag bit 0 set and compression method 99.
# Directory entries are stored unencrypted by libarchive, so the first
# header alone is not enough - scan for the first encrypted file header.
function Test-AesZip {
    param([string]$Path)
    $stream = [System.IO.File]::OpenRead($Path)
    try {
        $take = [int][Math]::Min($stream.Length, 4194304)
        $buffer = New-Object byte[] $take
        $read = 0
        while ($read -lt $take) {
            $count = $stream.Read($buffer, $read, $take - $read)
            if ($count -le 0) {
                break
            }
            $read += $count
        }
    }
    finally {
        $stream.Dispose()
    }

    $start = 0
    while (($read - $start) -ge 30) {
        $index = [Array]::IndexOf($buffer, [byte]0x50, $start)
        if ($index -lt 0 -or ($read - $index) -lt 30) {
            break
        }
        if ($buffer[$index + 1] -eq 0x4b -and $buffer[$index + 2] -eq 0x03 -and $buffer[$index + 3] -eq 0x04) {
            $flags = [BitConverter]::ToUInt16($buffer, $index + 6)
            $method = [BitConverter]::ToUInt16($buffer, $index + 8)
            if (($flags -band 1) -ne 0 -and $method -eq 99) {
                return $true
            }
        }
        $start = $index + 1
    }
    return $false
}

if ($Mode -eq "prompt") {
    $passwordFile = $env:WW_PASSFILE
    if ([string]::IsNullOrEmpty($passwordFile)) {
        Fail "WW_PASSFILE is not set."
    }

    $password = $env:WW_ZIP_PASSWORD
    if ([string]::IsNullOrEmpty($password)) {
        $attempt = 0
        while ($attempt -lt 3 -and [string]::IsNullOrEmpty($password)) {
            $attempt++
            try {
                $first = Read-PlainPassword "Archive password (hidden)"
                if ([string]::IsNullOrEmpty($first)) {
                    [Console]::Error.WriteLine("[ERROR] the password must not be empty.")
                    continue
                }
                $second = Read-PlainPassword "Confirm archive password"
                if ($first -cne $second) {
                    [Console]::Error.WriteLine("[ERROR] the passwords do not match; try again.")
                    continue
                }
                $password = $first
            }
            catch {
                Fail "cannot read a password here. Set WW_ZIP_PASSWORD for non-interactive use."
            }
        }
        if ([string]::IsNullOrEmpty($password)) {
            Fail "no password was entered - aborted."
        }
    }

    if ($password -match "[\r\n]") {
        Fail "the password must not contain line breaks."
    }

    Save-PasswordFile $passwordFile $password
    Write-Output "[INFO] archive password accepted (not echoed)."
    exit 0
}

if ($Mode -eq "zip") {
    $passwordFile = $env:WW_PASSFILE
    $zipPath = $env:WW_ZIP
    $tarPath = $env:WW_TAR
    $layout = $env:WW_LAYOUT

    if ([string]::IsNullOrEmpty($passwordFile) -or -not [System.IO.File]::Exists($passwordFile)) {
        Fail "the password file was not found: $passwordFile"
    }
    if ([string]::IsNullOrEmpty($zipPath)) {
        Fail "WW_ZIP is not set."
    }
    if ([string]::IsNullOrEmpty($tarPath) -or -not [System.IO.File]::Exists($tarPath)) {
        Fail "bsdtar was not found: $tarPath"
    }

    $password = [System.IO.File]::ReadAllText($passwordFile, (New-Object System.Text.UTF8Encoding($false)))
    if ($password.Length -eq 0) {
        Fail "the password file is empty."
    }
    if ($password -match "[\r\n]") {
        Fail "the password must not contain line breaks."
    }

    if ([System.IO.File]::Exists($zipPath)) {
        [System.IO.File]::Delete($zipPath)
    }

    $tarArgs = @("-a", "-c", "-f", $zipPath, "--options", "zip:encryption=aes256", "--passphrase", $password)
    if ($layout -eq "flat") {
        $source = $env:WW_SRC
        if ([string]::IsNullOrEmpty($source) -or -not [System.IO.Directory]::Exists($source)) {
            Fail "the source folder was not found: $source"
        }
        $tarArgs += @("-C", $source, "*")
    }
    elseif ($layout -eq "wrapped") {
        $parent = $env:WW_PARENT
        $entry = $env:WW_ENTRY
        if ([string]::IsNullOrEmpty($parent) -or -not [System.IO.Directory]::Exists($parent)) {
            Fail "the parent folder was not found: $parent"
        }
        if ([string]::IsNullOrEmpty($entry)) {
            Fail "WW_ENTRY is not set."
        }
        $tarArgs += @("-C", $parent, $entry)
    }
    else {
        Fail "unknown WW_LAYOUT: $layout"
    }

    $exitCode = Invoke-Tar $tarPath $tarArgs
    if ($exitCode -ne 0) {
        if ([System.IO.File]::Exists($zipPath)) {
            [System.IO.File]::Delete($zipPath)
        }
        Fail "tar failed with exit code $exitCode; no archive was kept."
    }
    if (-not [System.IO.File]::Exists($zipPath)) {
        Fail "tar reported success but wrote no archive."
    }

    $size = (New-Object System.IO.FileInfo($zipPath)).Length
    if ($size -le 0) {
        [System.IO.File]::Delete($zipPath)
        Fail "the archive is empty; removed."
    }
    if (-not (Test-AesZip $zipPath)) {
        [System.IO.File]::Delete($zipPath)
        Fail "the archive does not contain AES-encrypted entries; removed."
    }

    Write-Output "[INFO] wrote $zipPath ($size bytes, AES-256)"
    exit 0
}

Fail "unknown mode: $Mode"
