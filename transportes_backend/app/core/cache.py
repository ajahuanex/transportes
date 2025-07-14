# app/core/cache.py
import redis.asyncio as redis
from typing import Optional
from app.core.config import settings

# Instancia global del cliente Redis
redis_client: Optional[redis.Redis] = None

async def initiate_redis():
    """
    Inicializa la conexión con Redis.
    """
    global redis_client
    try:
        # Construye los argumentos de conexión base
        conn_args = {
            "host": settings.REDIS_HOST,
            "port": settings.REDIS_PORT,
            "db": settings.REDIS_DB,
            "decode_responses": True,
            "socket_connect_timeout": 5 # Tiempo de espera de conexión en segundos
        }
        
        # Lógica de autenticación simplificada:
        # Solo añade 'password' y 'username' si la contraseña NO está vacía.
        # Esto cubre el caso de que Redis no requiera autenticación (contraseña vacía).
        if settings.REDIS_PASSWORD: # Si la contraseña NO es una cadena vacía
            conn_args["password"] = settings.REDIS_PASSWORD
            # Si hay contraseña, también enviamos el usuario si está definido
            if settings.REDIS_USERNAME:
                conn_args["username"] = settings.REDIS_USERNAME
        
        redis_client = redis.Redis(**conn_args) # Pasa los argumentos construidos
        
        await redis_client.ping() # Prueba la conexión
        print("Redis client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Redis client: {e}")
        # En un entorno de producción, podrías querer levantar una excepción o manejar esto de otra manera.

async def close_redis_connection():
    """
    Cierra la conexión con Redis.
    """
    global redis_client
    if redis_client:
        await redis_client.aclose() 
        print("Conexión de Redis cerrada.")

async def get_cache(key: str) -> Optional[str]:
    """
    Obtiene un valor de la caché de Redis.
    """
    if redis_client:
        return await redis_client.get(key)
    return None

async def set_cache(key: str, value: str, ex: Optional[int] = None):
    """
    Establece un valor en la caché de Redis.
    :param key: La clave para almacenar.
    :param value: El valor a almacenar.
    :param ex: Tiempo de expiración en segundos (opcional).
    """
    if redis_client:
        await redis_client.set(key, value, ex=ex)

async def delete_cache(key: str):
    """
    Elimina una clave de la caché de Redis.
    """
    if redis_client:
        await redis_client.delete(key)
