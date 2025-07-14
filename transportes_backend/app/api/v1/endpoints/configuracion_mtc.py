# app/api/v1/endpoints/configuracion_mtc.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.configuracion_mtc_schema import ConfiguracionMTCCreate, ConfiguracionMTCUpdate, ConfiguracionMTCInDB
from app.crud.configuracion_mtc_crud import crud_configuracion_mtc
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=ConfiguracionMTCInDB, status_code=status.HTTP_201_CREATED)
async def create_or_update_configuracion(
    config_in: ConfiguracionMTCCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea o actualiza la configuración general del MTC/DRTC (ej. reglas de permanencia).
    Solo debe haber un documento de configuración con ID 'permanencia_vehiculos'.
    """
    config = await crud_configuracion_mtc.create_or_update_config(config_in, updated_by_user_id=current_user_id)
    return config

@router.get("/", response_model=ConfiguracionMTCInDB)
async def get_configuracion():
    """
    Obtiene la configuración general del MTC/DRTC.
    """
    config = await crud_configuracion_mtc.get_config()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuración no encontrada. Por favor, cree una primero."
        )
    return config

@router.put("/", response_model=ConfiguracionMTCInDB)
async def update_configuracion(
    config_in: ConfiguracionMTCUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza la configuración general del MTC/DRTC.
    """
    config_db = await crud_configuracion_mtc.get_config()
    if not config_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuración no encontrada. Por favor, cree una primero."
        )
    config = await crud_configuracion_mtc.create_or_update_config(config_in, updated_by_user_id=current_user_id)
    return config

# Nota: No hay soft delete para la configuración, solo se actualiza.
