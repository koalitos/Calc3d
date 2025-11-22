@echo off
echo ========================================
echo Verificando Build
echo ========================================
echo.

echo Verificando estrutura do build...
echo.

if exist "dist\win-unpacked\Calc 3D Print.exe" (
    echo [OK] Executavel encontrado
) else (
    echo [ERRO] Executavel NAO encontrado
)

if exist "dist\win-unpacked\resources\app.asar" (
    echo [OK] app.asar encontrado
) else (
    echo [ERRO] app.asar NAO encontrado
)

if exist "dist\win-unpacked\resources\backend" (
    echo [OK] Backend encontrado
) else (
    echo [ERRO] Backend NAO encontrado
)

if exist "dist\win-unpacked\resources\frontend" (
    echo [OK] Frontend encontrado
) else (
    echo [ERRO] Frontend NAO encontrado
)

if exist "dist\win-unpacked\resources\frontend\build\index.html" (
    echo [OK] index.html encontrado
) else (
    echo [ERRO] index.html NAO encontrado
)

echo.
echo ========================================
echo Listando arquivos em resources:
echo ========================================
dir /b "dist\win-unpacked\resources"

echo.
pause
