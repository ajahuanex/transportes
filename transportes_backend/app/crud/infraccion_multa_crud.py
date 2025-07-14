# app/crud/infraccion_multa_crud.py
from typing import Optional # <-- Add this import
from app.models.infraccion_multa import InfraccionMulta
from app.schemas.infraccion_multa_schema import InfraccionMultaCreate, InfraccionMultaUpdate
from app.crud.base import CRUDBase

class CRUDInfraccionMulta(CRUDBase[InfraccionMulta, InfraccionMultaCreate, InfraccionMultaUpdate]):
    async def get_by_numero_infraccion(self, numero_infraccion: str) -> Optional[InfraccionMulta]:
        """Obtiene una infracción/multa por su número (solo activa)."""
        return await InfraccionMulta.find_one(InfraccionMulta.numero_infraccion == numero_infraccion, InfraccionMulta.estado_logico == "ACTIVO")

crud_infraccion_multa = CRUDInfraccionMulta(InfraccionMulta)
