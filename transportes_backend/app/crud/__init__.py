# app/crud/__init__.py
# Importa tus instancias CRUD aquí para facilitar el acceso
from .usuario_crud import crud_usuario
from .empresa_crud import crud_empresa
from .expediente_crud import crud_expediente
from .resolucion_crud import crud_resolucion
from .ruta_crud import crud_ruta
from .vehiculo_crud import crud_vehiculo
from .historial_vehiculo_crud import crud_historial_vehiculo
from .tuc_crud import crud_tuc
from .conductor_crud import crud_conductor
from .terminal_terrestre_crud import crud_terminal_terrestre
from .infraccion_multa_crud import crud_infraccion_multa
from .configuracion_mtc_crud import crud_configuracion_mtc
