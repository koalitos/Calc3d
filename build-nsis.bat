@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Criando Instalador NSIS - Calc 3D Print
echo ========================================
echo.

REM Desabilitar code signing
set CSC_IDENTITY_AUTO_DISCOVERY=false

echo 1. Fazendo build do frontend...
call npm run build
if errorlevel 1 (
    echo ERRO no build do frontend!
    pause
    exit /b 1
)

echo.
echo 2. Criando instalador NSIS...
echo (Ignorando erros de code signing - isso e normal)
echo.

REM Executar electron-builder e capturar o resultado
call npx electron-builder --win 2>&1

echo.
echo ========================================
echo Verificando resultado...
echo ========================================
echo.

REM Verificar se o instalador foi criado
if exist "dist\Calc3DPrint-Setup-1.0.0.exe" (
    echo [SUCESSO] Instalador NSIS criado!
    echo.
    echo Arquivo: dist\Calc3DPrint-Setup-1.0.0.exe
    echo.
    for %%A in ("dist\Calc3DPrint-Setup-1.0.0.exe") do (
        set size=%%~zA
        set /a sizeMB=!size! / 1048576
        echo Tamanho: !sizeMB! MB
    )
    echo.
    echo ========================================
    echo PRONTO PARA DISTRIBUIR!
    echo ========================================
    echo.
    echo O usuario deve:
    echo 1. Baixar Calc3DPrint-Setup-1.0.0.exe
    echo 2. Executar o instalador
    echo 3. Seguir as instrucoes na tela
    echo 4. Pronto!
    echo.
) else (
    echo [AVISO] Instalador NSIS nao foi criado
    echo.
    if exist "dist\win-unpacked\Calc 3D Print.exe" (
        echo Mas o build unpacked foi criado!
        echo Criando ZIP como alternativa...
        echo.
        powershell -Command "Compress-Archive -Path 'dist\win-unpacked\*' -DestinationPath 'dist\Calc3DPrint-1.0.0-Windows.zip' -Force"
        
        if exist "dist\Calc3DPrint-1.0.0-Windows.zip" (
            echo [SUCESSO] ZIP criado como alternativa!
            echo Arquivo: dist\Calc3DPrint-1.0.0-Windows.zip
        )
    ) else (
        echo [ERRO] Nenhum build foi criado!
    )
)

echo.
pause
