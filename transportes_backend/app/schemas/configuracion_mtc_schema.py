# app/schemas/configuracion_mtc_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class ReglaAntiguedadVehiculoSchema(BaseModel):
    tipo_servicio: str
    categoria_vehicular: str
    edad_maxima_anios: int
    notas: Optional[str] = None

class ConfiguracionMTCBase(BaseModel):
    reglas_antiguedad: List[ReglaAntiguedadVehiculoSchema] = []
    observaciones: Optional[str] = None

class ConfiguracionMTCCreate(ConfiguracionMTCBase):
    pass

class ConfiguracionMTCUpdate(ConfiguracionMTCBase):
    reglas_antiguedad: Optional[List[ReglaAntiguedadVehiculoSchema]] = None
    observaciones: Optional[str] = None

class ConfiguracionMTCInDB(ConfiguracionMTCBase):
    id: str = Field(alias="_id") # El ID es un string fijo "permanencia_vehiculos"
    fecha_ultima_actualizacion: datetime
    actualizado_por_usuario_id: Optional[PydanticObjectId] = None

    class Config:
        from_attributes = True
        populate_by_name = True
