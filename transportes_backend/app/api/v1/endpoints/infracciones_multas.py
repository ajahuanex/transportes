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

@router.get("/", response_model=List[InfraccionMultaInDB])
async def get_all_infracciones_multas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las infracciones/multas (activas e inactiva).
    """
    infracciones = await crud_infraccion_multa.get_multi(skip=skip, limit=limit)
    return infracciones

@router.get("/active", response_model=List[InfraccionMultaInDB])
async def get_all_active_infracciones_multas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las infracciones/multas activas.
    """
    infracciones = await crud_infraccion_multa.get_multi_active(skip=skip, limit=limit)
    return infracciones

@router.get("/{infraccion_id}", response_model=InfraccionMultaInDB)
async def get_infraccion_multa_by_id(
    infraccion_id: PydanticObjectId,
):
    """
    Obtiene una infracción o multa por su ID.
    """
    infraccion = await crud_infraccion_multa.get(infraccion_id) # Obtiene la infracción/multa sin importar su estado lógico
    if not infraccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Infracción/multa no encontrada."
        )
    return infraccion

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
