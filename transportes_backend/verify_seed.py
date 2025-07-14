import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings
from app.models.usuario import Usuario
from app.models.empresa import Empresa
from app.models.vehiculo import Vehiculo
from app.models.conductor import Conductor
from app.models.ruta import Ruta
from app.models.expediente import Expediente
from app.models.resolucion import Resolucion
from app.models.tuc import TUC
from app.models.infraccion_multa import InfraccionMulta
from app.models.papeleta import Papeleta
from app.models.terminal_terrestre import TerminalTerrestre
from app.models.configuracion_mtc import ConfiguracionMTC

async def verify_data():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    await init_beanie(database=client[settings.MONGO_DB_NAME], document_models=[
        Usuario, Empresa, Vehiculo, Conductor, Ruta, Expediente, Resolucion, TUC,
        InfraccionMulta, Papeleta, TerminalTerrestre, ConfiguracionMTC
    ])

    print("\n--- Verificando conteo de documentos ---")
    print(f"Usuarios: {await Usuario.count()}")
    print(f"Empresas: {await Empresa.count()}")
    print(f"Vehiculos: {await Vehiculo.count()}")
    print(f"Conductores: {await Conductor.count()}")
    print(f"Rutas: {await Ruta.count()}")
    print(f"Expedientes: {await Expediente.count()}")
    print(f"Resoluciones: {await Resolucion.count()}")
    print(f"TUCs: {await TUC.count()}")
    print(f"Infracciones y Multas: {await InfraccionMulta.count()}")
    print(f"Papeletas: {await Papeleta.count()}")
    print(f"Terminales Terrestres: {await TerminalTerrestre.count()}")
    print(f"Configuracion MTC: {await ConfiguracionMTC.count()}")
    print("--------------------------------------")

if __name__ == "__main__":
    asyncio.run(verify_data())
