# app/models/configuracion_mtc.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class ReglaAntiguedadVehiculo(BaseModel):
    """Define una regla de antigüedad para vehículos."""
    tipo_servicio: str
    categoria_vehicular: str # Ej: M3, N2
    edad_maxima_anios: int
    notas: Optional[str] = None

class ConfiguracionMTC(Document):
    """
    Modelo para la colección de configuraciones generales del MTC/DRTC.
    Puede contener reglas como la permanencia de vehículos.
    """
    _id: str = "permanencia_vehiculos" # Usamos un ID fijo para que solo haya un documento de configuración
    reglas_antiguedad: List[ReglaAntiguedadVehiculo] = []
    fecha_ultima_actualizacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    actualizado_por_usuario_id: Optional[PydanticObjectId] = None
    observaciones: Optional[str] = None

    class Settings:
        name = "configuracion_mtc"
        # No se necesitan índices adicionales ya que solo habrá un documento principal
