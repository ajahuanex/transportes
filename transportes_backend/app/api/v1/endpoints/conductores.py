# app/api/v1/endpoints/conductores.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.conductor_schema import ConductorCreate, ConductorUpdate, ConductorInDB
from app.crud.conductor_crud import crud_conductor
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=ConductorInDB, status_code=status.HTTP_201_CREATED)
async def create_conductor(
    conductor_in: ConductorCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea un nuevo conductor.
    """
    existing_conductor = await crud_conductor.get_by_dni(conductor_in.dni)
    if existing_conductor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El DNI del conductor ya existe."
        )
    conductor = await crud_conductor.create(conductor_in, created_by_user_id=current_user_id)
    return conductor

@router.get("/{conductor_id}", response_model=ConductorInDB)
async def get_conductor_by_id(
    conductor_id: PydanticObjectId,
):
    """
    Obtiene un conductor por su ID.
    """
    conductor = await crud_conductor.get_active(conductor_id)
    if not conductor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conductor no encontrado o eliminado lógicamente."
        )
    return conductor

@router.get("/", response_model=List[ConductorInDB])
async def get_all_active_conductores(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los conductores activos.
    """
    conductores = await crud_conductor.get_multi_active(skip=skip, limit=limit)
    return conductores

@router.put("/{conductor_id}", response_model=ConductorInDB)
async def update_conductor(
    conductor_id: PydanticObjectId,
    conductor_in: ConductorUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza un conductor existente.
    """
    conductor_db = await crud_conductor.get(conductor_id)
    if not conductor_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conductor no encontrado."
        )
    conductor = await crud_conductor.update(conductor_db, conductor_in, updated_by_user_id=current_user_id)
    return conductor

@router.delete("/{conductor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_conductor(
    conductor_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de un conductor.
    """
    conductor_db = await crud_conductor.get_active(conductor_id)
    if not conductor_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conductor no encontrado o ya eliminado."
        )
    await crud_conductor.soft_delete(conductor_db, deleted_by_user_id=current_user_id)
    return {"message": "Conductor eliminado lógicamente."}

@router.post("/{conductor_id}/restore", response_model=ConductorInDB)
async def restore_conductor(
    conductor_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura un conductor que fue soft-deleted.
    """
    conductor_db = await crud_conductor.get(conductor_id)
    if not conductor_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conductor no encontrado."
        )
    if conductor_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El conductor ya está activo."
        )
    conductor = await crud_conductor.restore(conductor_db, restored_by_user_id=current_user_id)
    return conductor
