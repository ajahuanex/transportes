# app/api/v1/endpoints/terminales_terrestres.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.schemas.terminal_terrestre_schema import TerminalTerrestreCreate, TerminalTerrestreUpdate, TerminalTerrestreInDB
from app.crud.terminal_terrestre_crud import crud_terminal_terrestre
from app.api.v1.endpoints.usuarios import get_current_user_id

router = APIRouter()

@router.post("/", response_model=TerminalTerrestreInDB, status_code=status.HTTP_201_CREATED)
async def create_terminal_terrestre(
    terminal_in: TerminalTerrestreCreate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Crea un nuevo terminal terrestre.
    """
    existing_terminal = await crud_terminal_terrestre.get_by_nombre(terminal_in.nombre)
    if existing_terminal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre del terminal terrestre ya existe."
        )
    terminal = await crud_terminal_terrestre.create(terminal_in, created_by_user_id=current_user_id)
    return terminal

@router.get("/{terminal_id}", response_model=TerminalTerrestreInDB)
async def get_terminal_terrestre_by_id(
    terminal_id: PydanticObjectId,
):
    """
    Obtiene un terminal terrestre por su ID.
    """
    terminal = await crud_terminal_terrestre.get_active(terminal_id)
    if not terminal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Terminal terrestre no encontrado o eliminado lógicamente."
        )
    return terminal

@router.get("/", response_model=List[TerminalTerrestreInDB])
async def get_all_active_terminales_terrestres(
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de todos los terminales terrestres activos.
    """
    terminales = await crud_terminal_terrestre.get_multi_active(skip=skip, limit=limit)
    return terminales

@router.put("/{terminal_id}", response_model=TerminalTerrestreInDB)
async def update_terminal_terrestre(
    terminal_id: PydanticObjectId,
    terminal_in: TerminalTerrestreUpdate,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Actualiza un terminal terrestre existente.
    """
    terminal_db = await crud_terminal_terrestre.get(terminal_id)
    if not terminal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Terminal terrestre no encontrado."
        )
    terminal = await crud_terminal_terrestre.update(terminal_db, terminal_in, updated_by_user_id=current_user_id)
    return terminal

@router.delete("/{terminal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def soft_delete_terminal_terrestre(
    terminal_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Realiza un soft delete de un terminal terrestre.
    """
    terminal_db = await crud_terminal_terrestre.get_active(terminal_id)
    if not terminal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Terminal terrestre no encontrado o ya eliminado."
        )
    await crud_terminal_terrestre.soft_delete(terminal_db, deleted_by_user_id=current_user_id)
    return {"message": "Terminal terrestre eliminado lógicamente."}

@router.post("/{terminal_id}/restore", response_model=TerminalTerrestreInDB)
async def restore_terminal_terrestre(
    terminal_id: PydanticObjectId,
    current_user_id: PydanticObjectId = Depends(get_current_user_id)
):
    """
    Restaura un terminal terrestre que fue soft-deleted.
    """
    terminal_db = await crud_terminal_terrestre.get(terminal_id)
    if not terminal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Terminal terrestre no encontrado."
        )
    if terminal_db.estado_logico == "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El terminal terrestre ya está activo."
        )
    terminal = await crud_terminal_terrestre.restore(terminal_db, restored_by_user_id=current_user_id)
    return terminal
