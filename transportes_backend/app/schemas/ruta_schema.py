from typing import Optional, List
from pydantic import BaseModel, Field, validator
from beanie import PydanticObjectId
from datetime import datetime

class PuntoRutaSchema(BaseModel):
    ciudad: str
    departamento: str
    terminal_id: Optional[str] = None # Cambiado a str

    @validator('terminal_id', pre=True, always=True)
    def convert_terminal_id_to_str(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

class FrecuenciaRutaSchema(BaseModel):
    dia_semana: str
    hora_salida: str
    hora_llegada_estimada: Optional[str] = None

class RutaBase(BaseModel):
    codigo_ruta: str
    origen: PuntoRutaSchema
    destino: PuntoRutaSchema
    puntos_intermedios: List[str] = []
    distancia_km: Optional[float] = None
    tiempo_estimado_horas: Optional[float] = None
    frecuencias: List[FrecuenciaRutaSchema] = []
    tipo_servicio: str
    empresa_autorizada_id: str # Cambiado a str
    ruc_empresa_autorizada: str
    resolucion_autorizacion_id: Optional[str] = None # Cambiado a Optional[str]
    numero_resolucion_autorizacion: str
    estado_ruta_mtc: str = "Autorizada"
    observaciones: Optional[str] = None
    origen_dato: str = "PRODUCCION"

class RutaCreate(RutaBase):
    pass

class RutaUpdate(RutaBase):
    codigo_ruta: Optional[str] = None
    origen: Optional[PuntoRutaSchema] = None
    destino: Optional[PuntoRutaSchema] = None
    puntos_intermedios: Optional[List[str]] = None
    distancia_km: Optional[float] = None
    tiempo_estimado_horas: Optional[float] = None
    frecuencias: Optional[List[FrecuenciaRutaSchema]] = None
    tipo_servicio: Optional[str] = None
    empresa_autorizada_id: Optional[str] = None # Cambiado a Optional[str]
    ruc_empresa_autorizada: Optional[str] = None
    resolucion_autorizacion_id: Optional[str] = None # Cambiado a Optional[str]
    numero_resolucion_autorizacion: Optional[str] = None
    estado_ruta_mtc: Optional[str] = None
    observaciones: Optional[str] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class RutaInDB(RutaBase):
    id: str = Field(alias="_id") # Cambiado a str
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str
    origen_dato: str

    @validator('id', pre=True, always=True)
    def convert_objectid_to_str(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

    @validator('creado_por_usuario_id', pre=True, always=True)
    def convert_creado_por_usuario_id_to_str(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

    @validator('ultima_modificacion_por_usuario_id', pre=True, always=True)
    def convert_ultima_modificacion_por_usuario_id_to_str(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

    @validator('empresa_autorizada_id', pre=True, always=True)
    def convert_empresa_autorizada_id(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

    @validator('resolucion_autorizacion_id', pre=True, always=True)
    def convert_resolucion_autorizacion_id(cls, v):
        if isinstance(v, PydanticObjectId):
            return str(v)
        return v

    class Config:
        from_attributes = True
        populate_by_name = True