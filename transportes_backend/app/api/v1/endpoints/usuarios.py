# app/api/v1/endpoints/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, UsuarioInDB
from app.crud.usuario_crud import crud_usuario
# from app.api.deps import get_current_active_user # Si implementas autenticación y autorización

router = APIRouter()

# Dependencia de ejemplo para obtener el usuario actual (descomentar al implementar autenticación)
async def get_current_user_id():
    # Esto es un placeholder. En un sistema real, se obtendría del token JWT.
    # Por ahora, se puede usar un ID de usuario fijo para pruebas o None.
    # Asegúrate de que este ID exista en tu colección de usuarios para que la auditoría funcione.
    return PydanticObjectId("60c72b2f9c3f4e001f8e4b40") # ID de usuario de ejemplo

@router.post("/", response_model=UsuarioInDB, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UsuarioCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id) # Auditoría
):
    """
    Crea un nuevo usuario.
    """
    existing_user = await crud_usuario.get_by_username(user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya existe."
        )
    user = await crud_usuario.create(user_in, created_by_user_id=current_user_id)
    return user

@router.get("/", response_model=List[UsuarioInDB])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    # current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Obtiene una lista de todos los usuarios (activos e inactivos).
    """
    users = await crud_usuario.get_multi(skip=skip, limit=limit)
    return users

@router.get("/active", response_model=List[UsuarioInDB])
async def get_all_active_users(
    skip: int = 0,
    limit: int = 100,
    # current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Obtiene una lista de todos los usuarios activos.
    """
    users = await crud_usuario.get_multi_active(skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UsuarioInDB)
async def get_user_by_id(
    user_id: str,
    # current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Obtiene un usuario por su ID.
    """
    try:
        object_id = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de usuario inválido."
        )
    user = await crud_usuario.get(object_id) # Obtiene el usuario sin importar su estado lógico
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    return user

@router.put("/{user_id}", response_model=UsuarioInDB)
async def update_user(
    user_id: PydanticObjectId,
    user_in: UsuarioUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id) # Auditoría
):
    """
    Actualiza un usuario existente.
    """
    user_db = await crud_usuario.get(user_id)
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    user = await crud_usuario.update(user_db, user_in, updated_by_user_id=current_user_id)
    return user


