#!/bin/bash

echo "🚀 DRTC Puno - Sistema de Gestión de Transportes"
echo "=================================================="
echo "Iniciando en modo desarrollo local..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "No se encontró docker-compose.yml. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existan los directorios necesarios
if [ ! -d "backend" ]; then
    print_error "Directorio 'backend' no encontrado"
    exit 1
fi

if [ ! -d "frontend" ]; then
    print_error "Directorio 'frontend' no encontrado"
    exit 1
fi

print_success "Estructura del proyecto verificada"

echo ""
print_status "Requisitos del sistema:"
echo "1. Python 3.11+ instalado"
echo "2. Node.js 18+ instalado"
echo "3. MongoDB ejecutándose en localhost:27017"
echo "4. Redis ejecutándose en localhost:6379 (opcional)"
echo ""

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | awk '{print $2}')
    print_success "Python $PYTHON_VERSION detectado"
else
    print_error "Python 3 no está instalado"
    echo "Descarga e instala Python desde: https://python.org/"
    exit 1
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION detectado"
else
    print_error "Node.js no está instalado"
    echo "Descarga e instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo ""
print_status "Configurando backend..."

# Navegar al backend e instalar dependencias
cd backend

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt no encontrado en el directorio backend"
    exit 1
fi

print_status "Instalando dependencias de Python..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    print_success "Dependencias de Python instaladas"
else
    print_error "Error al instalar dependencias de Python"
    exit 1
fi

# Volver al directorio raíz
cd ..

echo ""
print_status "Configurando frontend..."

# Navegar al frontend e instalar dependencias
cd frontend

if [ ! -f "package.json" ]; then
    print_error "package.json no encontrado en el directorio frontend"
    exit 1
fi

print_status "Instalando dependencias de Node.js..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencias de Node.js instaladas"
else
    print_error "Error al instalar dependencias de Node.js"
    exit 1
fi

# Volver al directorio raíz
cd ..

echo ""
print_status "Verificando servicios..."

# Verificar MongoDB
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB está ejecutándose"
    else
        print_warning "MongoDB no está ejecutándose"
        echo "Para iniciar MongoDB:"
        echo "  - En Windows: Inicia el servicio MongoDB"
        echo "  - En macOS: brew services start mongodb-community"
        echo "  - En Linux: sudo systemctl start mongod"
    fi
else
    print_warning "MongoDB no está instalado"
    echo "Instala MongoDB desde: https://mongodb.com/try/download/community"
fi

# Verificar Redis
if command -v redis-server &> /dev/null; then
    if pgrep -x "redis-server" > /dev/null; then
        print_success "Redis está ejecutándose"
    else
        print_warning "Redis no está ejecutándose (opcional)"
    fi
else
    print_warning "Redis no está instalado (opcional)"
fi

echo ""
print_status "Configuración completada!"
echo ""
echo "Para iniciar el desarrollo:"
echo ""
echo "1. Iniciar el backend:"
echo "   cd backend && python3 run_dev.py"
echo ""
echo "2. En otra terminal, iniciar el frontend:"
echo "   cd frontend && npm start"
echo ""
echo "3. O usar los scripts individuales:"
echo "   ./backend/run_dev.py"
echo "   ./frontend/start-dev.sh"
echo ""
echo "URLs del sistema:"
echo "  📱 Frontend: http://localhost:4200"
echo "  🔧 Backend API: http://localhost:8000"
echo "  📖 API Docs: http://localhost:8000/docs"
echo "  🔍 ReDoc: http://localhost:8000/redoc"
echo ""

print_success "¡Configuración completada! El proyecto está listo para desarrollo." 