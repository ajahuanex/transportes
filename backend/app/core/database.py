"""
Configuración de base de datos MongoDB y Redis
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import aioredis
from typing import Optional
import structlog

from app.core.config import settings

logger = structlog.get_logger()

# Variables globales para las conexiones
mongodb_client: Optional[AsyncIOMotorClient] = None
mongodb_database: Optional[AsyncIOMotorDatabase] = None
redis_client: Optional[aioredis.Redis] = None

async def init_db():
    """Inicializar conexiones a MongoDB y Redis"""
    global mongodb_client, mongodb_database, redis_client
    
    try:
        # Conectar a MongoDB
        logger.info("Conectando a MongoDB", url=settings.MONGODB_URL)
        mongodb_client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
            serverSelectionTimeoutMS=5000
        )
        
        # Verificar conexión
        await mongodb_client.admin.command('ping')
        mongodb_database = mongodb_client[settings.MONGODB_DB]
        
        logger.info("Conexión a MongoDB establecida", database=settings.MONGODB_DB)
        
        # Conectar a Redis
        logger.info("Conectando a Redis", url=settings.REDIS_URL)
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
            encoding="utf-8",
            decode_responses=True
        )
        
        # Verificar conexión Redis
        await redis_client.ping()
        logger.info("Conexión a Redis establecida")
        
        # Crear índices necesarios
        await create_indexes()
        
    except Exception as e:
        logger.error("Error al conectar a las bases de datos", error=str(e))
        raise

async def close_db():
    """Cerrar conexiones a las bases de datos"""
    global mongodb_client, redis_client
    
    try:
        if mongodb_client:
            mongodb_client.close()
            logger.info("Conexión a MongoDB cerrada")
        
        if redis_client:
            await redis_client.close()
            logger.info("Conexión a Redis cerrada")
            
    except Exception as e:
        logger.error("Error al cerrar conexiones", error=str(e))

async def create_indexes():
    """Crear índices necesarios en MongoDB"""
    try:
        # Índices para empresas
        await mongodb_database.empresas.create_index("ruc", unique=True)
        await mongodb_database.empresas.create_index("estado")
        await mongodb_database.empresas.create_index("tipoEmpresa")
        await mongodb_database.empresas.create_index("fechaRegistro")
        await mongodb_database.empresas.create_index("fechaVencimiento")
        
        # Índices para vehículos
        await mongodb_database.vehiculos.create_index("placa", unique=True)
        await mongodb_database.vehiculos.create_index("empresaId")
        await mongodb_database.vehiculos.create_index("estado")
        await mongodb_database.vehiculos.create_index("tipoVehiculo")
        await mongodb_database.vehiculos.create_index("fechaVencimiento")
        
        # Índices para conductores
        await mongodb_database.conductores.create_index("dni", unique=True)
        await mongodb_database.conductores.create_index("estado")
        await mongodb_database.conductores.create_index("fechaVencimientoLicencia")
        
        # Índices para rutas
        await mongodb_database.rutas.create_index("codigo", unique=True)
        await mongodb_database.rutas.create_index("empresaId")
        await mongodb_database.rutas.create_index("estado")
        await mongodb_database.rutas.create_index("tipoRuta")
        
        # Índices para expedientes
        await mongodb_database.expedientes.create_index("numero", unique=True)
        await mongodb_database.expedientes.create_index("tipo")
        await mongodb_database.expedientes.create_index("estado")
        await mongodb_database.expedientes.create_index("fechaApertura")
        
        # Índices para resoluciones
        await mongodb_database.resoluciones.create_index("numero")
        await mongodb_database.resoluciones.create_index("tipo")
        await mongodb_database.resoluciones.create_index("estado")
        await mongodb_database.resoluciones.create_index("fechaEmision")
        
        # Índices para TUC
        await mongodb_database.tucs.create_index("numero", unique=True)
        await mongodb_database.tucs.create_index("vehiculoId")
        await mongodb_database.tucs.create_index("empresaId")
        await mongodb_database.tucs.create_index("estado")
        await mongodb_database.tucs.create_index("fechaVencimiento")
        
        # Índices para notificaciones
        await mongodb_database.notificaciones.create_index("destinatario.id")
        await mongodb_database.notificaciones.create_index("tipo")
        await mongodb_database.notificaciones.create_index("estado")
        await mongodb_database.notificaciones.create_index("fechaEnvio")
        
        # Índices para usuarios
        await mongodb_database.usuarios.create_index("email", unique=True)
        await mongodb_database.usuarios.create_index("username", unique=True)
        await mongodb_database.usuarios.create_index("estado")
        await mongodb_database.usuarios.create_index("rol")
        
        # Índices para auditoría
        await mongodb_database.auditoria.create_index("entidad")
        await mongodb_database.auditoria.create_index("entidadId")
        await mongodb_database.auditoria.create_index("usuarioId")
        await mongodb_database.auditoria.create_index("fecha")
        
        logger.info("Índices de MongoDB creados exitosamente")
        
    except Exception as e:
        logger.error("Error al crear índices", error=str(e))
        raise

def get_database() -> AsyncIOMotorDatabase:
    """Obtener instancia de la base de datos MongoDB"""
    if not mongodb_database:
        raise RuntimeError("Base de datos no inicializada")
    return mongodb_database

def get_redis() -> aioredis.Redis:
    """Obtener instancia de Redis"""
    if not redis_client:
        raise RuntimeError("Redis no inicializado")
    return redis_client

# Colecciones de la base de datos
def get_collection(collection_name: str):
    """Obtener una colección específica de MongoDB"""
    return get_database()[collection_name]

# Colecciones principales
def empresas_collection():
    return get_collection("empresas")

def vehiculos_collection():
    return get_collection("vehiculos")

def conductores_collection():
    return get_collection("conductores")

def rutas_collection():
    return get_collection("rutas")

def expedientes_collection():
    return get_collection("expedientes")

def resoluciones_collection():
    return get_collection("resoluciones")

def tucs_collection():
    return get_collection("tucs")

def notificaciones_collection():
    return get_collection("notificaciones")

def usuarios_collection():
    return get_collection("usuarios")

def auditoria_collection():
    return get_collection("auditoria")

def documentos_collection():
    return get_collection("documentos") 