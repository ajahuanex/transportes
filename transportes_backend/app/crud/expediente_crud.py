# app/crud/expediente_crud.py
from typing import Optional # <-- Add this import
from app.models.expediente import Expediente
from app.schemas.expediente_schema import ExpedienteCreate, ExpedienteUpdate
from app.crud.base import CRUDBase

class CRUDExpediente(CRUDBase[Expediente, ExpedienteCreate, ExpedienteUpdate]):
    async def get_by_numero_expediente(self, numero_expediente: str) -> Optional[Expediente]:
        """Obtiene un expediente por su número (solo activo)."""
        return await Expediente.find_one(Expediente.numero_expediente == numero_expediente, Expediente.estado_logico == "ACTIVO")

crud_expediente = CRUDExpediente(Expediente)
