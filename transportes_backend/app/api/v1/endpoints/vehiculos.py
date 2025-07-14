# app/api/v1/endpoints/vehiculos.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.models.vehiculo import Vehiculo
from app.schemas.vehiculo_schema import VehiculoCreate, VehiculoUpdate, VehiculoInDB
from app.crud.vehiculo_crud import crud_vehiculo
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=VehiculoInDB, status_code=status.HTTP_201_CREATED)
async def create_vehiculo(
    vehiculo_in: VehiculoCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea un nuevo vehículo.
    """
    # Check for existing placa across all vehicles (active or not)
    if await Vehiculo.find_one(Vehiculo.placa == vehiculo_in.placa):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La placa del vehículo ya existe."
        )
    
    # Check for existing numero_serie_chasis (VIN)
    if vehiculo_in.numero_serie_chasis:
        if await Vehiculo.find_one(Vehiculo.numero_serie_chasis == vehiculo_in.numero_serie_chasis):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El número de serie del chasis (VIN) ya existe."
            )
            
    vehiculo = await crud_vehiculo.create(vehiculo_in, created_by_user_id=current_user_id)
    return vehiculo

@router.get("/", response_model=List[VehiculoInDB])
async def get_all_vehiculos(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los vehículos (activos e inactivos).
    """
    vehiculos = await crud_vehiculo.get_multi(skip=skip, limit=limit)
    return vehiculos

@router.get("/active", response_model=List[VehiculoInDB])
async def get_all_active_vehiculos(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los vehículos activos.
    """
    vehiculos = await crud_vehiculo.get_multi_active(skip=skip, limit=limit)
    return vehiculos

@router.get("/{vehiculo_id}", response_model=VehiculoInDB)
async def get_vehiculo_by_id(
    vehiculo_id: str,
):
    """
    Obtiene un vehículo por su ID.
    """
    try:
        object_id = PydanticObjectId(vehiculo_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de vehículo inválido."
        )
    vehiculo = await crud_vehiculo.get(object_id) # Obtiene el vehículo sin importar su estado lógico
    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehículo no encontrado."
        )
    return vehiculo

@router.put("/{vehiculo_id}", response_model=VehiculoInDB)
async def update_vehiculo(
    vehiculo_id: str,
    vehiculo_in: VehiculoUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza un vehículo existente.
    """
    try:
        object_id = PydanticObjectId(vehiculo_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de vehículo inválido."
        )
    vehiculo_db = await crud_vehiculo.get(object_id)
    if not vehiculo_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehículo no encontrado."
        )

    # Check for unique placa if it's being changed
    if vehiculo_in.placa and vehiculo_in.placa != vehiculo_db.placa:
        if await Vehiculo.find_one(Vehiculo.placa == vehiculo_in.placa):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La nueva placa ya está en uso por otro vehículo."
            )

    # Check for unique numero_serie_chasis if it's being changed
    if vehiculo_in.numero_serie_chasis and vehiculo_in.numero_serie_chasis != vehiculo_db.numero_serie_chasis:
        if await Vehiculo.find_one(Vehiculo.numero_serie_chasis == vehiculo_in.numero_serie_chasis):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nuevo número de serie del chasis (VIN) ya está en uso por otro vehículo."
            )

    vehiculo = await crud_vehiculo.update(vehiculo_db, vehiculo_in, updated_by_user_id=current_user_id)
    return vehiculo
