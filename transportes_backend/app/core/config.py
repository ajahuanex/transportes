# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from typing import Optional # <-- Make sure this is imported!

class Settings(BaseSettings):
    """
    Clase para gestionar las configuraciones de la aplicación,
    cargadas desde variables de entorno o el archivo .env.
    """
    PROJECT_NAME: str = "DRTC Puno API"
    API_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    MONGO_URI: str
    MONGO_DB_NAME: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    REDIS_USERNAME: Optional[str] = None # <-- Ensure this line is present
    REDIS_PASSWORD: Optional[str] = None # <-- Ensure this line is present

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(env_file=".env", extra="ignore") # Carga desde .env

settings = Settings()
