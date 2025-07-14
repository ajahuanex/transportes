# app/api/v1/endpoints/infracciones_multas.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.infraccion_multa_schema import InfraccionMultaCreate, InfraccionMultaUpdate, InfraccionMultaInDB
from app.crud.infraccion_multa_crud import crud_infraccion_multa
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=InfraccionMultaInDB, status_code=status.HTTP_201_CREATED)
async def create_infraccion_multa(
    infraccion_in: InfraccionMultaCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva infracción o multa.
    """
    existing_infraccion = await crud_infraccion_multa.get_by_numero_infraccion(infraccion_in.numero_infraccion)
    if existing_infraccion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de infracción ya existe."
        )
    infraccion = await crud_infraccion_multa.create(infraccion_in, created_by_user_id=current_user_id)
    return infraccion

@router.get("/{infraccion_id}", response_model=InfraccionMultaInDB)
async def get_infraccion_multa_by_id(
    infraccion_id: PydanticObjectId,
):
    """
    Obtiene una infracción o multa por su ID.
    """
    infraccion = await crud_infraccion_multa.get_active(infraccion_id)
    if not infraccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Infracción/multa no encontrada o eliminada lógicamente."
        )
    return infraccion

@router.get("/", response_model=List[InfraccionMultaInDB])
async def get_all_active_infracciones_multas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las infracciones/multas activas.
    """
    infracciones = await crud_infraccion_multa.get_multi_active(skip=skip, limit=limit)
    return infracciones

@router.put("/{infraccion_id}", response_model=InfraccionMultaInDB)
async def update_infraccion_multa(
    infraccion_id: PydanticObjectId,
    infraccion_in: InfraccionMultaUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una infracción o multa existente.
    """
    infraccion_db = await crud_infraccion_multa.get(infraccion_id)
    if not infraccion_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Infracción/multa no encontrada."
        )
    infraccion = await crud_infraccion_multa.update(infraccion_db, infraccion_in, updated_by_user_id=current_user_id)
    return infraccion

@router.delete("/{infraccion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_infraccion_multa(
    infraccion_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de una infracción o multa.
    """
    infraccion_db = await crud_infraccion_multa.get_active(infraccion_id)
    if not infraccion_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Infracción/multa no encontrada o ya eliminada."
        )
    await crud_infraccion_multa.soft_delete(infraccion_db, deleted_by_user_id=current_user_id)
    return {"message": "Infracción/multa eliminada lógicamente."}

@router.post("/{infraccion_id}/restore", response_model=InfraccionMultaInDB)
async def restore_infraccion_multa(
    infraccion_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura una infracción o multa que fue soft-deleted.
    """
    infraccion_db = await crud_infraccion_multa.get(infraccion_id)
    if not infraccion_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Infracción/multa no encontrada."
        )
    if infraccion_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La infracción/multa ya está activa."
        )
    infraccion = await crud_infraccion_multa.restore(infraccion_db, restored_by_user_id=current_user_id)
    return infraccion
