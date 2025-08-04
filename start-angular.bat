@echo off
echo Configurando PATH para Angular CLI...
set PATH=%PATH%;%APPDATA%\npm

echo Navegando al directorio frontend...
cd frontend

echo Verificando Angular CLI...
ng version

echo.
echo Iniciando servidor de desarrollo...
ng serve

pause 