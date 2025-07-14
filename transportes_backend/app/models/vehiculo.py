# app/models/vehiculo.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class Vehiculo(Document):
    """
    Modelo para la colección de vehículos.
    """
    placa: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    empresa_id: PydanticObjectId = Field(index=True) # Referencia a la Empresa propietaria/operadora
    
    resoluciones_asociadas: List[PydanticObjectId] = [] # IDs de Resoluciones que lo afectan/habilitan
    resolucion_primigenia_id: Optional[PydanticObjectId] = None # La resolución más antigua que lo afectó
    tucs_asociadas: List[PydanticObjectId] = [] # Array de IDs de TUCs que ha tenido el vehículo (historial)
    rutas_autorizadas: List[PydanticObjectId] = [] # Rutas para las que el vehículo está habilitado
    
    tipo_servicio_principal: str = Field(index=True) # Ej: Transporte de Personas - Nacional, Carga - Regional
    estado_vehiculo_mtc: str = Field(default="Operativo", index=True) # Operativo, De Baja, En Mantenimiento, Suspendido, Inhabilitado por Antigüedad
    documento_baja_url: Optional[str] = None # URL del documento de baja si aplica
    partida_registral_vehicular: Optional[str] = None

    marca: str
    modelo: str
    anio_fabricacion: int = Field(index=True) # Índice en año de fabricación para permanencia
    color: Optional[str] = None
    categoria: str = Field(index=True) # Ej: M1, M2, M3, N1, N2, N3
    carroceria: Optional[str] = None # Ej: Ómnibus, Camión, Pick-up
    clase: Optional[str] = None # Ej: Ómnibus M3, Camioneta Pick-up
    combustible: Optional[str] = None
    numero_motor: Optional[str] = None
    numero_serie_chasis: Optional[str] = Field(default=None, index=True, unique=True) # VIN
    num_asientos: Optional[int] = None
    capacidad_pasajeros: Optional[int] = None # Puede ser igual a num_asientos o diferente para carga/mixto
    cilindros: Optional[int] = None
    ejes: Optional[int] = None
    ruedas: Optional[int] = None
    peso_bruto_vehicular: Optional[float] = None # En kg
    peso_neto: Optional[float] = None # En kg
    carga_util: Optional[float] = None # En kg
    largo: Optional[float] = None # En metros
    ancho: Optional[float] = None # En metros
    alto: Optional[float] = None # En metros

    observaciones: Optional[str] = None
    fecha_ultima_revision_tecnica: Optional[datetime] = None
    fecha_vencimiento_revision_tecnica: Optional[datetime] = None

    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "vehiculos"
        indexes = [
            "placa",
            "empresa_id",
            "tipo_servicio_principal",
            "estado_vehiculo_mtc",
            "anio_fabricacion",
            "categoria",
            "numero_serie_chasis",
            "estado_logico",
            "origen_dato",
        ]
