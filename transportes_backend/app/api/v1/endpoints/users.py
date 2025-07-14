from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.models.usuario import Usuario
from app.schemas.usuario_schema import UsuarioOut

router = APIRouter()

@router.get("/users/", response_model=List[UsuarioOut])
async def read_users():
    users = await Usuario.find_all().to_list()
    return users
