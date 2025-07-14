# app/schemas/expediente_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class DocumentoAdjuntoSchema(BaseModel):
    nombre_documento: str
    url: str
    fecha_carga: Optional[datetime] = None

class InformeTecnicoSchema(BaseModel):
    numero_informe: str
    fecha_emision: Optional[datetime] = None
    autor_usuario_id: PydanticObjectId
    resumen_informe: Optional[str] = None
    documento_url: Optional[str] = None
    estado: str = "Pendiente"

class OpinionLegalSchema(BaseModel):
    numero_opinion: str
    fecha_emision: Optional[datetime] = None
    autor_usuario_id: PydanticObjectId
    resumen_opinion: Optional[str] = None
    documento_url: Optional[str] = None
    estado: str = "Pendiente"

class ObservacionHistorialSchema(BaseModel):
    fecha: Optional[datetime] = None
    descripcion: str
    usuario_responsable_id: Optional[PydanticObjectId] = None

class ExpedienteBase(BaseModel):
    numero_expediente: str
    empresa_solicitante_id: PydanticObjectId
    tipo_tramite: str
    fecha_inicio_tramite: Optional[datetime] = None
    estado_expediente: str = "En Proceso"
    resumen_solicitud: Optional[str] = None
    numero_folios: Optional[int] = None
    documentos_adjuntos: List[DocumentoAdjuntoSchema] = []
    informes_tecnicos: List[InformeTecnicoSchema] = []
    opiniones_legales: List[OpinionLegalSchema] = []
    resoluciones_asociadas: List[PydanticObjectId] = []
    observaciones_historial: List[ObservacionHistorialSchema] = []
    fecha_cierre_expediente: Optional[datetime] = None
    origen_dato: str = "PRODUCCION"

class ExpedienteCreate(ExpedienteBase):
    pass

class ExpedienteUpdate(ExpedienteBase):
    numero_expediente: Optional[str] = None
    empresa_solicitante_id: Optional[PydanticObjectId] = None
    tipo_tramite: Optional[str] = None
    fecha_inicio_tramite: Optional[datetime] = None
    estado_expediente: Optional[str] = None
    resumen_solicitud: Optional[str] = None
    numero_folios: Optional[int] = None
    documentos_adjuntos: Optional[List[DocumentoAdjuntoSchema]] = None
    informes_tecnicos: Optional[List[InformeTecnicoSchema]] = None
    opiniones_legales: Optional[List[OpinionLegalSchema]] = None
    resoluciones_asociadas: Optional[List[PydanticObjectId]] = None
    observaciones_historial: Optional[List[ObservacionHistorialSchema]] = None
    fecha_cierre_expediente: Optional[datetime] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class ExpedienteInDB(ExpedienteBase):
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
