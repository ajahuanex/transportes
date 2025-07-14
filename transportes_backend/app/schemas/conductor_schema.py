# app/schemas/conductor_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class LicenciaConducirConductorSchema(BaseModel):
    numero: str
    clase_categoria: str
    fecha_emision: datetime
    fecha_vencimiento: datetime
    puntos: Optional[int] = None

class EmpresaAsociadaConductorSchema(BaseModel):
    empresa_id: PydanticObjectId
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    cargo: Optional[str] = None

class ConductorBase(BaseModel):
    dni: str
    nombres: str
    apellidos: str
    licencia_conducir: LicenciaConducirConductorSchema
    fecha_nacimiento: Optional[datetime] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    empresas_asociadas: List[EmpresaAsociadaConductorSchema] = []
    estado_habilitacion_mtc: str = "Habilitado"
    origen_dato: str = "PRODUCCION"

class ConductorCreate(ConductorBase):
    pass

class ConductorUpdate(ConductorBase):
    dni: Optional[str] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    licencia_conducir: Optional[LicenciaConducirConductorSchema] = None
    fecha_nacimiento: Optional[datetime] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    empresas_asociadas: Optional[List[EmpresaAsociadaConductorSchema]] = None
    estado_habilitacion_mtc: Optional[str] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class ConductorInDB(ConductorBase):
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
