# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List, Type
import beanie # Importa beanie para el tipo Hint

from app.core.config import settings

# Importa todos tus modelos de Beanie
from app.models.usuario import Usuario
from app.models.empresa import Empresa
from app.models.expediente import Expediente
from app.models.resolucion import Resolucion
from app.models.ruta import Ruta
from app.models.vehiculo import Vehiculo
from app.models.historial_vehiculo import HistorialVehiculo
from app.models.tuc import TUC
from app.models.conductor import Conductor
from app.models.terminal_terrestre import TerminalTerrestre
from app.models.infraccion_multa import InfraccionMulta
from app.models.papeleta import Papeleta
from app.models.configuracion_mtc import ConfiguracionMTC

# Lista de todos tus documentos de Beanie
document_models: List[Type[beanie.Document]] = [
    Usuario, Empresa, Expediente, Resolucion, Ruta, Vehiculo,
    HistorialVehiculo, TUC, Conductor, TerminalTerrestre, InfraccionMulta, Papeleta,
    ConfiguracionMTC
]

async def initiate_database():
    """
    Inicializa la conexión a MongoDB y Beanie.
    Beanie se encarga de verificar y crear colecciones e índices si no existen.
    """
    client = AsyncIOMotorClient(settings.MONGO_URI)
    
    # El método init_beanie se encarga de crear las colecciones si no existen
    # y de asegurar que los índices definidos en tus modelos se creen o actualicen.
    await init_beanie(database=client[settings.MONGO_DB_NAME], document_models=document_models)
    
    # Opcional: Verificación y logging adicional para depuración
    db = client[settings.MONGO_DB_NAME]
    existing_collections = await db.list_collection_names()
    for model in document_models:
        collection_name = model.Settings.name
        if collection_name not in existing_collections:
            print(f"INFO: La colección '{collection_name}' fue creada por Beanie.")
        else:
            print(f"INFO: Colección '{collection_name}' verificada.")

