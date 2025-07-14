# app/crud/papeleta_crud.py
from app.crud.base import CRUDBase
from app.models.papeleta import Papeleta
from app.schemas.papeleta_schema import PapeletaCreate, PapeletaUpdate
from beanie import PydanticObjectId
from typing import Optional

class CRUDPapeleta(CRUDBase[Papeleta, PapeletaCreate, PapeletaUpdate]):
    async def get_by_numero_papeleta(self, numero_papeleta: str) -> Optional[Papeleta]:
        return await self.model.find_one(self.model.numero_papeleta == numero_papeleta)

crud_papeleta = CRUDPapeleta(Papeleta)
