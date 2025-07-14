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

@router.get("/", response_model=List[ExpedienteInDB])
async def get_all_expedientes(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los expedientes (activos e inactivos).
    """
    expedientes = await crud_expediente.get_multi(skip=skip, limit=limit)
    return expedientes

@router.get("/active", response_model=List[ExpedienteInDB])
async def get_all_active_expedientes(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los expedientes activos.
    """
    expedientes = await crud_expediente.get_multi_active(skip=skip, limit=limit)
    return expedientes

@router.get("/{expediente_id}", response_model=ExpedienteInDB)
async def get_expediente_by_id(
    expediente_id: PydanticObjectId,
):
    """
    Obtiene un expediente por su ID.
    """
    expediente = await crud_expediente.get(expediente_id) # Obtiene el expediente sin importar su estado lógico
    if not expediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expediente no encontrado."
        )
    return expediente

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
