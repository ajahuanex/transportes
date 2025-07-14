# app/crud/configuracion_mtc_crud.py
from typing import Optional # <-- Add this import
from app.models.configuracion_mtc import ConfiguracionMTC
from app.schemas.configuracion_mtc_schema import ConfiguracionMTCCreate, ConfiguracionMTCUpdate
from app.crud.base import CRUDBase
from datetime import datetime, timezone, timedelta
from beanie import PydanticObjectId

LIMA_TZ = timezone(timedelta(hours=-5))

class CRUDConfiguracionMTC(CRUDBase[ConfiguracionMTC, ConfiguracionMTCCreate, ConfiguracionMTCUpdate]):
    async def get_config(self) -> Optional[ConfiguracionMTC]:
        """Obtiene el único documento de configuración."""
        return await ConfiguracionMTC.get("permanencia_vehiculos")

    async def create_or_update_config(self, obj_in: ConfiguracionMTCCreate, updated_by_user_id: Optional[PydanticObjectId] = None) -> ConfiguracionMTC:
        """
        Crea el documento de configuración si no existe, o lo actualiza si ya existe.
        """
        config_doc = await self.get_config()
        obj_data = obj_in.model_dump(exclude_unset=True)
        
        if config_doc:
            # Actualizar
            config_doc.reglas_antiguedad = obj_data.get("reglas_antiguedad", config_doc.reglas_antiguedad)
            config_doc.observaciones = obj_data.get("observaciones", config_doc.observaciones)
            config_doc.fecha_ultima_actualizacion = datetime.now(LIMA_TZ)
            config_doc.actualizado_por_usuario_id = updated_by_user_id
            await config_doc.save()
            return config_doc
        else:
            # Crear
            new_config = ConfiguracionMTC(
                _id="permanencia_vehiculos",
                reglas_antiguedad=obj_data.get("reglas_antiguedad", []),
                observaciones=obj_data.get("observaciones"),
                fecha_ultima_actualizacion=datetime.now(LIMA_TZ),
                actualizado_por_usuario_id=updated_by_user_id
            )
            await new_config.insert()
            return new_config

crud_configuracion_mtc = CRUDConfiguracionMTC(ConfiguracionMTC)
