# app/crud/empresa_crud.py
from typing import Optional # <-- Add this import
from app.models.empresa import Empresa
from app.schemas.empresa_schema import EmpresaCreate, EmpresaUpdate
from app.crud.base import CRUDBase

class CRUDEmpresa(CRUDBase[Empresa, EmpresaCreate, EmpresaUpdate]):
    async def get_by_ruc(self, ruc: str) -> Optional[Empresa]:
        """Obtiene una empresa por su RUC (solo activa)."""
        return await Empresa.find_one(Empresa.ruc == ruc, Empresa.estado_logico == "ACTIVO")

crud_empresa = CRUDEmpresa(Empresa)
