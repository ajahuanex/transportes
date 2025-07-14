# app/api/v1/endpoints/rutas.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.ruta_schema import RutaCreate, RutaUpdate, RutaInDB
from app.crud.ruta_crud import crud_ruta
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=RutaInDB, status_code=status.HTTP_201_CREATED)
async def create_ruta(
    ruta_in: RutaCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea una nueva ruta.
    """
    existing_ruta = await crud_ruta.get_by_codigo_ruta(ruta_in.codigo_ruta)
    if existing_ruta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código de ruta ya existe."
        )
    # Convertir IDs de string a PydanticObjectId si existen y no están vacíos
    if ruta_in.origen.terminal_id:
        try:
            ruta_in.origen.terminal_id = PydanticObjectId(ruta_in.origen.terminal_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de terminal de origen inválido.")
    else:
        ruta_in.origen.terminal_id = None

    if ruta_in.destino.terminal_id:
        try:
            ruta_in.destino.terminal_id = PydanticObjectId(ruta_in.destino.terminal_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de terminal de destino inválido.")
    else:
        ruta_in.destino.terminal_id = None
    
    try:
        ruta_in.empresa_autorizada_id = PydanticObjectId(ruta_in.empresa_autorizada_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de empresa autorizada inválido.")

    if ruta_in.resolucion_autorizacion_id:
        try:
            ruta_in.resolucion_autorizacion_id = PydanticObjectId(ruta_in.resolucion_autorizacion_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de resolución de autorización inválido.")
    else:
        ruta_in.resolucion_autorizacion_id = None

    ruta = await crud_ruta.create(ruta_in, created_by_user_id=current_user_id)
    return ruta

@router.get("/", response_model=List[RutaInDB])
async def get_all_rutas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las rutas (activos e inactivos).
    """
    rutas = await crud_ruta.get_multi(skip=skip, limit=limit)
    return rutas

@router.get("/active", response_model=List[RutaInDB])
async def get_all_active_rutas(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todas las rutas activas.
    """
    rutas = await crud_ruta.get_multi_active(skip=skip, limit=limit)
    return rutas

@router.get("/{ruta_id}", response_model=RutaInDB)
async def get_ruta_by_id(
    ruta_id: str,
):
    """
    Obtiene una ruta por su ID.
    """
    try:
        object_id = PydanticObjectId(ruta_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de ruta inválido."
        )
    ruta = await crud_ruta.get(object_id) # Obtiene la ruta sin importar su estado lógico
    if not ruta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ruta no encontrada."
        )
    return ruta

@router.put("/{ruta_id}", response_model=RutaInDB)
async def update_ruta(
    ruta_id: str,
    ruta_in: RutaUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza una ruta existente.
    """
    try:
        object_id = PydanticObjectId(ruta_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de ruta inválido."
        )
    ruta_db = await crud_ruta.get(object_id)
    if not ruta_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ruta no encontrada."
        )
    ruta = await crud_ruta.update(ruta_db, ruta_in, updated_by_user_id=current_user_id)
    return ruta
