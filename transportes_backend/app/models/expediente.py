# app/models/expediente.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class DocumentoAdjunto(BaseModel):
    """Modelo para documentos adjuntos en el expediente."""
    nombre_documento: str
    url: str
    fecha_carga: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))

class InformeTecnico(BaseModel):
    """Modelo para informes técnicos dentro de un expediente."""
    numero_informe: str
    fecha_emision: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    autor_usuario_id: PydanticObjectId # Referencia al usuario que lo emitió
    resumen_informe: Optional[str] = None
    documento_url: Optional[str] = None
    estado: str = "Pendiente" # Pendiente, Aprobado, Observado

class OpinionLegal(BaseModel):
    """Modelo para opiniones legales dentro de un expediente."""
    numero_opinion: str
    fecha_emision: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    autor_usuario_id: PydanticObjectId # Referencia al usuario que lo emitió
    resumen_opinion: Optional[str] = None
    documento_url: Optional[str] = None
    estado: str = "Pendiente" # Pendiente, Aprobado, Observado

class ObservacionHistorial(BaseModel):
    """Modelo para el historial de observaciones o hitos del trámite."""
    fecha: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    descripcion: str
    usuario_responsable_id: Optional[PydanticObjectId] = None # Referencia al usuario responsable

class Expediente(Document):
    """
    Modelo para la colección de expedientes, el punto de origen de los trámites.
    """
    numero_expediente: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    empresa_solicitante_id: PydanticObjectId # Referencia a la Empresa
    tipo_tramite: str # INCREMENTO, SUSTITUCION, RENOVACION, AUTORIZACION NUEVA, BAJA, OTROS
    fecha_inicio_tramite: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    estado_expediente: str = Field(default="En Proceso", index=True) # En Proceso, Observado, Aprobado, Rechazado, Archivado
    resumen_solicitud: Optional[str] = None
    numero_folios: Optional[int] = None
    documentos_adjuntos: List[DocumentoAdjunto] = []
    informes_tecnicos: List[InformeTecnico] = []
    opiniones_legales: List[OpinionLegal] = []
    resoluciones_asociadas: List[PydanticObjectId] = [] # Referencias a Resoluciones
    observaciones_historial: List[ObservacionHistorial] = []
    fecha_cierre_expediente: Optional[datetime] = None
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "expedientes"
        indexes = [
            "numero_expediente",
            "empresa_solicitante_id",
            "tipo_tramite",
            "fecha_inicio_tramite",
            "estado_expediente",
            "estado_logico",
            "origen_dato",
        ]
