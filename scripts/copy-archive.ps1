# Copy the Vol 7 No 364 HTML archive into data/archive/
param(
    [string]$Source = (Join-Path $PSScriptRoot "..\..\Vol 7 No 364  Archive (1)\Vol 7 No 364  Archive")
)

$Root = Split-Path $PSScriptRoot -Parent
$Target = Join-Path $Root "data\archive"

if (-not (Test-Path $Source)) {
    Write-Error "Source not found: $Source`nUsage: .\copy-archive.ps1 -Source 'path\to\archive'"
    exit 1
}

New-Item -ItemType Directory -Force -Path $Target | Out-Null
Copy-Item -Path (Join-Path $Source "*") -Destination $Target -Recurse -Force
Write-Host "Archive copied to $Target"
