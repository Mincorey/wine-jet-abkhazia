# replace-photos.ps1
# Скачивает тематические фото: виноград, вино, горы, лоза, Кавказ
$dest = "C:\MY PROJECTS\WINE-JET-ABKHAZIA\public\images"

$photos = @(
    # Герой (главная) — панорамный виноградник на закате
    @{ file="hero.jpg";       url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85" },
    # Виноградники — ряды лоз
    @{ file="vineyards1.jpg"; url="https://images.unsplash.com/photo-1474707813688-e7a0be6a7d8e?w=900&q=85" },
    # Виноградники — спелые гроздья крупным планом
    @{ file="vineyards2.jpg"; url="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=85" },
    # История — старый погреб / традиционное виноделие
    @{ file="story1.jpg";     url="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=85" },
    # История — сбор урожая вручную
    @{ file="story2.jpg";     url="https://images.unsplash.com/photo-1474650929547-48d3a14cde2f?w=900&q=85" },
    # Вино 1 (коллекция, главная) — бутылка красного
    @{ file="wine1.jpg";      url="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=700&q=85" },
    # Вино 3 (коллекция, главная) — бокал с вином на фоне виноградника
    @{ file="wine3.jpg";      url="https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=700&q=85" }
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

foreach ($p in $photos) {
    $outPath = Join-Path $dest $p.file
    Write-Host "  Downloading $($p.file)..." -NoNewline
    try {
        $wc.DownloadFile($p.url, $outPath)
        $size = [math]::Round((Get-Item $outPath).Length / 1KB)
        Write-Host " OK ($size KB)" -ForegroundColor Green
    } catch {
        Write-Host " FAILED: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Committing and pushing to GitHub..." -ForegroundColor Cyan
Set-Location "C:\MY PROJECTS\WINE-JET-ABKHAZIA"
git add -A
git commit -m "feat: replace photos with wine/vineyard themed images"
git push origin main
Write-Host "Done! Check Vercel in 1-2 minutes." -ForegroundColor Green
