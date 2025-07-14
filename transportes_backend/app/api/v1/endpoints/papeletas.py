# app/api/v1/endpoints/papeletas.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.papeleta_schema import PapeletaCreate, PapeletaUpdate, PapeletaInDB
from app.crud.papeleta_crud import crud_papeleta
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=PapeletaInDB, status_code=status.HTTP_201_CREATED)
async def create_papeleta(
    papeleta_in: PapeletaCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva papeleta.
    """
    existing_papeleta = await crud_papeleta.get_by_numero_papeleta(papeleta_in.numero_papeleta)
    if existing_papeleta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de papeleta ya existe."
        )
    papeleta = await crud_papeleta.create(papeleta_in, created_by_user_id=current_user_id)
    return papeleta

@router.get("/{papeleta_id}", response_model=PapeletaInDB)
async def get_papeleta_by_id(
    papeleta_id: PydanticObjectId,
):
    """
    Obtiene una papeleta por su ID.
    """
    papeleta = await crud_papeleta.get_active(papeleta_id)
    if not papeleta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Papeleta no encontrada o eliminada lógicamente."
        )
    return papeleta

@router.get("/", response_model=List[PapeletaInDB])
async def get_all_active_papeletas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las papeletas activas.
    """
    papeletas = await crud_papeleta.get_multi_active(skip=skip, limit=limit)
    return papeletas

@router.put("/{papeleta_id}", response_model=PapeletaInDB)
async def update_papeleta(
    papeleta_id: PydanticObjectId,
    papeleta_in: PapeletaUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una papeleta existente.
    """
    papeleta_db = await crud_papeleta.get(papeleta_id)
    if not papeleta_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Papeleta no encontrada."
        )
    papeleta = await crud_papeleta.update(papeleta_db, papeleta_in, updated_by_user_id=current_user_id)
    return papeleta

@router.delete("/{papeleta_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_papeleta(
    papeleta_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de una papeleta.
    """
    papeleta_db = await crud_papeleta.get_active(papeleta_id)
    if not papeleta_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Papeleta no encontrada o ya eliminada."
        )
    await crud_papeleta.soft_delete(papeleta_db, deleted_by_user_id=current_user_id)
    return {"message": "Papeleta eliminada lógicamente."}

@router.post("/{papeleta_id}/restore", response_model=PapeletaInDB)
async def restore_papeleta(
    papeleta_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura una papeleta que fue soft-deleted.
    """
    papeleta_db = await crud_papeleta.get(papeleta_id)
    if not papeleta_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Papeleta no encontrada."
        )
    if papeleta_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La papeleta ya está activa."
        )
    papeleta = await crud_papeleta.restore(papeleta_db, restored_by_user_id=current_user_id)
    return papeleta
