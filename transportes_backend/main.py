# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import initiate_database
from app.core.cache import initiate_redis, close_redis_connection
from app.api.api import api_router
from app.core.config import settings

# Define el lifecycle context manager para FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Función que se ejecuta al inicio y al final de la vida de la aplicación.
    Aquí se inicializa la conexión a la base de datos y Redis.
    """
    print("Iniciando conexión a la base de datos MongoDB...")
    await initiate_database()
    print("Conexión a MongoDB establecida y modelos verificados.")

    print("Iniciando conexión a Redis...")
    await initiate_redis()
    print("Conexión a Redis establecida.")
    
    yield # La aplicación se ejecuta aquí
    
    print("Cerrando conexión a Redis...")
    await close_redis_connection()
    print("Conexión a Redis cerrada.")
    print("Aplicación finalizada.")

# Inicializa la aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan # Asocia la función lifespan a la aplicación
)

# Configuración de CORS
origins = [
    "http://localhost",
    "http://localhost:4200", # Puerto por defecto de Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye el router principal de la API
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR + "/")
async def read_root():
    """
    Endpoint de prueba para verificar que la API está funcionando.
    """
    return {"message": f"API de Gestión DRTC Puno v{settings.API_VERSION} en funcionamiento."}

# Para ejecutar: uvicorn main:app --reload --port 8000
