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

@router.get("/", response_model=List[PapeletaInDB])
async def get_all_papeletas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las papeletas (activas e inactiva).
    """
    papeletas = await crud_papeleta.get_multi(skip=skip, limit=limit)
    return papeletas

@router.get("/active", response_model=List[PapeletaInDB])
async def get_all_active_papeletas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las papeletas activas.
    """
    papeletas = await crud_papeleta.get_multi_active(skip=skip, limit=limit)
    return papeletas

@router.get("/{papeleta_id}", response_model=PapeletaInDB)
async def get_papeleta_by_id(
    papeleta_id: PydanticObjectId,
):
    """
    Obtiene una papeleta por su ID.
    """
    papeleta = await crud_papeleta.get(papeleta_id) # Obtiene la papeleta sin importar su estado lógico
    if not papeleta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Papeleta no encontrada."
        )
    return papeleta

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
