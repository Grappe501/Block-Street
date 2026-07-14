# MUST run with Cursor FULLY QUIT (no Cursor.exe).
# Moves bloated Cursor state DB off C: onto H: via directory junction.
$ErrorActionPreference = "Stop"

$cursor = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
if ($cursor) {
  Write-Error "Cursor is still running. Quit Cursor completely, then re-run this script."
}

$srcParent = "$env:APPDATA\Cursor\User\globalStorage"
$dstParent = "H:\CursorData\globalStorage"
$state = Join-Path $srcParent "state.vscdb"

if (-not (Test-Path $state)) {
  Write-Error "state.vscdb not found at $state"
}

$sizeGb = [math]::Round((Get-Item $state).Length / 1GB, 2)
Write-Host "state.vscdb is ${sizeGb} GB on C:. Moving to $dstParent ..."

New-Item -ItemType Directory -Force -Path "H:\CursorData" | Out-Null

$item = Get-Item $srcParent -Force
if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
  Write-Host "globalStorage is already a junction. Nothing to do."
  exit 0
}

# Move entire globalStorage folder to H:, then junction back so Cursor still finds the path.
if (Test-Path $dstParent) {
  Write-Error "Destination already exists: $dstParent — remove or merge manually first."
}

Move-Item -LiteralPath $srcParent -Destination $dstParent
cmd /c "mklink /J `"$srcParent`" `"$dstParent`""

Write-Host "Done. globalStorage now lives on H: via junction."
Write-Host "Free space on C: should jump by ~${sizeGb} GB. Re-open Cursor."

Get-PSDrive C | Format-Table Name, @{ n = "FreeGB"; e = { [math]::Round($_.Free / 1GB, 2) } }
