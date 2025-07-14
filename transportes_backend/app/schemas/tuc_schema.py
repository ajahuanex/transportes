# app/schemas/tuc_schema.py
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId
from datetime import datetime

class RutaDesignadaTUCSchema(BaseModel):
    ruta_id: PydanticObjectId
    codigo_ruta: str
    origen_ciudad: str
    destino_ciudad: str

class HistorialEstadoTUCSchema(BaseModel):
    estado: str
    fecha: Optional[datetime] = None
    motivo: Optional[str] = None
    usuario_id: Optional[PydanticObjectId] = None

class TUCBase(BaseModel):
    numero_tuc: str
    numero_tuc_primigenia: Optional[str] = None
    tipo_generacion: str = "EMISION_INICIAL"
    empresa_id: PydanticObjectId
    ruc_empresa: str
    razon_social_empresa: str
    nombre_representante_legal: Optional[str] = None
    vehiculo_id: PydanticObjectId
    placa_vehiculo: str
    marca_vehiculo: str
    modelo_vehiculo: str
    anio_fabricacion_vehiculo: int
    color_vehiculo: Optional[str] = None
    categoria_vehiculo: str
    carroceria_vehiculo: Optional[str] = None
    clase_vehiculo: Optional[str] = None
    combustible_vehiculo: Optional[str] = None
    numero_motor_vehiculo: Optional[str] = None
    numero_serie_vin_vehiculo: Optional[str] = None
    num_asientos_vehiculo: Optional[int] = None
    num_pasajeros_vehiculo: Optional[int] = None
    cilindros_vehiculo: Optional[int] = None
    ejes_vehiculo: Optional[int] = None
    ruedas_vehiculo: Optional[int] = None
    peso_bruto_vehiculo: Optional[float] = None
    peso_neto_vehiculo: Optional[float] = None
    carga_util_vehiculo: Optional[float] = None
    largo_vehiculo: Optional[float] = None
    ancho_vehiculo: Optional[float] = None
    alto_vehiculo: Optional[float] = None
    resolucion_origen_id: PydanticObjectId
    numero_resolucion: str
    fecha_resolucion: datetime
    tipo_resolucion: str
    expediente_id: PydanticObjectId
    numero_expediente: str
    rutas_designadas: List[RutaDesignadaTUCSchema] = []
    fecha_emision: Optional[datetime] = None
    fecha_vencimiento: datetime
    estado: str = "HABILITADO"
    motivo_estado: Optional[str] = None
    observaciones_tuc: Optional[str] = None
    historial_estados: List[HistorialEstadoTUCSchema] = []
    origen_dato: str = "PRODUCCION"

class TUCCreate(TUCBase):
    pass

class TUCUpdate(TUCBase):
    numero_tuc: Optional[str] = None
    numero_tuc_primigenia: Optional[str] = None
    tipo_generacion: Optional[str] = None
    empresa_id: Optional[PydanticObjectId] = None
    ruc_empresa: Optional[str] = None
    razon_social_empresa: Optional[str] = None
    nombre_representante_legal: Optional[str] = None
    vehiculo_id: Optional[PydanticObjectId] = None
    placa_vehiculo: Optional[str] = None
    marca_vehiculo: Optional[str] = None
    modelo_vehiculo: Optional[str] = None
    anio_fabricacion_vehiculo: Optional[int] = None
    color_vehiculo: Optional[str] = None
    categoria_vehiculo: Optional[str] = None
    carroceria_vehiculo: Optional[str] = None
    clase_vehiculo: Optional[str] = None
    combustible_vehiculo: Optional[str] = None
    numero_motor_vehiculo: Optional[str] = None
    numero_serie_vin_vehiculo: Optional[str] = None
    num_asientos_vehiculo: Optional[int] = None
    num_pasajeros_vehiculo: Optional[int] = None
    cilindros_vehiculo: Optional[int] = None
    ejes_vehiculo: Optional[int] = None
    ruedas_vehiculo: Optional[int] = None
    peso_bruto_vehiculo: Optional[float] = None
    peso_neto_vehiculo: Optional[float] = None
    carga_util_vehiculo: Optional[float] = None
    largo_vehiculo: Optional[float] = None
    ancho_vehiculo: Optional[float] = None
    alto_vehiculo: Optional[float] = None
    resolucion_origen_id: Optional[PydanticObjectId] = None
    numero_resolucion: Optional[str] = None
    fecha_resolucion: Optional[datetime] = None
    tipo_resolucion: Optional[str] = None
    expediente_id: Optional[PydanticObjectId] = None
    numero_expediente: Optional[str] = None
    rutas_designadas: Optional[List[RutaDesignadaTUCSchema]] = None
    fecha_emision: Optional[datetime] = None
    fecha_vencimiento: Optional[datetime] = None
    estado: Optional[str] = None
    motivo_estado: Optional[str] = None
    observaciones_tuc: Optional[str] = None
    historial_estados: Optional[List[HistorialEstadoTUCSchema]] = None
    estado_logico: Optional[str] = None
    origen_dato: Optional[str] = None

class TUCInDB(TUCBase):
    id: PydanticObjectId = Field(alias="_id")
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_creacion: datetime
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime
    estado_logico: str
    origen_dato: str

    class Config:
        from_attributes = True
        populate_by_name = True
