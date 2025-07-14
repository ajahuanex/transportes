# app/models/terminal_terrestre.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class Ubicacion(BaseModel):
    """Modelo para la ubicación geográfica."""
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = Field(index=True) # Índice en ciudad
    departamento: Optional[str] = None

class TerminalTerrestre(Document):
    """
    Modelo para la colección de terminales terrestres.
    """
    nombre: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    ubicacion: Optional[Ubicacion] = None
    tipo_infraestructura_complementaria: List[str] = [] # Ej: Andenes, Boleterías, Sala de Espera
    empresas_usuarios: List[PydanticObjectId] = [] # Referencias a Empresas que usan este terminal
    capacidad_andenes: Optional[int] = None
    administrador: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "terminales_terrestres"
        indexes = [
            "nombre",
            "ubicacion.ciudad",
            "estado_logico",
            "origen_dato",
        ]
