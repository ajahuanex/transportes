# app/api/v1/endpoints/api.py
from fastapi import APIRouter

from app.api.v1.endpoints import usuarios
from app.api.v1.endpoints import empresas
from app.api.v1.endpoints import expedientes
from app.api.v1.endpoints import resoluciones
from app.api.v1.endpoints import rutas
from app.api.v1.endpoints import vehiculos
from app.api.v1.endpoints import historial_vehiculos
from app.api.v1.endpoints import tucs
from app.api.v1.endpoints import conductores
from app.api.v1.endpoints import terminales_terrestres
from app.api.v1.endpoints import infracciones_multas
from app.api.v1.endpoints import configuracion_mtc
from app.api.v1.endpoints import papeletas

api_router = APIRouter()
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
api_router.include_router(empresas.router, prefix="/empresas", tags=["Empresas"])
api_router.include_router(expedientes.router, prefix="/expedientes", tags=["Expedientes"])
api_router.include_router(resoluciones.router, prefix="/resoluciones", tags=["Resoluciones"])
api_router.include_router(rutas.router, prefix="/rutas", tags=["Rutas"])
api_router.include_router(vehiculos.router, prefix="/vehiculos", tags=["Vehículos"])
api_router.include_router(historial_vehiculos.router, prefix="/historial-vehiculos", tags=["Historial de Vehículos"])
api_router.include_router(tucs.router, prefix="/tucs", tags=["TUCs"])
api_router.include_router(conductores.router, prefix="/conductores", tags=["Conductores"])
api_router.include_router(terminales_terrestres.router, prefix="/terminales-terrestres", tags=["Terminales Terrestres"])
api_router.include_router(infracciones_multas.router, prefix="/infracciones-multas", tags=["Infracciones y Multas"])
api_router.include_router(configuracion_mtc.router, prefix="/configuracion-mtc", tags=["Configuración MTC"])
api_router.include_router(papeletas.router, prefix="/papeletas", tags=["Papeletas"])
