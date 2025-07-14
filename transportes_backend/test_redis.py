import asyncio
import redis.asyncio as redis
from app.core.config import settings # Importa la configuración de tu app
from dotenv import load_dotenv # Importa load_dotenv

async def test_redis_connection():
    print("Intentando conectar a Redis con la configuración de la aplicación...")
    client = None # Inicializar client a None
    try:
        # Construye los argumentos de conexión base
        conn_args = {
            "host": settings.REDIS_HOST,
            "port": settings.REDIS_PORT,
            "db": settings.REDIS_DB,
            "decode_responses": True,
            "socket_connect_timeout": 5
        }
        
        # Lógica de autenticación simplificada:
        # Solo añade 'password' y 'username' si la contraseña NO está vacía.
        if settings.REDIS_PASSWORD: # Si la contraseña NO es una cadena vacía
            conn_args["password"] = settings.REDIS_PASSWORD
            if settings.REDIS_USERNAME:
                conn_args["username"] = settings.REDIS_USERNAME
            
        client = redis.Redis(**conn_args) # Pasa los argumentos construidos
        
        await client.ping()
        print("¡Conexión a Redis exitosa desde el script!")

        # --- Agregar y recuperar datos de ejemplo ---
        test_key = "drtc_puno_test_key"
        test_value = "Este es un valor de prueba desde FastAPI DRTC Puno."
        
        print(f"Estableciendo clave '{test_key}' con valor: '{test_value}'")
        await client.set(test_key, test_value, ex=60) # Almacenar por 60 segundos
        print("Clave establecida en Redis.")

        print(f"Recuperando clave '{test_key}' de Redis...")
        retrieved_value = await client.get(test_key)
        print(f"Valor recuperado: '{retrieved_value}'")

        if retrieved_value == test_value:
            print("¡Verificación de datos exitosa! El valor recuperado coincide.")
        else:
            print("¡Error en la verificación de datos! El valor recuperado NO coincide.")
        
        print(f"Eliminando clave de prueba '{test_key}'...")
        await client.delete(test_key) # Limpia la clave de prueba
        print("Clave de prueba eliminada.")
        # --- Fin de agregar y recuperar datos de ejemplo ---

    except Exception as e:
        print(f"Error al conectar a Redis desde el script: {e}")
    finally:
        if client:
            await client.aclose()
            print("Conexión de Redis cerrada desde el script.")

if __name__ == "__main__":
    load_dotenv() # Carga las variables del .env
    asyncio.run(test_redis_connection())
    