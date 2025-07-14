# app/crud/usuario_crud.py
from typing import Optional
from beanie import PydanticObjectId
from app.models.usuario import Usuario
from app.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate
from app.core.security import get_password_hash
from app.crud.base import CRUDBase

class CRUDUsuario(CRUDBase[Usuario, UsuarioCreate, UsuarioUpdate]):
    async def create(self, user_in: UsuarioCreate, created_by_user_id: Optional[PydanticObjectId] = None) -> Usuario:
        """
        Crea un nuevo usuario en la base de datos, hasheando la contraseña.
        """
        hashed_password = get_password_hash(user_in.password)
        user_data = user_in.model_dump(exclude_unset=True)
        user_data["password_hash"] = hashed_password
        del user_data["password"] # Elimina la contraseña plana antes de pasar a Beanie
        
        # Llama al método create de la clase base para manejar los campos de auditoría
        new_user = self.model(**user_data)
        new_user.fecha_creacion = self.get_current_lima_time()
        new_user.creado_por_usuario_id = created_by_user_id
        new_user.fecha_ultima_modificacion = self.get_current_lima_time()
        new_user.ultima_modificacion_por_usuario_id = created_by_user_id
        await new_user.insert()
        return new_user

    async def update(self, db_obj: Usuario, obj_in: UsuarioUpdate, updated_by_user_id: Optional[PydanticObjectId] = None) -> Usuario:
        """
        Actualiza un usuario existente, hasheando la contraseña si se proporciona.
        """
        update_data = obj_in.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data["password"])
            del update_data["password"]
        
        # Llama al método update de la clase base para manejar los campos de auditoría
        db_obj.fecha_ultima_modificacion = self.get_current_lima_time()
        db_obj.ultima_modificacion_por_usuario_id = updated_by_user_id
        await db_obj.set(update_data)
        return db_obj

    async def get_by_username(self, username: str) -> Optional[Usuario]:
        """
        Obtiene un usuario por su nombre de usuario (solo activos).
        """
        return await Usuario.find_one(Usuario.username == username, Usuario.estado_logico == "ACTIVO")

    def get_current_lima_time(self):
        """Helper para obtener la hora actual en la zona horaria de Lima."""
        from datetime import datetime, timezone, timedelta
        LIMA_TZ = timezone(timedelta(hours=-5))
        return datetime.now(LIMA_TZ)

crud_usuario = CRUDUsuario(Usuario)
