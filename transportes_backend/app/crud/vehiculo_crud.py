# app/crud/vehiculo_crud.py
from typing import Optional
from app.models.vehiculo import Vehiculo
from app.schemas.vehiculo_schema import VehiculoCreate, VehiculoUpdate
from app.crud.base import CRUDBase

class CRUDVehiculo(CRUDBase[Vehiculo, VehiculoCreate, VehiculoUpdate]):
    async def get_by_placa(self, placa: str) -> Optional[Vehiculo]:
        """Obtiene un vehículo por su placa (solo activo)."""
        return await Vehiculo.find_one(Vehiculo.placa == placa, Vehiculo.estado_logico == "ACTIVO")

    async def get_by_numero_serie_chasis(self, numero_serie_chasis: str) -> Optional[Vehiculo]:
        """Obtiene un vehículo por su número de serie de chasis (VIN)."""
        return await Vehiculo.find_one(Vehiculo.numero_serie_chasis == numero_serie_chasis)

crud_vehiculo = CRUDVehiculo(Vehiculo)
