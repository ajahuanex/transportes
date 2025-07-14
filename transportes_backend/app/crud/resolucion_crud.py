# app/crud/resolucion_crud.py
from typing import Optional # <-- Add this import
from app.models.resolucion import Resolucion
from app.schemas.resolucion_schema import ResolucionCreate, ResolucionUpdate
from app.crud.base import CRUDBase

class CRUDResolucion(CRUDBase[Resolucion, ResolucionCreate, ResolucionUpdate]):
    # Las resoluciones no tienen soft delete por su naturaleza inmutable,
    # su estado se maneja con 'estado_resolucion'.
    # Sobreescribe los métodos de soft_delete/restore si es necesario para evitar su uso.
    pass

crud_resolucion = CRUDResolucion(Resolucion)
