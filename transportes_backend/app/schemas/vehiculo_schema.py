# app/schemas/vehiculo_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class VehiculoBase(BaseModel):
    placa: str
    empresa_id: PydanticObjectId
    resoluciones_asociadas: List[PydanticObjectId] = []
    resolucion_primigenia_id: Optional[PydanticObjectId] = None
    tucs_asociadas: List[PydanticObjectId] = []
    rutas_autorizadas: List[PydanticObjectId] = []
    tipo_servicio_principal: str
    estado_vehiculo_mtc: str = "Operativo"
    documento_baja_url: Optional[str] = None
    partida_registral_vehicular: Optional[str] = None
    marca: str
    modelo: str
    anio_fabricacion: int
    color: Optional[str] = None
    categoria: str
    carroceria: Optional[str] = None
    clase: Optional[str] = None
    combustible: Optional[str] = None
    numero_motor: Optional[str] = None
    numero_serie_chasis: Optional[str] = None
    num_asientos: Optional[int] = None
    capacidad_pasajeros: Optional[int] = None
    cilindros: Optional[int] = None
    ejes: Optional[int] = None
    ruedas: Optional[int] = None
    peso_bruto_vehicular: Optional[float] = None
    peso_neto: Optional[float] = None
    carga_util: Optional[float] = None
    largo: Optional[float] = None
    ancho: Optional[float] = None
    alto: Optional[float] = None
    observaciones: Optional[str] = None
    fecha_ultima_revision_tecnica: Optional[datetime] = None
    fecha_vencimiento_revision_tecnica: Optional[datetime] = None
    estado_logico: str = "ACTIVO"
    origen_dato: str = "PRODUCCION"

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoUpdate(BaseModel):
    placa: Optional[str] = None
    empresa_id: Optional[PydanticObjectId] = None
    resoluciones_asociadas: Optional[List[PydanticObjectId]] = None
    resolucion_primigenia_id: Optional[PydanticObjectId] = None
    tucs_asociadas: Optional[List[PydanticObjectId]] = None
    rutas_autorizadas: Optional[List[PydanticObjectId]] = None
    tipo_servicio_principal: Optional[str] = None
    estado_vehiculo_mtc: Optional[str] = None
    documento_baja_url: Optional[str] = None
    partida_registral_vehicular: Optional[str] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    anio_fabricacion: Optional[int] = None
    color: Optional[str] = None
    categoria: Optional[str] = None
    carroceria: Optional[str] = None
    clase: Optional[str] = None
    combustible: Optional[str] = None
    numero_motor: Optional[str] = None
    numero_serie_chasis: Optional[str] = None
    num_asientos: Optional[int] = None
    capacidad_pasajeros: Optional[int] = None
    cilindros: Optional[int] = None
    ejes: Optional[int] = None
    ruedas: Optional[int] = None
    peso_bruto_vehicular: Optional[float] = None
    peso_neto: Optional[float] = None
    carga_util: Optional[float] = None
    largo: Optional[float] = None
    ancho: Optional[float] = None
    alto: Optional[float] = None
    observaciones: Optional[str] = None
    fecha_ultima_revision_tecnica: Optional[datetime] = None
    fecha_vencimiento_revision_tecnica: Optional[datetime] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class VehiculoInDB(VehiculoBase):
    id: PydanticObjectId = Field(alias="_id")
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str
    origen_dato: str

class VehiculoInDB(VehiculoBase):
    id: PydanticObjectId = Field(alias="_id")
    fecha_creacion: datetime
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str

    class Config:
        from_attributes = True
        populate_by_name = True
