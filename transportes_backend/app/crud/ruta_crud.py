# app/crud/ruta_crud.py
from typing import Optional # <-- Add this import
from app.models.ruta import Ruta
from app.schemas.ruta_schema import RutaCreate, RutaUpdate
from app.crud.base import CRUDBase

class CRUDRuta(CRUDBase[Ruta, RutaCreate, RutaUpdate]):
    async def get_by_codigo_ruta(self, codigo_ruta: str) -> Optional[Ruta]:
        """Obtiene una ruta por su código (solo activa)."""
        return await Ruta.find_one(Ruta.codigo_ruta == codigo_ruta, Ruta.estado_logico == "ACTIVO")

crud_ruta = CRUDRuta(Ruta)
