# app/crud/conductor_crud.py
from typing import Optional # <-- Add this import
from app.models.conductor import Conductor
from app.schemas.conductor_schema import ConductorCreate, ConductorUpdate
from app.crud.base import CRUDBase

class CRUDConductor(CRUDBase[Conductor, ConductorCreate, ConductorUpdate]):
    async def get_by_dni(self, dni: str) -> Optional[Conductor]:
        """Obtiene un conductor por su DNI (solo activo)."""
        return await Conductor.find_one(Conductor.dni == dni, Conductor.estado_logico == "ACTIVO")

crud_conductor = CRUDConductor(Conductor)
