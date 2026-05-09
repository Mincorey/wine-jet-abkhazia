@echo off
echo === Wine Jet Abkhazia - Push to GitHub ===
echo.

cd /d "%~dp0"

echo [1/6] Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Download from https://git-scm.com
    pause
    exit /b 1
)
echo Git OK

echo [2/6] Removing old .git folder if exists...
if exist ".git" (
    rmdir /s /q ".git"
    echo Removed old .git
) else (
    echo No .git folder found
)

echo [3/6] Initializing repository...
git init -b main
if errorlevel 1 ( echo ERROR: git init failed & pause & exit /b 1 )

echo [4/6] Setting up user config...
git config user.email "antonov.oleg.1987@gmail.com"
git config user.name "Mincorey"
git remote add origin https://github.com/Mincorey/wine-jet-abkhazia.git
echo Config done

echo [5/6] Staging files and creating commit...
git add .
git commit -m "feat: migrate from Firebase to Supabase"
if errorlevel 1 ( echo ERROR: commit failed & pause & exit /b 1 )
echo Commit created

echo [6/6] Pushing to GitHub...
echo.
echo A browser window may open for GitHub authentication - please log in.
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo If you see "rejected" error, the repo is not empty.
    echo Run this command manually:
    echo   git push -u origin main --force
    echo.
) else (
    echo.
    echo SUCCESS! https://github.com/Mincorey/wine-jet-abkhazia
)
pause
