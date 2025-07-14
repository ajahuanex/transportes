# app/schemas/resolucion_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class VehiculoAfectadoSchema(BaseModel):
    vehiculo_id: PydanticObjectId
    placa: str
    accion: str

class RutaAfectadaSchema(BaseModel):
    ruta_id: PydanticObjectId
    codigo_ruta: str
    accion: str

class ResolucionBase(BaseModel):
    numero_resolucion: str
    expediente_origen_id: PydanticObjectId
    resolucion_asociada_anterior_id: Optional[PydanticObjectId] = None
    resolucion_primigenia_id: Optional[PydanticObjectId] = None
    tipo_tramite: str
    fecha_emision: Optional[datetime] = None
    fecha_inicio_vigencia: Optional[datetime] = None
    anios_vigencia: Optional[int] = None
    fecha_fin_vigencia: Optional[datetime] = None
    empresa_afectada_id: PydanticObjectId
    ruc_empresa_afectada: str
    vehiculos_afectados: List[VehiculoAfectadoSchema] = []
    rutas_afectadas: List[RutaAfectadaSchema] = []
    observaciones: Optional[str] = None
    estado_resolucion: str = "Vigente"
    origen_dato: str = "PRODUCCION"

class ResolucionCreate(ResolucionBase):
    pass

class ResolucionUpdate(ResolucionBase):
    numero_resolucion: Optional[str] = None
    expediente_origen_id: Optional[PydanticObjectId] = None
    resolucion_asociada_anterior_id: Optional[PydanticObjectId] = None
    resolucion_primigenia_id: Optional[PydanticObjectId] = None
    tipo_tramite: Optional[str] = None
    fecha_emision: Optional[datetime] = None
    fecha_inicio_vigencia: Optional[datetime] = None
    anios_vigencia: Optional[int] = None
    fecha_fin_vigencia: Optional[datetime] = None
    empresa_afectada_id: Optional[PydanticObjectId] = None
    ruc_empresa_afectada: Optional[str] = None
    vehiculos_afectados: Optional[List[VehiculoAfectadoSchema]] = None
    rutas_afectadas: Optional[List[RutaAfectadaSchema]] = None
    observaciones: Optional[str] = None
    estado_resolucion: Optional[str] = None
    origen_dato: Optional[str] = None

class ResolucionInDB(ResolucionBase):
    id: PydanticObjectId = Field(alias="_id")
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    origen_dato: str

    class Config:
        from_attributes = True
        populate_by_name = True
