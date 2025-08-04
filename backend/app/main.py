"""
Sistema de Gestión de Transportes - DRTC Puno
Backend FastAPI
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, close_db
from app.api.v1.api import api_router
from app.core.logging import setup_logging

# Configurar logging
setup_logging()
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestión del ciclo de vida de la aplicación"""
    # Startup
    logger.info("Iniciando Sistema de Gestión de Transportes - DRTC Puno")
    await init_db()
    logger.info("Base de datos inicializada")
    
    yield
    
    # Shutdown
    logger.info("Cerrando aplicación")
    await close_db()
    logger.info("Aplicación cerrada")

def create_application() -> FastAPI:
    """Crear y configurar la aplicación FastAPI"""
    
    app = FastAPI(
        title="Sistema de Gestión de Transportes - DRTC Puno",
        description="""
        Sistema integral de gestión de transportes para la Dirección Regional de Transportes y Comunicaciones de Puno.
        
        ## Funcionalidades
        
        * **Gestión de Empresas**: Registro, renovación y control de empresas de transporte
        * **Gestión de Vehículos**: Control de vehículos, documentos y mantenimiento
        * **Gestión de Conductores**: Registro y control de conductores
        * **Gestión de Rutas**: Diseño y aprobación de rutas de transporte
        * **Expedientes**: Seguimiento de trámites y documentación
        * **Resoluciones**: Generación y control de resoluciones oficiales
        * **TUC**: Generación de Tarjetas Únicas de Circulación
        * **Reportes**: Reportes estadísticos y de cumplimiento
        * **Notificaciones**: Sistema de alertas y comunicaciones
        
        ## Autenticación
        
        El sistema utiliza JWT tokens para la autenticación. Incluye el token en el header:
        `Authorization: Bearer <token>`
        """,
        version="1.0.0",
        contact={
            "name": "DRTC Puno",
            "email": "drtc.puno@mtc.gob.pe",
            "url": "https://www.gob.pe/mtc"
        },
        license_info={
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        },
        lifespan=lifespan
    )
    
    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Incluir rutas de la API
    app.include_router(api_router, prefix="/api/v1")
    
    # Middleware para logging de requests
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        logger.info(
            "Request iniciado",
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host if request.client else None
        )
        
        response = await call_next(request)
        
        logger.info(
            "Request completado",
            method=request.method,
            url=str(request.url),
            status_code=response.status_code
        )
        
        return response
    
    # Exception handler global
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(
            "Excepción no manejada",
            exception=str(exc),
            url=str(request.url),
            method=request.method
        )
        
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Error interno del servidor",
                "detail": str(exc) if settings.DEBUG else "Error interno"
            }
        )
    
    return app

# Crear instancia de la aplicación
app = create_application()

# Ruta de salud
@app.get("/health")
async def health_check():
    """Verificar el estado de salud de la aplicación"""
    return {
        "status": "healthy",
        "service": "Sistema de Gestión de Transportes - DRTC Puno",
        "version": "1.0.0"
    }

# Ruta raíz
@app.get("/")
async def root():
    """Ruta raíz de la aplicación"""
    return {
        "message": "Sistema de Gestión de Transportes - DRTC Puno",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    ) 