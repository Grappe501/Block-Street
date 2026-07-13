# One-time setup: redirect Windows USER temp and npm cache to H:\Block-Street
$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$tmp = Join-Path $repo ".tmp"
$npmCache = Join-Path $repo ".npm-cache"

New-Item -ItemType Directory -Force -Path $tmp, $npmCache | Out-Null

[Environment]::SetEnvironmentVariable("TEMP", $tmp, "User")
[Environment]::SetEnvironmentVariable("TMP", $tmp, "User")
[Environment]::SetEnvironmentVariable("npm_config_cache", $npmCache, "User")
[Environment]::SetEnvironmentVariable("npm_config_tmp", $tmp, "User")

# Apply to current session too
$env:TEMP = $tmp
$env:TMP = $tmp
$env:npm_config_cache = $npmCache
$env:npm_config_tmp = $tmp

Write-Host "USER environment updated:"
Write-Host "  TEMP=$tmp"
Write-Host "  TMP=$tmp"
Write-Host "  npm_config_cache=$npmCache"
Write-Host ""
Write-Host "Restart Cursor/terminals for this to take effect everywhere."
