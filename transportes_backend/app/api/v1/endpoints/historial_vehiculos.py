# app/api/v1/endpoints/historial_vehiculos.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.historial_vehiculo_schema import HistorialVehiculoCreate, HistorialVehiculoUpdate, HistorialVehiculoInDB
from app.crud.historial_vehiculo_crud import crud_historial_vehiculo
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=HistorialVehiculoInDB, status_code=status.HTTP_201_CREATED)
async def create_historial_vehiculo(
    historial_in: HistorialVehiculoCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea un nuevo registro en el historial de vehículos.
    """
    historial = await crud_historial_vehiculo.create(historial_in, created_by_user_id=current_user_id)
    return historial

@router.get("/{historial_id}", response_model=HistorialVehiculoInDB)
async def get_historial_vehiculo_by_id(
    historial_id: PydanticObjectId,
):
    """
    Obtiene un registro de historial de vehículo por su ID.
    """
    historial = await crud_historial_vehiculo.get(historial_id)
    if not historial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de historial no encontrado."
        )
    return historial

@router.get("/by_vehiculo/{vehiculo_id}", response_model=List[HistorialVehiculoInDB])
async def get_historial_by_vehiculo(
    vehiculo_id: PydanticObjectId,
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene el historial de eventos para un vehículo específico.
    """
    historial = await crud_historial_vehiculo.model.find(
        crud_historial_vehiculo.model.vehiculo_id == vehiculo_id
    ).skip(skip).limit(limit).to_list()
    return historial

@router.put("/{historial_id}", response_model=HistorialVehiculoInDB)
async def update_historial_vehiculo(
    historial_id: PydanticObjectId,
    historial_in: HistorialVehiculoUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza un registro de historial de vehículo existente.
    """
    historial_db = await crud_historial_vehiculo.get(historial_id)
    if not historial_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de historial no encontrado."
        )
    historial = await crud_historial_vehiculo.update(historial_db, historial_in, updated_by_user_id=current_user_id)
    return historial

# Nota: No se implementa soft delete para el historial, ya que son registros de eventos inmutables.
