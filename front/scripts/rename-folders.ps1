# Run this script as Administrator!
# Close all programs using the public folder first

$public = "C:\Users\zivi7\mebel\front\public"

# Rename main catalog folders
$renames = @(
    @{old="catalog\1.ØÑÇÐ¾ÑÑ Ð¸ ÑÇÐºÐ°Ð½Ð¸"; new="catalog\1.shtory-i-tkani"},
    @{old="catalog\2.ÐÐ°Ð»ÑÐ·Ð¸"; new="catalog\2.zhalyuzi"},
    @{old="catalog\3.Ð Ð¸Ð¼ÑÐºÐ¸Ðµ"; new="catalog\3.rimskie"},
    @{old="catalog\4.ÐÐ°ÑÐ½Ð¸Ð·Ñ"; new="catalog\4.karnizy"},
    @{old="Ð¥ÑÐ¾Ð½Ð¾Ð»Ð¾Ð³Ð¸Ñ"; new="hronologiya"},
    @{old="Ð¤Ð¾ÑÐ¾ Ð´Ð»Ñ Ð½Ð¾Ð²Ð¾Ð³Ð¾ ÑÐ°Ð¹ÑÐ°"; new="foto-dlya-novogo-sayta"},
    @{old="ÐÐºÐ¾Ð½ÐºÐ¸ ÐºÐ°ÑÐ°Ð»Ð¾Ð³"; new="ikonki-katalog"},
    @{old="ÐÑÐµÐ´Ð»Ð°Ð³Ð°ÐµÐ¼"; new="predlagaem"},
    @{old="ÐÑÐ¸Ð¼ÐµÑÑ"; new="primery"},
    @{old="Ð ÐµÐ°Ð»ÑÐ½ÑÐµ Ð·Ð°Ð´Ð°ÑÐ¸"; new="realnye-zadachi"},
    @{old="Ð Ð¸Ð»ÑÑ"; new="rilsy"},
    @{old="ÑÐ¸Ð¼ÑÐ¸ÑÑÐºÐ°"; new="himchistka"}
)

foreach ($r in $renames) {
    $oldPath = Join-Path $public $r.old
    $newPath = Join-Path $public $r.new
    if (Test-Path $oldPath) {
        Write-Host "Renaming: $($r.old) -> $($r.new)"
        try {
            Rename-Item -Path $oldPath -NewName $r.new -Force -ErrorAction Stop
            Write-Host "  OK" -ForegroundColor Green
        } catch {
            Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Not found: $($r.old)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone. Check for errors above."
