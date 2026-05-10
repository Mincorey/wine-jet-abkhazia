@echo off
cd /d "C:\MY PROJECTS\WINE-JET-ABKHAZIA"
del /f fix-push.bat push-images.bat push-images-force.bat push-new-images.bat push-fix.bat push-to-github.bat 2>nul
del /f download-and-push-images.ps1 fix-missing-images.ps1 replace-photos.ps1 2>nul
del /f download.mjs seed_news.mjs test_storage.mjs setup-admin.mjs 2>nul
del /f "public\images\wine2.jpg" "public\images\news2.jpg" "public\images\news3.jpg" 2>nul
git add -A
git commit -m "chore: remove unused temp files and images"
git push origin main
echo Cleanup done!
pause
