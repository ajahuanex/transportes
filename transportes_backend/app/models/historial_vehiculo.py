# app/models/historial_vehiculo.py
from datetime import datetime, timezone, timedelta
from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class DetalleAccidente(BaseModel):
    """Detalle específico para eventos de tipo ACCIDENTE."""
    tipo_accidente: str
    fecha_accidente: datetime
    ruta_accidente_id: Optional[PydanticObjectId] = None
    codigo_ruta_accidente: Optional[str] = None # Desnormalizado para contexto
    descripcion_detallada: Optional[str] = None
    informe_policial_url: Optional[str] = None
    afecta_operatividad: bool = False # Indica si el accidente dejó inoperativo al vehículo

class HistorialVehiculo(Document):
    """
    Modelo para la colección de historial de eventos de vehículos (incluyendo accidentes).
    """
    vehiculo_id: PydanticObjectId = Field(index=True) # Índice en vehiculo_id
    placa_vehiculo: str # Desnormalizado para contexto
    tipo_evento: str = Field(index=True) # Ej: MODIFICACION_CARACTERISTICA, ACCIDENTE, BAJA_TEMPORAL, ALTA_TEMPORAL, CAMBIO_DE_PROPIETARIO, INSPECCION_TECNICA, VENCIMIENTO_TUC, EMISION_TUC, CAMBIO_ESTADO
    fecha_evento: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ), index=True)
    resolucion_id: Optional[PydanticObjectId] = None # Opcional, si el evento está ligado a una resolución
    
    # Campos para tipo_evento: MODIFICACION_CARACTERISTICA
    campo_modificado: Optional[str] = None
    valor_anterior: Optional[str] = None # O usar Any para flexibilidad
    valor_nuevo: Optional[str] = None # O usar Any para flexibilidad

    # Campos para tipo_evento: ACCIDENTE
    detalle_accidente: Optional[DetalleAccidente] = None

    observaciones: Optional[str] = None # Observaciones generales del evento
    usuario_id: Optional[PydanticObjectId] = Field(index=True) # Usuario que registró el evento
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "historial_vehiculos"
        indexes = [
            "vehiculo_id",
            "tipo_evento",
            "fecha_evento",
            "usuario_id",
            "origen_dato",
        ]
