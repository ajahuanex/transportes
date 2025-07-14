# app/api/v1/endpoints/expedientes.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.expediente_schema import ExpedienteCreate, ExpedienteUpdate, ExpedienteInDB
from app.crud.expediente_crud import crud_expediente
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=ExpedienteInDB, status_code=status.HTTP_201_CREATED)
async def create_expediente(
    expediente_in: ExpedienteCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea un nuevo expediente.
    """
    existing_expediente = await crud_expediente.get_by_numero_expediente(expediente_in.numero_expediente)
    if existing_expediente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de expediente ya existe."
        )
    expediente = await crud_expediente.create(expediente_in, created_by_user_id=current_user_id)
    return expediente

@router.get("/{expediente_id}", response_model=ExpedienteInDB)
async def get_expediente_by_id(
    expediente_id: PydanticObjectId,
):
    """
    Obtiene un expediente por su ID.
    """
    expediente = await crud_expediente.get_active(expediente_id)
    if not expediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expediente no encontrado o eliminado lógicamente."
        )
    return expediente

@router.get("/", response_model=List[ExpedienteInDB])
async def get_all_active_expedientes(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los expedientes activos.
    """
    expedientes = await crud_expediente.get_multi_active(skip=skip, limit=limit)
    return expedientes

@router.put("/{expediente_id}", response_model=ExpedienteInDB)
async def update_expediente(
    expediente_id: PydanticObjectId,
    expediente_in: ExpedienteUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza un expediente existente.
    """
    expediente_db = await crud_expediente.get(expediente_id)
    if not expediente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expediente no encontrado."
        )
    expediente = await crud_expediente.update(expediente_db, expediente_in, updated_by_user_id=current_user_id)
    return expediente

@router.delete("/{expediente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_expediente(
    expediente_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de un expediente.
    """
    expediente_db = await crud_expediente.get_active(expediente_id)
    if not expediente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expediente no encontrado o ya eliminado."
        )
    await crud_expediente.soft_delete(expediente_db, deleted_by_user_id=current_user_id)
    return {"message": "Expediente eliminado lógicamente."}

@router.post("/{expediente_id}/restore", response_model=ExpedienteInDB)
async def restore_expediente(
    expediente_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura un expediente que fue soft-deleted.
    """
    expediente_db = await crud_expediente.get(expediente_id)
    if not expediente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expediente no encontrado."
        )
    if expediente_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El expediente ya está activo."
        )
    expediente = await crud_expediente.restore(expediente_db, restored_by_user_id=current_user_id)
    return expediente
