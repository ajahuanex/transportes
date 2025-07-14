# app/api/v1/endpoints/resoluciones.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.resolucion_schema import ResolucionCreate, ResolucionUpdate, ResolucionInDB
from app.crud.resolucion_crud import crud_resolucion
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=ResolucionInDB, status_code=status.HTTP_201_CREATED)
async def create_resolucion(
    resolucion_in: ResolucionCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva resolución.
    """
    existing_resolucion = await crud_resolucion.get_by_numero_resolucion(resolucion_in.numero_resolucion)
    if existing_resolucion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de resolución ya existe."
        )
    resolucion = await crud_resolucion.create(resolucion_in, created_by_user_id=current_user_id)
    return resolucion

@router.get("/{resolucion_id}", response_model=ResolucionInDB)
async def get_resolucion_by_id(
    resolucion_id: PydanticObjectId,
):
    """
    Obtiene una resolución por su ID.
    """
    resolucion = await crud_resolucion.get(resolucion_id)
    if not resolucion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resolución no encontrada."
        )
    return resolucion

@router.get("/", response_model=List[ResolucionInDB])
async def get_all_resoluciones(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las resoluciones.
    """
    resoluciones = await crud_resolucion.get_multi(skip=skip, limit=limit)
    return resoluciones

@router.put("/{resolucion_id}", response_model=ResolucionInDB)
async def update_resolucion(
    resolucion_id: PydanticObjectId,
    resolucion_in: ResolucionUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una resolución existente.
    """
    resolucion_db = await crud_resolucion.get(resolucion_id)
    if not resolucion_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resolución no encontrada."
        )
    resolucion = await crud_resolucion.update(resolucion_db, resolucion_in, updated_by_user_id=current_user_id)
    return resolucion

# Nota: No hay soft delete para resoluciones, su estado se maneja con 'estado_resolucion'
