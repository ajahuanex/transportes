#!/usr/bin/env python3
"""
Script de inicio para desarrollo local del backend DRTC Puno
"""
import os
import sys
import subprocess
import uvicorn
from pathlib import Path

def check_dependencies():
    """Verificar que las dependencias estén instaladas"""
    try:
        import fastapi
        import motor
        import aioredis
        print("✅ Dependencias de Python verificadas")
        return True
    except ImportError as e:
        print(f"❌ Dependencia faltante: {e}")
        print("Ejecuta: pip install -r requirements.txt")
        return False

def check_mongodb():
    """Verificar que MongoDB esté ejecutándose"""
    try:
        import pymongo
        client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
        client.server_info()
        print("✅ MongoDB conectado")
        return True
    except Exception as e:
        print(f"❌ MongoDB no disponible: {e}")
        print("Asegúrate de que MongoDB esté ejecutándose en localhost:27017")
        return False

def check_redis():
    """Verificar que Redis esté ejecutándose"""
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, db=0, socket_connect_timeout=2)
        r.ping()
        print("✅ Redis conectado")
        return True
    except Exception as e:
        print(f"⚠️  Redis no disponible: {e}")
        print("El sistema funcionará sin cache. Para mejor rendimiento, instala Redis")
        return True  # No es crítico para desarrollo

def create_directories():
    """Crear directorios necesarios"""
    directories = [
        "uploads",
        "reports", 
        "logs",
        "templates"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    
    print("✅ Directorios creados")

def main():
    """Función principal"""
    print("🚀 Iniciando DRTC Puno Backend - Modo Desarrollo")
    print("=" * 50)
    
    # Verificar dependencias
    if not check_dependencies():
        sys.exit(1)
    
    # Crear directorios
    create_directories()
    
    # Verificar servicios
    check_mongodb()
    check_redis()
    
    print("\n" + "=" * 50)
    print("🌐 Iniciando servidor FastAPI...")
    print("📖 API Docs: http://localhost:8000/docs")
    print("🔍 ReDoc: http://localhost:8000/redoc")
    print("💚 Health Check: http://localhost:8000/health")
    print("=" * 50)
    
    # Configurar variables de entorno
    os.environ.setdefault("ENV_FILE", "env.local")
    
    # Iniciar servidor
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        log_level="debug"
    )

if __name__ == "__main__":
    main() 