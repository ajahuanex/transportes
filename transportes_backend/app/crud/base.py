# app/crud/base.py
from typing import Generic, TypeVar, Type, List, Optional, Dict, Any
from beanie import Document, PydanticObjectId
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta

# Define un tipo genérico para el modelo Beanie
ModelType = TypeVar("ModelType", bound=Document)
# Define un tipo genérico para el esquema de creación de Pydantic
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
# Define un tipo genérico para el esquema de actualización de Pydantic
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

LIMA_TZ = timezone(timedelta(hours=-5))

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Clase base para operaciones CRUD.
    Proporciona métodos genéricos para crear, leer, actualizar y "eliminar" (soft delete) documentos.
    """
    def __init__(self, model: Type[ModelType]):
        """
        Inicializa la clase CRUD con el modelo Beanie específico.
        :param model: La clase del modelo Beanie (ej. Usuario, Empresa).
        """
        self.model = model

    async def create(self, obj_in: CreateSchemaType, created_by_user_id: Optional[PydanticObjectId] = None) -> ModelType:
        """
        Crea un nuevo documento en la base de datos.
        :param obj_in: Esquema Pydantic con los datos para la creación.
        :param created_by_user_id: ID del usuario que crea el documento (para auditoría).
        :return: El documento Beanie creado.
        """
        obj_data = obj_in.model_dump(exclude_unset=True)
        
        # Añade campos de auditoría
        obj_data["fecha_creacion"] = datetime.now(LIMA_TZ)
        obj_data["creado_por_usuario_id"] = created_by_user_id
        obj_data["fecha_ultima_modificacion"] = datetime.now(LIMA_TZ)
        obj_data["ultima_modificacion_por_usuario_id"] = created_by_user_id

        new_obj = self.model(**obj_data)
        await new_obj.insert()
        return new_obj

    async def get(self, id: PydanticObjectId) -> Optional[ModelType]:
        """
        Obtiene un documento por su ID.
        :param id: El ID del documento.
        :return: El documento Beanie o None si no se encuentra.
        """
        return await self.model.get(id)

    async def get_active(self, id: PydanticObjectId) -> Optional[ModelType]:
        """
        Obtiene un documento activo por su ID.
        :param id: El ID del documento.
        :return: El documento Beanie o None si no se encuentra o está eliminado lógicamente.
        """
        # Asume que el modelo tiene un campo 'estado_logico'
        return await self.model.find_one(self.model.id == id, self.model.estado_logico == "ACTIVO")

    async def get_multi(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Obtiene múltiples documentos (incluyendo eliminados lógicamente).
        :param skip: Número de documentos a omitir.
        :param limit: Número máximo de documentos a devolver.
        :return: Lista de documentos Beanie.
        """
        return await self.model.find().skip(skip).limit(limit).to_list()

    async def get_multi_active(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Obtiene múltiples documentos activos.
        :param skip: Número de documentos a omitir.
        :param limit: Número máximo de documentos a devolver.
        :return: Lista de documentos Beanie.
        """
        # Asume que el modelo tiene un campo 'estado_logico'
        return await self.model.find(self.model.estado_logico == "ACTIVO").skip(skip).limit(limit).to_list()

    async def update(self, db_obj: ModelType, obj_in: UpdateSchemaType, updated_by_user_id: Optional[PydanticObjectId] = None) -> ModelType:
        """
        Actualiza un documento existente.
        :param db_obj: El documento Beanie existente a actualizar.
        :param obj_in: Esquema Pydantic con los datos para la actualización.
        :param updated_by_user_id: ID del usuario que actualiza el documento (para auditoría).
        :return: El documento Beanie actualizado.
        """
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Actualiza campos de auditoría
        update_data["fecha_ultima_modificacion"] = datetime.now(LIMA_TZ)
        update_data["ultima_modificacion_por_usuario_id"] = updated_by_user_id

        await db_obj.set(update_data)
        return db_obj

    async def soft_delete(self, db_obj: ModelType, deleted_by_user_id: Optional[PydanticObjectId] = None) -> ModelType:
        """
        Realiza un soft delete de un documento, marcándolo como eliminado lógicamente.
        :param db_obj: El documento Beanie a "eliminar" lógicamente.
        :param deleted_by_user_id: ID del usuario que realiza la "eliminación".
        :return: El documento Beanie actualizado.
        """
        # Asume que el modelo tiene un campo 'estado_logico'
        db_obj.estado_logico = "ELIMINADO"
        db_obj.fecha_ultima_modificacion = datetime.now(LIMA_TZ)
        db_obj.ultima_modificacion_por_usuario_id = deleted_by_user_id
        await db_obj.save()
        return db_obj

    async def restore(self, db_obj: ModelType, restored_by_user_id: Optional[PydanticObjectId] = None) -> ModelType:
        """
        Restaura un documento que fue soft-deleted.
        :param db_obj: El documento Beanie a restaurar.
        :param restored_by_user_id: ID del usuario que realiza la restauración.
        :return: El documento Beanie actualizado.
        """
        # Asume que el modelo tiene un campo 'estado_logico'
        db_obj.estado_logico = "ACTIVO"
        db_obj.fecha_ultima_modificacion = datetime.now(LIMA_TZ)
        db_obj.ultima_modificacion_por_usuario_id = restored_by_user_id
        await db_obj.save()
        return db_obj

    async def delete(self, db_obj: ModelType):
        """
        Elimina un documento permanentemente de la base de datos (hard delete).
        Usar con precaución.
        :param db_obj: El documento Beanie a eliminar.
        """
        await db_obj.delete()
