@echo off
cd /d "C:\MY PROJECTS\WINE-JET-ABKHAZIA"
git add -A
git commit -m "update: %date% %time%"
git push origin main
echo Done! Vercel will deploy in ~1 min.
pause
