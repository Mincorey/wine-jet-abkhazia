# fix-photos2.ps1 — альтернативные URL для двух упавших фото
$dest = "C:\MY PROJECTS\WINE-JET-ABKHAZIA\public\images"

$photos = @(
    # vineyards1 — ряды лоз (альтернативный ID)
    @{ file="vineyards1.jpg"; url="https://images.unsplash.com/photo-1568213816046-0a6e95aa2892?w=900&q=85" },
    # story2 — сбор урожая вручную (альтернативный ID)
    @{ file="story2.jpg";     url="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=900&q=85" }
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
        # Запасной вариант — picsum с фиксированным сидом
        $fallback = if ($p.file -eq "vineyards1.jpg") { "https://picsum.photos/seed/vines42/900/1125" } else { "https://picsum.photos/seed/harvest17/900/1125" }
        Write-Host "  Trying fallback..." -NoNewline
        try {
            $wc.DownloadFile($fallback, $outPath)
            $size2 = [math]::Round((Get-Item $outPath).Length / 1KB)
            Write-Host " OK ($size2 KB)" -ForegroundColor Yellow
        } catch {
            Write-Host " FAILED too: $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Set-Location "C:\MY PROJECTS\WINE-JET-ABKHAZIA"
git add public/images/vineyards1.jpg public/images/story2.jpg
git commit -m "fix: restore missing vineyards1 and story2 photos"
git push origin main
Write-Host "Done!" -ForegroundColor Green
