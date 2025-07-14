# app/schemas/terminal_terrestre_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class UbicacionSchema(BaseModel):
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    departamento: Optional[str] = None

class TerminalTerrestreBase(BaseModel):
    nombre: str
    ubicacion: Optional[UbicacionSchema] = None
    tipo_infraestructura_complementaria: List[str] = []
    empresas_usuarios: List[PydanticObjectId] = []
    capacidad_andenes: Optional[int] = None
    administrador: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    origen_dato: str = "PRODUCCION"

class TerminalTerrestreCreate(TerminalTerrestreBase):
    pass

class TerminalTerrestreUpdate(TerminalTerrestreBase):
    nombre: Optional[str] = None
    ubicacion: Optional[UbicacionSchema] = None
    tipo_infraestructura_complementaria: Optional[List[str]] = None
    empresas_usuarios: Optional[List[PydanticObjectId]] = None
    capacidad_andenes: Optional[int] = None
    administrador: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class TerminalTerrestreInDB(TerminalTerrestreBase):
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
