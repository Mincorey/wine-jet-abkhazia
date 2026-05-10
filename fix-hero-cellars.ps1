# fix-hero-cellars.ps1 — заменяем hero и cellars на правильные фото
$dest = "C:\MY PROJECTS\WINE-JET-ABKHAZIA\public\images"

$photos = @(
    # Герой — виноградник в закатном свете, ряды лоз
    @{
        file="hero.jpg"
        urls=@(
            "https://images.unsplash.com/photo-1486328228599-85db4443971f?w=1600&q=85",
            "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1600&q=85",
            "https://picsum.photos/seed/vineyard-hero/1600/900"
        )
    },
    # Погреб — дубовые бочки в винном погребе
    @{
        file="cellars.jpg"
        urls=@(
            "https://images.unsplash.com/photo-1578911373-c72ea82ba703?w=900&q=85",
            "https://images.unsplash.com/photo-1551269901-5c2b69de8c52?w=900&q=85",
            "https://picsum.photos/seed/wine-cellar/900/1125"
        )
    }
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

foreach ($p in $photos) {
    $outPath = Join-Path $dest $p.file
    $saved = $false
    foreach ($url in $p.urls) {
        Write-Host "  $($p.file) <- $($url.Split('?')[0].Split('/')[-1])..." -NoNewline
        try {
            $wc.DownloadFile($url, $outPath)
            $size = [math]::Round((Get-Item $outPath).Length / 1KB)
            Write-Host " OK ($size KB)" -ForegroundColor Green
            $saved = $true
            break
        } catch {
            Write-Host " 404, trying next..." -ForegroundColor Yellow
        }
    }
    if (-not $saved) { Write-Host "  $($p.file): ALL URLS FAILED" -ForegroundColor Red }
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Set-Location "C:\MY PROJECTS\WINE-JET-ABKHAZIA"
git add public/images/hero.jpg public/images/cellars.jpg
git commit -m "fix: replace barista photos with vineyard and wine cellar"
git push origin main
Write-Host "Done! Vercel deploys in ~1 min." -ForegroundColor Green
