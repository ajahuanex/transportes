# app/models/usuario.py
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field, BaseModel

# Helper para la zona horaria de Lima (-05:00)
LIMA_TZ = timezone(timedelta(hours=-5))

class LicenciaConducir(BaseModel):
    """Modelo para la licencia de conducir de un usuario."""
    numero: Optional[str] = None
    clase_categoria: Optional[str] = None
    fecha_emision: Optional[datetime] = None
    fecha_vencimiento: Optional[datetime] = None
    puntos: Optional[int] = None

class Usuario(Document):
    """
    Modelo para la colección de usuarios del sistema.
    """
    # Usar Field(index=True, unique=True) en lugar de Indexed()
    username: str = Field(index=True, unique=True)
    password_hash: str # Almacenar contraseñas hasheadas
    nombres: str
    apellidos: str
    dni: str
    email: str
    roles: List[str] = [] # Ej: ["admin", "analista_tecnico", "mesa_partes"]
    licencia_conducir: Optional[LicenciaConducir] = None # Ejemplo si un usuario también es conductor
    
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    creado_por_usuario_id: Optional[PydanticObjectId] = None # Para auditoría interna si un admin crea usuarios
    fecha_ultima_modificacion: datetime = Field(default_factory=lambda: datetime.now(LIMA_TZ))
    ultima_modificacion_por_usuario_id: Optional[PydanticObjectId] = None
    estado_logico: str = Field(default="ACTIVO", index=True) # ACTIVO, ELIMINADO (para soft delete)
    origen_dato: str = Field(default="PRODUCCION", index=True) # PRODUCCION, SEED_DATA

    class Settings:
        name = "usuarios" # Nombre de la colección en MongoDB
        # Índices adicionales para búsquedas comunes
        indexes = [
            "email", # Se creará un índice en el campo 'email'
            "dni",   # Se creará un índice en el campo 'dni'
            "estado_logico",
            "origen_dato",
        ]
