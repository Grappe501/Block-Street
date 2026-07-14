# Wipe re-downloadable tool caches from C: and junction Cursor agent project dirs to H:.
# Safe while Cursor is open (does NOT touch state.vscdb — use relocate-cursor-state-to-h.ps1 for that).
$ErrorActionPreference = "Continue"

$repo = "H:\Block-Street"
$hCaches = Join-Path $repo ".caches"
$hCursorIde = Join-Path $repo ".cursor-ide"

New-Item -ItemType Directory -Force -Path @(
  $hCaches,
  (Join-Path $hCaches "pip"),
  (Join-Path $hCaches "pnpm-store"),
  $hCursorIde,
  (Join-Path $hCursorIde "agent-tools"),
  (Join-Path $hCursorIde "agent-transcripts"),
  (Join-Path $hCursorIde "terminals")
) | Out-Null

# Apply redirects first
& (Join-Path $repo "scripts\setup-h-drive-env.ps1")

$toWipe = @(
  "$env:LOCALAPPDATA\pip",
  "$env:LOCALAPPDATA\pnpm-cache",
  "$env:LOCALAPPDATA\pnpm",
  "$env:LOCALAPPDATA\npm-cache",
  "$env:LOCALAPPDATA\ms-playwright",
  "$env:LOCALAPPDATA\node-gyp",
  "$env:USERPROFILE\.cursor\ai-tracking",
  "$env:APPDATA\Cursor\User\globalStorage\anysphere.cursor-agent-worker"
)

foreach ($p in $toWipe) {
  if (Test-Path $p) {
    Write-Host "Wiping $p"
    Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue
  }
}

if (Test-Path "$env:LOCALAPPDATA\Temp") {
  Get-ChildItem "$env:LOCALAPPDATA\Temp" -Force -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

function Move-And-Junction([string]$src, [string]$dst) {
  if (-not (Test-Path $src)) { Write-Host "skip missing $src"; return }
  $item = Get-Item $src -Force -ErrorAction SilentlyContinue
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    Write-Host "already junction: $src"
    return
  }
  Write-Host "Relocating $src -> $dst"
  New-Item -ItemType Directory -Force -Path $dst | Out-Null
  robocopy $src $dst /E /MOVE /R:1 /W:1 /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
  if (Test-Path $src) { Remove-Item -LiteralPath $src -Recurse -Force -ErrorAction SilentlyContinue }
  if (Test-Path $src) { Write-Host "LOCKED: $src"; return }
  cmd /c "mklink /J `"$src`" `"$dst`""
}

$proj = "$env:USERPROFILE\.cursor\projects\h-Block-Street"
Move-And-Junction "$proj\agent-tools" (Join-Path $hCursorIde "agent-tools")
Move-And-Junction "$proj\agent-transcripts" (Join-Path $hCursorIde "agent-transcripts")
Move-And-Junction "$proj\terminals" (Join-Path $hCursorIde "terminals")

Write-Host ""
Write-Host "C: free space after cache wipe:"
Get-PSDrive C | Format-Table Name, @{ n = "FreeGB"; e = { [math]::Round($_.Free / 1GB, 2) } }
Write-Host "Still ~20GB trapped in Cursor state.vscdb until you quit Cursor and run relocate-cursor-state-to-h.ps1"
