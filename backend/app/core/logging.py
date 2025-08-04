"""
Configuración de logging estructurado
"""

import sys
import logging
from typing import Any, Dict
import structlog
from structlog.stdlib import LoggerFactory
from structlog.processors import JSONRenderer, TimeStamper, add_log_level
from structlog.types import Processor

from app.core.config import settings

def setup_logging():
    """Configurar logging estructurado"""
    
    # Configurar procesadores de structlog
    processors: list[Processor] = [
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]
    
    # En desarrollo, usar formato legible
    if settings.DEBUG:
        processors.append(structlog.dev.ConsoleRenderer())
    else:
        # En producción, usar JSON
        processors.append(JSONRenderer())
    
    # Configurar structlog
    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Configurar logging estándar
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper()),
    )
    
    # Configurar logging a archivo si se especifica
    if settings.LOG_FILE:
        file_handler = logging.FileHandler(settings.LOG_FILE)
        file_handler.setFormatter(logging.Formatter("%(message)s"))
        logging.getLogger().addHandler(file_handler)

def get_logger(name: str = None) -> structlog.BoundLogger:
    """Obtener logger estructurado"""
    return structlog.get_logger(name)

# Logger global
logger = get_logger(__name__)

class AuditLogger:
    """Logger especializado para auditoría"""
    
    def __init__(self):
        self.logger = get_logger("audit")
    
    def log_action(
        self,
        action: str,
        user_id: str,
        entity: str,
        entity_id: str,
        details: Dict[str, Any] = None,
        success: bool = True
    ):
        """Registrar acción de auditoría"""
        self.logger.info(
            "Acción de auditoría",
            action=action,
            user_id=user_id,
            entity=entity,
            entity_id=entity_id,
            details=details or {},
            success=success,
            event_type="audit"
        )
    
    def log_login(self, user_id: str, success: bool, ip_address: str = None):
        """Registrar intento de login"""
        self.logger.info(
            "Intento de login",
            user_id=user_id,
            success=success,
            ip_address=ip_address,
            event_type="login"
        )
    
    def log_data_access(
        self,
        user_id: str,
        entity: str,
        entity_id: str,
        operation: str
    ):
        """Registrar acceso a datos"""
        self.logger.info(
            "Acceso a datos",
            user_id=user_id,
            entity=entity,
            entity_id=entity_id,
            operation=operation,
            event_type="data_access"
        )

# Instancia global del audit logger
audit_logger = AuditLogger()

class SecurityLogger:
    """Logger especializado para eventos de seguridad"""
    
    def __init__(self):
        self.logger = get_logger("security")
    
    def log_security_event(
        self,
        event_type: str,
        user_id: str = None,
        ip_address: str = None,
        details: Dict[str, Any] = None,
        severity: str = "INFO"
    ):
        """Registrar evento de seguridad"""
        self.logger.warning(
            "Evento de seguridad",
            event_type=event_type,
            user_id=user_id,
            ip_address=ip_address,
            details=details or {},
            severity=severity,
            event_category="security"
        )
    
    def log_unauthorized_access(
        self,
        user_id: str = None,
        ip_address: str = None,
        resource: str = None
    ):
        """Registrar acceso no autorizado"""
        self.log_security_event(
            event_type="unauthorized_access",
            user_id=user_id,
            ip_address=ip_address,
            details={"resource": resource},
            severity="WARNING"
        )
    
    def log_suspicious_activity(
        self,
        user_id: str = None,
        ip_address: str = None,
        activity: str = None
    ):
        """Registrar actividad sospechosa"""
        self.log_security_event(
            event_type="suspicious_activity",
            user_id=user_id,
            ip_address=ip_address,
            details={"activity": activity},
            severity="ERROR"
        )

# Instancia global del security logger
security_logger = SecurityLogger() 