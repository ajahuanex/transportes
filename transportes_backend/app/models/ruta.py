# app/models/ruta.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

LIMA_TZ = timezone(timedelta(hours=-5))

class PuntoRuta(BaseModel):
    """Modelo para puntos de origen/destino/intermedios de una ruta."""
    ciudad: str = Field(index=True) # Índice en ciudad para búsquedas por origen/destino
    departamento: str
    terminal_id: Optional[PydanticObjectId] = None # Referencia a TerminalTerrestre

class FrecuenciaRuta(BaseModel):
    """Modelo para las frecuencias de una ruta."""
    dia_semana: str # Ej: Lunes, Diario, Fines de Semana
    hora_salida: str # Formato HH:MM
    hora_llegada_estimada: Optional[str] = None # Formato HH:MM

class Ruta(Document):
    """
    Modelo para la colección de rutas autorizadas.
    """
    codigo_ruta: str = Field(index=True, unique=True) # Usar Field(index=True, unique=True)
    origen: PuntoRuta
    destino: PuntoRuta
    puntos_intermedios: List[str] = [] # Nombres de ciudades o puntos clave
    distancia_km: Optional[float] = None
    tiempo_estimado_horas: Optional[float] = None
    frecuencias: List[FrecuenciaRuta] = []
    tipo_servicio: str = Field(index=True) # Ej: Regular, Expreso, Especial, Turístico
    
    empresa_autorizada_id: PydanticObjectId = Field(index=True) # Referencia a la Empresa
    ruc_empresa_autorizada: str # Desnormalizado
    resolucion_autorizacion_id: PydanticObjectId = Field(index=True) # Referencia a la Resolución que la autoriza
    numero_resolucion_autorizacion: str # Desnormalizado
    
    estado_ruta_mtc: str = Field(default="Autorizada", index=True) # Autorizada, Suspendida, Cancelada
    observaciones: Optional[str] = None
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "rutas"
        indexes = [
            "codigo_ruta",
            "origen.ciudad",
            "destino.ciudad",
            "tipo_servicio",
            "empresa_autorizada_id",
            "resolucion_autorizacion_id",
            "estado_ruta_mtc",
            "estado_logico",
            "origen_dato",
        ]
