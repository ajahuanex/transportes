#!/bin/bash

echo "Configurando PATH para Angular CLI..."
export PATH="$PATH:/c/Users/MTC-PUNO/AppData/Roaming/npm"

echo "Navegando al directorio frontend..."
cd frontend

echo "Verificando Angular CLI..."
ng version

echo ""
echo "Iniciando servidor de desarrollo..."
ng serve 