"""
Configuración del sistema usando Pydantic Settings
"""

from typing import List, Optional
from pydantic import BaseSettings, Field, validator
import os

class Settings(BaseSettings):
    """Configuración principal del sistema"""
    
    # Configuración básica
    APP_NAME: str = "Sistema de Gestión de Transportes - DRTC Puno"
    VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # Servidor
    HOST: str = Field(default="0.0.0.0", env="HOST")
    PORT: int = Field(default=8000, env="PORT")
    
    # CORS
    ALLOWED_HOSTS: List[str] = Field(
        default=["http://localhost:4200", "http://localhost:3000"],
        env="ALLOWED_HOSTS"
    )
    
    # Base de datos MongoDB
    MONGODB_URL: str = Field(
        default="mongodb://localhost:27017",
        env="MONGODB_URL"
    )
    MONGODB_DB: str = Field(
        default="drtc_puno",
        env="MONGODB_DB"
    )
    MONGODB_MAX_POOL_SIZE: int = Field(
        default=10,
        env="MONGODB_MAX_POOL_SIZE"
    )
    
    # Redis Cache
    REDIS_URL: str = Field(
        default="redis://localhost:6379",
        env="REDIS_URL"
    )
    REDIS_DB: int = Field(default=0, env="REDIS_DB")
    REDIS_PASSWORD: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    
    # JWT Authentication
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        env="SECRET_KEY"
    )
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        env="ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        env="REFRESH_TOKEN_EXPIRE_DAYS"
    )
    
    # Archivos y Storage
    UPLOAD_DIR: str = Field(
        default="./uploads",
        env="UPLOAD_DIR"
    )
    MAX_FILE_SIZE: int = Field(
        default=10 * 1024 * 1024,  # 10MB
        env="MAX_FILE_SIZE"
    )
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["pdf", "jpg", "jpeg", "png", "doc", "docx"],
        env="ALLOWED_FILE_TYPES"
    )
    
    # AWS S3 (opcional)
    AWS_ACCESS_KEY_ID: Optional[str] = Field(default=None, env="AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(default=None, env="AWS_SECRET_ACCESS_KEY")
    AWS_REGION: Optional[str] = Field(default=None, env="AWS_REGION")
    AWS_S3_BUCKET: Optional[str] = Field(default=None, env="AWS_S3_BUCKET")
    
    # Email
    SMTP_HOST: Optional[str] = Field(default=None, env="SMTP_HOST")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USER: Optional[str] = Field(default=None, env="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    SMTP_TLS: bool = Field(default=True, env="SMTP_TLS")
    
    # Integraciones externas
    RENIEC_API_URL: Optional[str] = Field(default=None, env="RENIEC_API_URL")
    RENIEC_API_KEY: Optional[str] = Field(default=None, env="RENIEC_API_KEY")
    SUNAT_API_URL: Optional[str] = Field(default=None, env="SUNAT_API_URL")
    SUNAT_API_KEY: Optional[str] = Field(default=None, env="SUNAT_API_KEY")
    
    # Configuración específica del sistema
    REGION: str = Field(default="PUNO", env="REGION")
    ENTIDAD: str = Field(default="DRTC_PUNO", env="ENTIDAD")
    
    # Configuración de reportes
    REPORTS_DIR: str = Field(
        default="./reports",
        env="REPORTS_DIR"
    )
    
    # Configuración de notificaciones
    NOTIFICATION_VENCIMIENTO_ANTICIPADO: int = Field(
        default=30,  # días
        env="NOTIFICATION_VENCIMIENTO_ANTICIPADO"
    )
    NOTIFICATION_MAX_RETRY: int = Field(
        default=3,
        env="NOTIFICATION_MAX_RETRY"
    )
    
    # Configuración de logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    LOG_FILE: Optional[str] = Field(default=None, env="LOG_FILE")
    
    # Configuración de seguridad
    PASSWORD_MIN_LENGTH: int = Field(default=8, env="PASSWORD_MIN_LENGTH")
    PASSWORD_REQUIRE_UPPERCASE: bool = Field(default=True, env="PASSWORD_REQUIRE_UPPERCASE")
    PASSWORD_REQUIRE_LOWERCASE: bool = Field(default=True, env="PASSWORD_REQUIRE_LOWERCASE")
    PASSWORD_REQUIRE_DIGITS: bool = Field(default=True, env="PASSWORD_REQUIRE_DIGITS")
    PASSWORD_REQUIRE_SPECIAL: bool = Field(default=True, env="PASSWORD_REQUIRE_SPECIAL")
    
    # Configuración de rate limiting
    RATE_LIMIT_REQUESTS: int = Field(default=100, env="RATE_LIMIT_REQUESTS")
    RATE_LIMIT_WINDOW: int = Field(default=3600, env="RATE_LIMIT_WINDOW")  # segundos
    
    @validator("ALLOWED_HOSTS", pre=True)
    def parse_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    @validator("ALLOWED_FILE_TYPES", pre=True)
    def parse_allowed_file_types(cls, v):
        if isinstance(v, str):
            return [ext.strip() for ext in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# Instancia global de configuración
settings = Settings()

# Validaciones adicionales
def validate_settings():
    """Validar configuración crítica"""
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-secret-key-change-in-production":
        raise ValueError(
            "SECRET_KEY debe ser configurada en producción. "
            "Use una clave segura y única."
        )
    
    # Crear directorios necesarios
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)

# Validar configuración al importar
validate_settings() 