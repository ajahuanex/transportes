# app/crud/terminal_terrestre_crud.py
from typing import Optional # <-- Add this import
from app.models.terminal_terrestre import TerminalTerrestre
from app.schemas.terminal_terrestre_schema import TerminalTerrestreCreate, TerminalTerrestreUpdate
from app.crud.base import CRUDBase

class CRUDTerminalTerrestre(CRUDBase[TerminalTerrestre, TerminalTerrestreCreate, TerminalTerrestreUpdate]):
    async def get_by_nombre(self, nombre: str) -> Optional[TerminalTerrestre]:
        """Obtiene un terminal terrestre por su nombre (solo activo)."""
        return await TerminalTerrestre.find_one(TerminalTerrestre.nombre == nombre, TerminalTerrestre.estado_logico == "ACTIVO")

crud_terminal_terrestre = CRUDTerminalTerrestre(TerminalTerrestre)
