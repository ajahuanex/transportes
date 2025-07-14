# app/schemas/usuario_schema.py
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from beanie import PydanticObjectId
from datetime import datetime

class LicenciaConducirSchema(BaseModel):
    numero: Optional[str] = None
    clase_categoria: Optional[str] = None
    fecha_emision: Optional[datetime] = None
    fecha_vencimiento: Optional[datetime] = None
    puntos: Optional[int] = None

class UsuarioBase(BaseModel):
    username: str
    nombres: str
    apellidos: str
    dni: str
    email: EmailStr
    roles: List[str] = []
    licencia_conducir: Optional[LicenciaConducirSchema] = None
    origen_dato: str = "PRODUCCION"

class UsuarioCreate(UsuarioBase):
    password: str # Contraseña en texto plano para la creación

class UsuarioUpdate(UsuarioBase):
    username: Optional[str] = None
    password: Optional[str] = None # Para actualizar contraseña
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    dni: Optional[str] = None
    email: Optional[EmailStr] = None
    roles: Optional[List[str]] = None
    licencia_conducir: Optional[LicenciaConducirSchema] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class UsuarioInDB(UsuarioBase):
    id: str = Field(alias="_id") # Mapea _id de MongoDB a 'id'
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

    class Config:
        from_attributes = True # Permite que Pydantic cree el modelo a partir de atributos de un ORM/ODM
        populate_by_name = True # Permite mapear campos por nombre (ej. _id a id)
