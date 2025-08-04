# 🚀 DRTC Puno - Desarrollo Local

Guía para configurar y ejecutar el sistema de gestión de transportes en modo desarrollo local.

## 📋 Requisitos Previos

### Software Necesario
- **Python 3.11+** - [Descargar](https://python.org/downloads/)
- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **MongoDB 7.0+** - [Descargar](https://mongodb.com/try/download/community)
- **Redis 7.0+** (opcional) - [Descargar](https://redis.io/download)

### Verificación de Instalación
```bash
# Verificar Python
python3 --version

# Verificar Node.js
node --version
npm --version

# Verificar MongoDB
mongod --version

# Verificar Redis (opcional)
redis-server --version
```

## 🛠️ Configuración Inicial

### 1. Configuración Automática (Recomendado)
```bash
# Ejecutar el script de configuración automática
./start-dev.sh
```

### 2. Configuración Manual

#### Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias de Python
pip3 install -r requirements.txt

# Crear archivo de configuración
cp env.local .env

# Crear directorios necesarios
mkdir -p uploads reports logs templates
```

#### Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias de Node.js
npm install

# Instalar Angular CLI globalmente (si no está instalado)
npm install -g @angular/cli@20
```

## 🚀 Iniciar el Desarrollo

### Opción 1: Scripts Automáticos
```bash
# Terminal 1 - Backend
./backend/run_dev.py

# Terminal 2 - Frontend
./frontend/start-dev.sh
```

### Opción 2: Comandos Manuales
```bash
# Terminal 1 - Backend
cd backend
python3 run_dev.py

# Terminal 2 - Frontend
cd frontend
ng serve --host 0.0.0.0 --port 4200 --open
```

## 🌐 URLs del Sistema

Una vez iniciado, podrás acceder a:

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📁 Estructura del Proyecto

```
PROYECTO 01/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── requirements.txt
│   ├── run_dev.py
│   └── env.local
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── styles/
│   ├── package.json
│   └── start-dev.sh
├── start-dev.sh
└── DESARROLLO_LOCAL.md
```

## 🔧 Configuración de Base de Datos

### MongoDB
1. **Instalar MongoDB** según tu sistema operativo
2. **Iniciar el servicio**:
   - Windows: Iniciar servicio MongoDB
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Verificar conexión**:
   ```bash
   mongosh
   # Deberías ver el prompt de MongoDB
   ```

### Redis (Opcional)
1. **Instalar Redis** según tu sistema operativo
2. **Iniciar el servicio**:
   - Windows: `redis-server`
   - macOS: `brew services start redis`
   - Linux: `sudo systemctl start redis`

## 🐛 Solución de Problemas

### Error: MongoDB no disponible
```bash
# Verificar si MongoDB está ejecutándose
ps aux | grep mongod

# Iniciar MongoDB manualmente
mongod --dbpath /data/db
```

### Error: Puerto ocupado
```bash
# Verificar puertos en uso
netstat -tulpn | grep :8000
netstat -tulpn | grep :4200

# Matar proceso que usa el puerto
kill -9 <PID>
```

### Error: Dependencias faltantes
```bash
# Backend
cd backend
pip3 install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Error: Permisos en scripts
```bash
# Hacer ejecutables los scripts
chmod +x start-dev.sh
chmod +x frontend/start-dev.sh
chmod +x backend/run_dev.py
```

## 📝 Variables de Entorno

El archivo `backend/env.local` contiene todas las configuraciones necesarias:

```bash
# Configuración básica
APP_NAME=DRTC Puno - Sistema de Gestión de Transportes
DEBUG=true
HOST=0.0.0.0
PORT=8000

# Base de datos
MONGODB_URL=mongodb://localhost:27017/drtc_puno
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=tu-clave-secreta-super-segura-cambiar-en-produccion
```

## 🔄 Hot Reload

- **Backend**: Los cambios en archivos Python se recargan automáticamente
- **Frontend**: Los cambios en archivos TypeScript/HTML/CSS se recargan automáticamente

## 📊 Monitoreo

### Logs del Backend
Los logs se muestran en la consola donde ejecutas `run_dev.py`

### Logs del Frontend
Los logs se muestran en la consola donde ejecutas `ng serve`

## 🛑 Detener el Desarrollo

1. **Backend**: `Ctrl+C` en la terminal del backend
2. **Frontend**: `Ctrl+C` en la terminal del frontend

## 📚 Recursos Adicionales

- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de Angular](https://angular.io/docs)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Redis](https://redis.io/documentation)

## 🤝 Contribución

1. Asegúrate de que el código pase las pruebas
2. Sigue las convenciones de código establecidas
3. Documenta los cambios realizados

---

**¡Listo para desarrollar! 🚀** 