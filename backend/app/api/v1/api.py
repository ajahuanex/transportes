"""
Router principal de la API v1
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    empresas,
    vehiculos,
    conductores,
    rutas,
    expedientes,
    resoluciones,
    tucs,
    notificaciones,
    reportes,
    usuarios,
    documentos
)

api_router = APIRouter()

# Incluir todos los routers de endpoints
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Autenticación"]
)

api_router.include_router(
    usuarios.router,
    prefix="/usuarios",
    tags=["Usuarios"]
)

api_router.include_router(
    empresas.router,
    prefix="/empresas",
    tags=["Empresas de Transporte"]
)

api_router.include_router(
    vehiculos.router,
    prefix="/vehiculos",
    tags=["Vehículos"]
)

api_router.include_router(
    conductores.router,
    prefix="/conductores",
    tags=["Conductores"]
)

api_router.include_router(
    rutas.router,
    prefix="/rutas",
    tags=["Rutas"]
)

api_router.include_router(
    expedientes.router,
    prefix="/expedientes",
    tags=["Expedientes"]
)

api_router.include_router(
    resoluciones.router,
    prefix="/resoluciones",
    tags=["Resoluciones"]
)

api_router.include_router(
    tucs.router,
    prefix="/tucs",
    tags=["TUC - Tarjetas Únicas de Circulación"]
)

api_router.include_router(
    notificaciones.router,
    prefix="/notificaciones",
    tags=["Notificaciones"]
)

api_router.include_router(
    reportes.router,
    prefix="/reportes",
    tags=["Reportes"]
)

api_router.include_router(
    documentos.router,
    prefix="/documentos",
    tags=["Documentos"]
) 