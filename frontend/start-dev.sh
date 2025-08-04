#!/bin/bash

echo "🚀 Iniciando DRTC Puno Frontend - Modo Desarrollo"
echo "=================================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Descarga e instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo "✅ npm $(npm --version) detectado"

# Verificar que Angular CLI esté instalado
if ! command -v ng &> /dev/null; then
    echo "⚠️  Angular CLI no está instalado globalmente"
    echo "Instalando Angular CLI..."
    npm install -g @angular/cli@20
fi

echo "✅ Angular CLI $(ng version | grep 'Angular CLI' | awk '{print $3}') detectado"

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "=================================================="
echo "🌐 Iniciando servidor de desarrollo Angular..."
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo "=================================================="

# Iniciar servidor de desarrollo
ng serve --host 0.0.0.0 --port 4200 --open 