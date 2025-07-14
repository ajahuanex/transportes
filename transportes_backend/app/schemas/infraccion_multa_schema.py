# app/schemas/infraccion_multa_schema.py
from typing import Optional
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class InfraccionMultaBase(BaseModel):
    numero_infraccion: str
    fecha_infraccion: Optional[datetime] = None
    tipo_infraccion: str
    codigo_infraccion: str
    descripcion_infraccion: str
    monto_multa: float
    moneda: str = "PEN"
    empresa_responsable_id: PydanticObjectId
    ruc_empresa_responsable: str
    vehiculo_involucrado_id: Optional[PydanticObjectId] = None
    placa_vehiculo_involucrado: Optional[str] = None
    conductor_involucrado_id: Optional[PydanticObjectId] = None
    dni_conductor_involucrado: Optional[str] = None
    autoridad_emisora: str
    estado_multa: str = "PENDIENTE"
    fecha_notificacion: Optional[datetime] = None
    fecha_pago: Optional[datetime] = None
    monto_pagado: Optional[float] = None
    observaciones_multa: Optional[str] = None
    origen_dato: str = "PRODUCCION"

class InfraccionMultaCreate(InfraccionMultaBase):
    pass

class InfraccionMultaUpdate(InfraccionMultaBase):
    numero_infraccion: Optional[str] = None
    fecha_infraccion: Optional[datetime] = None
    tipo_infraccion: Optional[str] = None
    codigo_infraccion: Optional[str] = None
    descripcion_infraccion: Optional[str] = None
    monto_multa: Optional[float] = None
    moneda: Optional[str] = None
    empresa_responsable_id: Optional[PydanticObjectId] = None
    ruc_empresa_responsable: Optional[str] = None
    vehiculo_involucrado_id: Optional[PydanticObjectId] = None
    placa_vehiculo_involucrado: Optional[str] = None
    conductor_involucrado_id: Optional[PydanticObjectId] = None
    dni_conductor_involucrado: Optional[str] = None
    autoridad_emisora: Optional[str] = None
    estado_multa: Optional[str] = None
    fecha_notificacion: Optional[datetime] = None
    fecha_pago: Optional[datetime] = None
    monto_pagado: Optional[float] = None
    observaciones_multa: Optional[str] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class InfraccionMultaInDB(InfraccionMultaBase):
    id: PydanticObjectId = Field(alias="_id")
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str
    origen_dato: str

    class Config:
        from_attributes = True
        populate_by_name = True
