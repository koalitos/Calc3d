@echo off
echo ========================================
echo  LIMPEZA FORCADA - Calc3D Build
echo ========================================
echo.

echo [1/5] Finalizando processos...
taskkill /F /IM Calc3DPrint.exe 2>nul
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM chrome.exe 2>nul

echo [2/5] Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo [3/5] Removendo pasta dist...
if exist dist (
    attrib -r -s -h dist\*.* /s /d
    rd /s /q dist 2>nul
)

echo [4/5] Aguardando mais 2 segundos...
timeout /t 2 /nobreak >nul

echo [5/5] Verificando...
if exist dist (
    echo AVISO: Pasta dist ainda existe!
    echo Por favor, delete manualmente e tente novamente.
    explorer dist
) else (
    echo Sucesso! Pasta dist removida.
    echo.
    echo Agora execute: npm run dist
)

echo.
echo ========================================
pause
