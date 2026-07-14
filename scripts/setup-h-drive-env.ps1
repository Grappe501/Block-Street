# One-time / re-run setup: redirect USER temp + tool caches to H:\Block-Street
# Never leave npm/pip/pnpm/playwright/temp on C: (C: is critically low).
$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$tmp = Join-Path $repo ".tmp"
$npmCache = Join-Path $repo ".npm-cache"
$caches = Join-Path $repo ".caches"

New-Item -ItemType Directory -Force -Path @(
  $tmp,
  $npmCache,
  $caches,
  (Join-Path $caches "pip"),
  (Join-Path $caches "pnpm-store"),
  (Join-Path $caches "playwright"),
  (Join-Path $caches "uv")
) | Out-Null

$map = @{
  TEMP                     = $tmp
  TMP                      = $tmp
  TMPDIR                   = $tmp
  npm_config_cache         = $npmCache
  npm_config_tmp           = $tmp
  PIP_CACHE_DIR            = (Join-Path $caches "pip")
  UV_CACHE_DIR             = (Join-Path $caches "uv")
  XDG_CACHE_HOME           = $caches
  PNPM_STORE_DIR           = (Join-Path $caches "pnpm-store")
  PLAYWRIGHT_BROWSERS_PATH = (Join-Path $caches "playwright")
}

foreach ($key in $map.Keys) {
  [Environment]::SetEnvironmentVariable($key, $map[$key], "User")
  Set-Item -Path "Env:$key" -Value $map[$key]
}

Write-Host "USER environment redirected to H:"
foreach ($key in ($map.Keys | Sort-Object)) {
  Write-Host ("  {0}={1}" -f $key, $map[$key])
}
Write-Host ""
Write-Host "Restart Cursor after first run so all child processes inherit these values."
Write-Host "To reclaim C: space from Cursor itself (state.vscdb ~20GB), quit Cursor and run:"
Write-Host "  powershell -File scripts\relocate-cursor-state-to-h.ps1"
