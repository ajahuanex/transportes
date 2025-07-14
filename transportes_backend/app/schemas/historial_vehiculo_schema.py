# app/schemas/historial_vehiculo_schema.py
from typing import Optional
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class DetalleAccidenteSchema(BaseModel): # Hereda de BaseModel
    tipo_accidente: str
    fecha_accidente: datetime
    ruta_accidente_id: Optional[PydanticObjectId] = None
    codigo_ruta_accidente: Optional[str] = None
    descripcion_detallada: Optional[str] = None
    informe_policial_url: Optional[str] = None
    afecta_operatividad: bool = False

class HistorialVehiculoBase(BaseModel): # <-- Hereda de BaseModel
    vehiculo_id: PydanticObjectId
    placa_vehiculo: str
    tipo_evento: str
    fecha_evento: Optional[datetime] = None
    resolucion_id: Optional[PydanticObjectId] = None
    campo_modificado: Optional[str] = None
    valor_anterior: Optional[str] = None
    valor_nuevo: Optional[str] = None
    detalle_accidente: Optional[DetalleAccidenteSchema] = None
    observaciones: Optional[str] = None
    usuario_id: Optional[PydanticObjectId] = None
    origen_dato: str = "PRODUCCION"

class HistorialVehiculoCreate(HistorialVehiculoBase):
    pass

class HistorialVehiculoUpdate(HistorialVehiculoBase):
    vehiculo_id: Optional[PydanticObjectId] = None
    placa_vehiculo: Optional[str] = None
    tipo_evento: Optional[str] = None
    fecha_evento: Optional[datetime] = None
    resolucion_id: Optional[PydanticObjectId] = None
    campo_modificado: Optional[str] = None
    valor_anterior: Optional[str] = None
    valor_nuevo: Optional[str] = None
    detalle_accidente: Optional[DetalleAccidenteSchema] = None
    observaciones: Optional[str] = None
    usuario_id: Optional[PydanticObjectId] = None
    origen_dato: Optional[str] = None

class HistorialVehiculoInDB(HistorialVehiculoBase):
    id: PydanticObjectId = Field(alias="_id")
    origen_dato: str

    class Config:
        from_attributes = True
        populate_by_name = True
