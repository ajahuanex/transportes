# app/models/resolucion.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class VehiculoAfectado(BaseModel):
    """Modelo para vehículos afectados por una resolución."""
    vehiculo_id: PydanticObjectId
    placa: str # Desnormalizado para contexto
    accion: str # Ej: Adición, Sustitución, Baja, Reasignación

class RutaAfectada(BaseModel):
    """Modelo para rutas afectadas por una resolución."""
    ruta_id: PydanticObjectId
    codigo_ruta: str # Desnormalizado para contexto
    accion: str # Ej: Autorización Nueva, Modificación, Suspensión, Cancelación

class Resolucion(Document):
    """
    Modelo para la colección de resoluciones (documentos legales inmutables).
    """
    numero_resolucion: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    expediente_origen_id: PydanticObjectId # Referencia al Expediente
    resolucion_asociada_anterior_id: Optional[PydanticObjectId] = None # ID de la resolución anterior (ej. si es una renovación)
    resolucion_primigenia_id: Optional[PydanticObjectId] = None # ID de la resolución original (la primera en la cadena)
    tipo_tramite: str = Field(index=True) # INCREMENTO, SUSTITUCION, RENOVACION, AUTORIZACION NUEVA, BAJA, OTROS
    fecha_emision: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ), index=True)
    fecha_inicio_vigencia: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    anios_vigencia: Optional[int] = None # Desnormalizado, si es útil para filtros
    fecha_fin_vigencia: Optional[datetime] = Field(index=True) # Fecha de vencimiento de la resolución

    empresa_afectada_id: PydanticObjectId = Field(index=True) # Referencia a la Empresa principal
    ruc_empresa_afectada: str # Desnormalizado

    vehiculos_afectados: List[VehiculoAfectado] = []
    rutas_afectadas: List[RutaAfectada] = []
    observaciones: Optional[str] = None
    estado_resolucion: str = Field(default="Vigente", index=True) # Vigente, Caducada, Anulada, Revocada

    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    # No `estado_logico` ya que las resoluciones se manejan con su `estado_resolucion`
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "resoluciones"
        indexes = [
            "numero_resolucion",
            "expediente_origen_id",
            "tipo_tramite",
            "fecha_emision",
            "fecha_fin_vigencia",
            "empresa_afectada_id",
            "estado_resolucion",
            "origen_dato",
        ]
