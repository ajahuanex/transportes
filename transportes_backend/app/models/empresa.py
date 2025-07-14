# app/models/empresa.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class Domicilio(BaseModel):
    """Modelo para la información de domicilio."""
    calle: Optional[str] = None
    distrito: Optional[str] = None
    provincia: Optional[str] = None
    departamento: Optional[str] = None
    codigo_postal: Optional[str] = None

class RepresentanteLegal(BaseModel):
    """Modelo para la información del representante legal."""
    dni: Optional[str] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None

class InfoSunat(BaseModel):
    """Modelo para la información tributaria de SUNAT."""
    razon_social_sunat: Optional[str] = None
    tipo_contribuyente: Optional[str] = None
    fecha_inscripcion_sunat: Optional[datetime] = None
    estado_contribuyente_sunat: Optional[str] = None
    condicion_contribuyente_sunat: Optional[str] = None
    domicilio_fiscal_sunat: Optional[Domicilio] = None
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

class Empresa(Document):
    """
    Modelo para la colección de empresas de transporte.
    """
    ruc: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    razon_social: str
    nombre_comercial: Optional[str] = None
    domicilio_legal: Optional[Domicilio] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    representante_legal: Optional[RepresentanteLegal] = None
    partida_registral: Optional[str] = None
    estado_habilitacion_mtc: str = "Habilitado" # Habilitado, Suspendido, Inhabilitado
    info_sunat: Optional[InfoSunat] = None
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None # Referencia a Usuario
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None # Referencia a Usuario
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "empresas"
        indexes = [
            "ruc",
            "razon_social",
            "representante_legal.dni",
            "estado_habilitacion_mtc",
            "estado_logico",
            "origen_dato",
        ]
