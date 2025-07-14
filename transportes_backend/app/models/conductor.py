# app/models/conductor.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class LicenciaConducirConductor(BaseModel):
    """Modelo para la licencia de conducir del conductor."""
    numero: str = Field(index=True, unique=True) # Índice en número de licencia
    clase_categoria: str
    fecha_emision: datetime
    fecha_vencimiento: datetime = Field(index=True) # Índice en fecha de vencimiento
    puntos: Optional[int] = None # Puntos de la licencia

class EmpresaAsociadaConductor(BaseModel):
    """Modelo para las empresas asociadas a un conductor."""
    empresa_id: PydanticObjectId = Field(index=True) # Índice en empresa_id dentro del array
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    cargo: Optional[str] = None

class Conductor(Document):
    """
    Modelo para la colección de conductores.
    """
    dni: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    nombres: str
    apellidos: str
    licencia_conducir: LicenciaConducirConductor
    fecha_nacimiento: Optional[datetime] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    empresas_asociadas: List[EmpresaAsociadaConductor] = [] # Relación Many-to-Many
    estado_habilitacion_mtc: str = Field(default="Habilitado", index=True) # Habilitado, Suspendido, Inhabilitado
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "conductores"
        indexes = [
            "dni",
            "licencia_conducir.numero",
            "licencia_conducir.fecha_vencimiento",
            "empresas_asociadas.empresa_id",
            "estado_habilitacion_mtc",
            "estado_logico",
            "origen_dato",
        ]
