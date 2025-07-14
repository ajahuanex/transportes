# app/models/tuc.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class RutaDesignadaTUC(BaseModel):
    """Modelo para las rutas designadas en la TUC (desnormalizado)."""
    ruta_id: PydanticObjectId
    codigo_ruta: str
    origen_ciudad: str
    destino_ciudad: str

class HistorialEstadoTUC(BaseModel):
    """Modelo para el historial de estados de la TUC."""
    estado: str # HABILITADO, BAJA, SUSPENDIDO
    fecha: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    motivo: Optional[str] = None
    usuario_id: Optional[PydanticObjectId] = None # Usuario que cambió el estado

class TUC(Document):
    """
    Modelo para la colección de Tarjetas Únicas de Circulación (TUCs).
    Documento inmutable y autosuficiente.
    """
    numero_tuc: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    numero_tuc_primigenia: Optional[str] = None # Número de la primera TUC para este vehículo
    tipo_generacion: str = "EMISION_INICIAL" # EMISION_INICIAL, RENOVACION, SUSTITUCION, RECTIFICACION

    # --- Información de la Empresa (Desnormalizada/Referencia) ---
    empresa_id: PydanticObjectId = Field(index=True)
    ruc_empresa: str # Desnormalizado
    razon_social_empresa: str # Desnormalizado
    nombre_representante_legal: Optional[str] = None # Desnormalizado

    # --- Información del Vehículo (Desnormalizada/Referencia) ---
    vehiculo_id: PydanticObjectId = Field(index=True)
    placa_vehiculo: str # Desnormalizado
    marca_vehiculo: str # Desnormalizado
    modelo_vehiculo: str # Desnormalizado
    anio_fabricacion_vehiculo: int # Desnormalizado
    color_vehiculo: Optional[str] = None # Desnormalizado
    categoria_vehiculo: str # Desnormalizado
    carroceria_vehiculo: Optional[str] = None # Desnormalizado
    clase_vehiculo: Optional[str] = None # Desnormalizado
    combustible_vehiculo: Optional[str] = None # Desnormalizado
    numero_motor_vehiculo: Optional[str] = None # Desnormalizado
    numero_serie_vin_vehiculo: Optional[str] = None # Desnormalizado
    num_asientos_vehiculo: Optional[int] = None # Desnormalizado
    num_pasajeros_vehiculo: Optional[int] = None # Desnormalizado
    cilindros_vehiculo: Optional[int] = None # Desnormalizado
    ejes_vehiculo: Optional[int] = None # Desnormalizado
    ruedas_vehiculo: Optional[int] = None # Desnormalizado
    peso_bruto_vehiculo: Optional[float] = None # Desnormalizado
    peso_neto_vehiculo: Optional[float] = None # Desnormalizado
    carga_util_vehiculo: Optional[float] = None # Desnormalizado
    largo_vehiculo: Optional[float] = None # Desnormalizado
    ancho_vehiculo: Optional[float] = None # Desnormalizado
    alto_vehiculo: Optional[float] = None # Desnormalizado

    # --- Información de la Resolución y Expediente (Desnormalizada/Referencia) ---
    resolucion_origen_id: PydanticObjectId = Field(index=True)
    numero_resolucion: str # Desnormalizado
    fecha_resolucion: datetime # Desnormalizado
    tipo_resolucion: str # Desnormalizado (equivalente a tipo_tramite de resolución)
    expediente_id: PydanticObjectId = Field(index=True) # Referencia al expediente
    numero_expediente: str # Desnormalizado

    # --- Rutas Designadas (Desnormalizadas) ---
    rutas_designadas: List[RutaDesignadaTUC] = []

    # --- Datos de la TUC ---
    fecha_emision: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    fecha_vencimiento: datetime = Field(index=True) # Derivada de la resolución
    estado: str = Field(default="HABILITADO", index=True) # HABILITADO, BAJA, SUSPENDIDO
    motivo_estado: Optional[str] = None
    observaciones_tuc: Optional[str] = None
    historial_estados: List[HistorialEstadoTUC] = []

    # --- Auditoría de la TUC ---
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO (para errores de registro)
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "tucs"
        indexes = [
            "numero_tuc",
            "placa_vehiculo",
            "empresa_id",
            "vehiculo_id",
            "resolucion_origen_id",
            "expediente_id",
            "fecha_vencimiento",
            "estado",
            "estado_logico",
            "origen_dato",
        ]
