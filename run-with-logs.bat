@echo off
echo ========================================
echo Calc 3D Print - Executando com Logs
echo ========================================
echo.

REM Executar o app e mostrar todos os logs
"dist\win-unpacked\Calc 3D Print.exe" 2>&1

echo.
echo ========================================
echo App encerrado
echo ========================================
pause
