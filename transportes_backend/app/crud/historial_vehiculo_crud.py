# app/crud/historial_vehiculo_crud.py
from typing import Optional # <-- Add this import
from app.models.historial_vehiculo import HistorialVehiculo
from app.schemas.historial_vehiculo_schema import HistorialVehiculoCreate, HistorialVehiculoUpdate
from app.crud.base import CRUDBase

class CRUDHistorialVehiculo(CRUDBase[HistorialVehiculo, HistorialVehiculoCreate, HistorialVehiculoUpdate]):
    # El historial de vehículos es un registro de eventos, no debería tener soft delete.
    # Podrías añadir métodos específicos para filtrar por tipo de evento, vehículo, etc.
    pass

crud_historial_vehiculo = CRUDHistorialVehiculo(HistorialVehiculo)
