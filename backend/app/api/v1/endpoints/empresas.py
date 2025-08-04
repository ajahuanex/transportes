"""
Endpoints para gestión de empresas de transporte
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
import structlog

from app.core.database import empresas_collection
from app.core.auth import get_current_user
from app.models.empresa import (
    EmpresaTransporte,
    CreateEmpresaRequest,
    UpdateEmpresaRequest,
    EmpresaFilters
)
from app.services.empresa_service import EmpresaService
from app.schemas.common import PaginatedResponse, ApiResponse

logger = structlog.get_logger()
router = APIRouter()

@router.get(
    "/",
    response_model=PaginatedResponse[EmpresaTransporte],
    summary="Listar empresas",
    description="Obtener lista paginada de empresas de transporte"
)
async def list_empresas(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
    search: Optional[str] = Query(None, description="Término de búsqueda"),
    tipo_empresa: Optional[str] = Query(None, description="Tipo de empresa"),
    categoria: Optional[str] = Query(None, description="Categoría de empresa"),
    estado: Optional[str] = Query(None, description="Estado de la empresa"),
    departamento: Optional[str] = Query(None, description="Departamento"),
    provincia: Optional[str] = Query(None, description="Provincia"),
    current_user = Depends(get_current_user)
):
    """Listar empresas con filtros y paginación"""
    try:
        filters = EmpresaFilters(
            search=search,
            tipoEmpresa=tipo_empresa,
            categoria=categoria,
            estado=estado,
            departamento=departamento,
            provincia=provincia
        )
        
        service = EmpresaService()
        result = await service.list_empresas(page, limit, filters)
        
        return result
        
    except Exception as e:
        logger.error("Error al listar empresas", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get(
    "/{empresa_id}",
    response_model=EmpresaTransporte,
    summary="Obtener empresa",
    description="Obtener detalles de una empresa específica"
)
async def get_empresa(
    empresa_id: str,
    current_user = Depends(get_current_user)
):
    """Obtener empresa por ID"""
    try:
        service = EmpresaService()
        empresa = await service.get_empresa(empresa_id)
        
        if not empresa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        return empresa
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al obtener empresa", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post(
    "/",
    response_model=EmpresaTransporte,
    status_code=status.HTTP_201_CREATED,
    summary="Crear empresa",
    description="Registrar una nueva empresa de transporte"
)
async def create_empresa(
    empresa_data: CreateEmpresaRequest,
    current_user = Depends(get_current_user)
):
    """Crear nueva empresa"""
    try:
        service = EmpresaService()
        empresa = await service.create_empresa(empresa_data, current_user.id)
        
        logger.info(
            "Empresa creada exitosamente",
            empresa_id=empresa.id,
            ruc=empresa.ruc,
            user_id=current_user.id
        )
        
        return empresa
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error("Error al crear empresa", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put(
    "/{empresa_id}",
    response_model=EmpresaTransporte,
    summary="Actualizar empresa",
    description="Actualizar datos de una empresa existente"
)
async def update_empresa(
    empresa_id: str,
    empresa_data: UpdateEmpresaRequest,
    current_user = Depends(get_current_user)
):
    """Actualizar empresa"""
    try:
        service = EmpresaService()
        empresa = await service.update_empresa(empresa_id, empresa_data, current_user.id)
        
        if not empresa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        logger.info(
            "Empresa actualizada exitosamente",
            empresa_id=empresa_id,
            user_id=current_user.id
        )
        
        return empresa
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error("Error al actualizar empresa", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.delete(
    "/{empresa_id}",
    response_model=ApiResponse,
    summary="Eliminar empresa",
    description="Eliminar una empresa (marcar como cancelada)"
)
async def delete_empresa(
    empresa_id: str,
    current_user = Depends(get_current_user)
):
    """Eliminar empresa (marcar como cancelada)"""
    try:
        service = EmpresaService()
        success = await service.delete_empresa(empresa_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        logger.info(
            "Empresa eliminada exitosamente",
            empresa_id=empresa_id,
            user_id=current_user.id
        )
        
        return ApiResponse(
            success=True,
            message="Empresa eliminada exitosamente"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al eliminar empresa", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post(
    "/{empresa_id}/suspender",
    response_model=ApiResponse,
    summary="Suspender empresa",
    description="Suspender temporalmente una empresa"
)
async def suspend_empresa(
    empresa_id: str,
    motivo: str = Query(..., description="Motivo de la suspensión"),
    current_user = Depends(get_current_user)
):
    """Suspender empresa"""
    try:
        service = EmpresaService()
        success = await service.suspend_empresa(empresa_id, motivo, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        logger.info(
            "Empresa suspendida exitosamente",
            empresa_id=empresa_id,
            motivo=motivo,
            user_id=current_user.id
        )
        
        return ApiResponse(
            success=True,
            message="Empresa suspendida exitosamente"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al suspender empresa", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post(
    "/{empresa_id}/reactivar",
    response_model=ApiResponse,
    summary="Reactivar empresa",
    description="Reactivar una empresa suspendida"
)
async def reactivate_empresa(
    empresa_id: str,
    motivo: str = Query(..., description="Motivo de la reactivación"),
    current_user = Depends(get_current_user)
):
    """Reactivar empresa"""
    try:
        service = EmpresaService()
        success = await service.reactivate_empresa(empresa_id, motivo, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        logger.info(
            "Empresa reactivada exitosamente",
            empresa_id=empresa_id,
            motivo=motivo,
            user_id=current_user.id
        )
        
        return ApiResponse(
            success=True,
            message="Empresa reactivada exitosamente"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al reactivar empresa", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get(
    "/{empresa_id}/historial",
    response_model=List[dict],
    summary="Historial de empresa",
    description="Obtener historial de cambios de una empresa"
)
async def get_empresa_historial(
    empresa_id: str,
    current_user = Depends(get_current_user)
):
    """Obtener historial de empresa"""
    try:
        service = EmpresaService()
        historial = await service.get_empresa_historial(empresa_id)
        
        if historial is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        return historial
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al obtener historial", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get(
    "/{empresa_id}/cumplimiento",
    response_model=dict,
    summary="Cumplimiento de empresa",
    description="Obtener información de cumplimiento de una empresa"
)
async def get_empresa_cumplimiento(
    empresa_id: str,
    current_user = Depends(get_current_user)
):
    """Obtener cumplimiento de empresa"""
    try:
        service = EmpresaService()
        cumplimiento = await service.get_empresa_cumplimiento(empresa_id)
        
        if cumplimiento is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )
        
        return cumplimiento
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al obtener cumplimiento", empresa_id=empresa_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        ) 