# app/crud/tuc_crud.py
from typing import Optional # <-- Add this import
from app.models.tuc import TUC
from app.schemas.tuc_schema import TUCCreate, TUCUpdate
from app.crud.base import CRUDBase

class CRUDTUC(CRUDBase[TUC, TUCCreate, TUCUpdate]):
    # Las TUCs tienen su propio campo 'estado' (HABILITADO, BAJA, SUSPENDIDO)
    # y un 'estado_logico' para errores de registro.
    async def get_by_numero_tuc(self, numero_tuc: str) -> Optional[TUC]:
        """Obtiene una TUC por su número (solo activa lógicamente)."""
        return await TUC.find_one(TUC.numero_tuc == numero_tuc, TUC.estado_logico == "ACTIVO")

crud_tuc = CRUDTUC(TUC)
