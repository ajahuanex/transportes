# app/schemas/papeleta_schema.py
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from typing import Optional
from datetime import datetime

class PapeletaBase(BaseModel):
    numero_papeleta: str
    fecha_infraccion: datetime
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

class PapeletaCreate(PapeletaBase):
    pass

class PapeletaUpdate(BaseModel):
    numero_papeleta: Optional[str] = None
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
    origen_dato: Optional[str] = None

class PapeletaInDB(PapeletaBase):
    id: PydanticObjectId = Field(..., alias="_id")
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str
    origen_dato: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
