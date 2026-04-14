# Cleanup script: Remove .jpg, .png, .jfif files if .webp copy exists
# Run from project root: .\scripts\cleanup-images.ps1

$publicDir = Join-Path $PSScriptRoot ".." ".." "front" "public"
$extensionsToCheck = @(".jpg", ".jpeg", ".png", ".jfif")
$deletedCount = 0
$keptCount = 0

Write-Host "Scanning for duplicate images in public folder..." -ForegroundColor Cyan
Write-Host "Looking for: $($extensionsToCheck -join ', ') with .webp copies" -ForegroundColor Gray
Write-Host ""

# Find all files with target extensions
$filesToCheck = Get-ChildItem -Path $publicDir -Recurse -File | Where-Object {
    $extensionsToCheck -contains $_.Extension.ToLower()
}

Write-Host "Found $($filesToCheck.Count) files to check" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $filesToCheck) {
    $webpPath = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")

    if (Test-Path $webpPath) {
        # WebP copy exists - delete original
        try {
            Remove-Item $file.FullName -Force
            Write-Host "[DELETED] $($file.FullName.Substring($publicDir.Length))" -ForegroundColor Red
            $deletedCount++
        } catch {
            Write-Host "[ERROR] Failed to delete: $($file.Name)" -ForegroundColor DarkRed
        }
    } else {
        # No WebP copy - keep original
        Write-Host "[KEPT]    $($file.FullName.Substring($publicDir.Length)) (no .webp copy)" -ForegroundColor Green
        $keptCount++
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Cleanup complete!" -ForegroundColor Cyan
Write-Host "Deleted: $deletedCount files" -ForegroundColor Red
Write-Host "Kept:    $keptCount files (no .webp copy)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
