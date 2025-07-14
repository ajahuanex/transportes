# app/models/papeleta.py
from datetime import datetime, timezone, timedelta
from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field

LIMA_TZ = timezone(timedelta(hours=-5))

class Papeleta(Document):
    """
    Modelo para la colección de papeletas de infracción de tránsito.
    """
    numero_papeleta: str = Field(index=True, unique=True)
    fecha_infraccion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ), index=True)
    tipo_infraccion: str = Field(index=True)  # Leve, Grave, Muy Grave
    codigo_infraccion: str = Field(index=True)  # Código del reglamento (ej. "L.1", "G.2", "MG.1")
    descripcion_infraccion: str
    monto_multa: float
    moneda: str = "PEN"

    empresa_responsable_id: PydanticObjectId = Field(index=True)
    ruc_empresa_responsable: str  # Desnormalizado
    vehiculo_involucrado_id: Optional[PydanticObjectId] = Field(default=None, index=True)
    placa_vehiculo_involucrado: Optional[str] = None  # Desnormalizado
    conductor_involucrado_id: Optional[PydanticObjectId] = Field(default=None, index=True)
    dni_conductor_involucrado: Optional[str] = None  # Desnormalizado

    autoridad_emisora: str  # SUTRAN, Policía Nacional, MTC, DRTC Puno
    estado_multa: str = Field(default="PENDIENTE", index=True)  # PENDIENTE, PAGADA, IMPUGNADA, ANULADA, FRACCIONADA
    fecha_notificacion: Optional[datetime] = None
    fecha_pago: Optional[datetime] = None
    monto_pagado: Optional[float] = None
    observaciones_multa: Optional[str] = None

    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True)  # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "papeletas"
        indexes = [
            "numero_papeleta",
            "fecha_infraccion",
            "tipo_infraccion",
            "codigo_infraccion",
            "empresa_responsable_id",
            "vehiculo_involucrado_id",
            "conductor_involucrado_id",
            "estado_multa",
            "estado_logico",
            "origen_dato",
        ]
