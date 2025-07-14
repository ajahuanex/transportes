# app/schemas/empresa_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class DomicilioSchema(BaseModel):
    calle: Optional[str] = None
    distrito: Optional[str] = None
    provincia: Optional[str] = None
    departamento: Optional[str] = None
    codigo_postal: Optional[str] = None

class RepresentanteLegalSchema(BaseModel):
    dni: Optional[str] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None

class InfoSunatSchema(BaseModel):
    razon_social_sunat: Optional[str] = None
    tipo_contribuyente: Optional[str] = None
    fecha_inscripcion_sunat: Optional[datetime] = None
    estado_contribuyente_sunat: Optional[str] = None
    condicion_contribuyente_sunat: Optional[str] = None
    domicilio_fiscal_sunat: Optional[DomicilioSchema] = None
    sistema_emision_comprobante: Optional[str] = None
    sistema_contabilidad: Optional[str] = None
    actividades_economicas: List[str] = []
    comprobantes_pago_impresion: List[str] = []
    sistema_emision_electronica: Optional[str] = None
    emisor_electronico_desde: Optional[datetime] = None
    comprobantes_electronicos: List[str] = []
    afiliado_ple_desde: Optional[datetime] = None
    padrones: List[str] = []
    fecha_actualizacion_sunat: Optional[datetime] = None

class EmpresaBase(BaseModel):
    ruc: str
    razon_social: str
    nombre_comercial: Optional[str] = None
    domicilio_legal: Optional[DomicilioSchema] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    representante_legal: Optional[RepresentanteLegalSchema] = None
    partida_registral: Optional[str] = None
    estado_habilitacion_mtc: str = "Habilitado"
    info_sunat: Optional[InfoSunatSchema] = None
    origen_dato: str = "PRODUCCION"

class EmpresaCreate(EmpresaBase):
    pass

class EmpresaUpdate(EmpresaBase):
    ruc: Optional[str] = None
    razon_social: Optional[str] = None
    nombre_comercial: Optional[str] = None
    domicilio_legal: Optional[DomicilioSchema] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    representante_legal: Optional[RepresentanteLegalSchema] = None
    partida_registral: Optional[str] = None
    estado_habilitacion_mtc: Optional[str] = None
    info_sunat: Optional[InfoSunatSchema] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class EmpresaInDB(EmpresaBase):
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
