# app/api/v1/endpoints/empresas.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.empresa_schema import EmpresaCreate, EmpresaUpdate, EmpresaInDB
from app.crud.empresa_crud import crud_empresa
from app.api.v1.endpoints.usuarios import get_current_user_id # Reutiliza la dependencia del usuario actual

router = APIRouter()

@router.post("/", response_model=EmpresaInDB, status_code=status.HTTP_201_CREATED)
async def create_empresa(
    empresa_in: EmpresaCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva empresa.
    """
    existing_empresa = await crud_empresa.get_by_ruc(empresa_in.ruc)
    if existing_empresa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El RUC de la empresa ya existe."
        )
    empresa = await crud_empresa.create(empresa_in, created_by_user_id=current_user_id)
    return empresa

@router.get("/", response_model=List[EmpresaInDB])
async def get_all_empresas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las empresas (activas e inactiva).
    """
    empresas = await crud_empresa.get_multi(skip=skip, limit=limit)
    return empresas

@router.get("/active", response_model=List[EmpresaInDB])
async def get_all_active_empresas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las empresas activas.
    """
    empresas = await crud_empresa.get_multi_active(skip=skip, limit=limit)
    return empresas

@router.get("/{empresa_id}", response_model=EmpresaInDB)
async def get_empresa_by_id(
    empresa_id: str,
):
    """
    Obtiene una empresa por su ID.
    """
    try:
        object_id = PydanticObjectId(empresa_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de empresa inválido."
        )
    empresa = await crud_empresa.get(object_id) # Obtiene la empresa sin importar su estado lógico
    if not empresa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada."
        )
    return empresa

@router.put("/{empresa_id}", response_model=EmpresaInDB)
async def update_empresa(
    empresa_id: str,
    empresa_in: EmpresaUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una empresa existente.
    """
    try:
        object_id = PydanticObjectId(empresa_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de empresa inválido."
        )
    empresa_db = await crud_empresa.get(object_id)
    if not empresa_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada."
        )
    empresa = await crud_empresa.update(empresa_db, empresa_in, updated_by_user_id=current_user_id)
    return empresa
