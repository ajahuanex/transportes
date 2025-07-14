# app/api/v1/endpoints/tucs.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.tuc_schema import TUCCreate, TUCUpdate, TUCInDB
from app.crud.tuc_crud import crud_tuc
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=TUCInDB, status_code=status.HTTP_201_CREATED)
async def create_tuc(
    tuc_in: TUCCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva TUC.
    """
    existing_tuc = await crud_tuc.get_by_numero_tuc(tuc_in.numero_tuc)
    if existing_tuc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de TUC ya existe."
        )
    tuc = await crud_tuc.create(tuc_in, created_by_user_id=current_user_id)
    return tuc

@router.get("/{tuc_id}", response_model=TUCInDB)
async def get_tuc_by_id(
    tuc_id: PydanticObjectId,
):
    """
    Obtiene una TUC por su ID.
    """
    tuc = await crud_tuc.get_active(tuc_id)
    if not tuc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TUC no encontrada o eliminada lógicamente."
        )
    return tuc

@router.get("/", response_model=List[TUCInDB])
async def get_all_active_tucs(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las TUCs activas.
    """
    tucs = await crud_tuc.get_multi_active(skip=skip, limit=limit)
    return tucs

@router.put("/{tuc_id}", response_model=TUCInDB)
async def update_tuc(
    tuc_id: PydanticObjectId,
    tuc_in: TUCUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una TUC existente.
    """
    tuc_db = await crud_tuc.get(tuc_id)
    if not tuc_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TUC no encontrada."
        )
    tuc = await crud_tuc.update(tuc_db, tuc_in, updated_by_user_id=current_user_id)
    return tuc

@router.delete("/{tuc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_tuc(
    tuc_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de una TUC.
    """
    tuc_db = await crud_tuc.get_active(tuc_id)
    if not tuc_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TUC no encontrada o ya eliminada."
        )
    await crud_tuc.soft_delete(tuc_db, deleted_by_user_id=current_user_id)
    return {"message": "TUC eliminada lógicamente."}

@router.post("/{tuc_id}/restore", response_model=TUCInDB)
async def restore_tuc(
    tuc_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura una TUC que fue soft-deleted.
    """
    tuc_db = await crud_tuc.get(tuc_id)
    if not tuc_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TUC no encontrada."
        )
    if tuc_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La TUC ya está activa."
        )
    tuc = await crud_tuc.restore(tuc_db, restored_by_user_id=current_user_id)
    return tuc
