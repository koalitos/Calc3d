@echo off
echo Limpando arquivos de build...

REM Matar processos do Electron
taskkill /F /IM Calc3DPrint.exe 2>nul
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul

echo Aguardando processos finalizarem...
timeout /t 2 /nobreak >nul

REM Tentar deletar a pasta dist
if exist dist (
    echo Deletando pasta dist...
    rmdir /s /q dist 2>nul
    
    REM Se ainda existir, tentar novamente
    if exist dist (
        echo Tentando novamente...
        timeout /t 2 /nobreak >nul
        rmdir /s /q dist 2>nul
    )
)

REM Limpar cache do npm
echo Limpando cache...
npm cache clean --force

echo.
echo Limpeza concluida!
echo Agora execute: npm run dist
echo.
pause
