# app/schemas/__init__.py
# Importa todos tus esquemas aquí para que sean fácilmente accesibles
from .usuario_schema import UsuarioBase, UsuarioCreate, UsuarioUpdate, UsuarioInDB
from .empresa_schema import EmpresaBase, EmpresaCreate, EmpresaUpdate, EmpresaInDB
from .expediente_schema import ExpedienteBase, ExpedienteCreate, ExpedienteUpdate, ExpedienteInDB
from .resolucion_schema import ResolucionBase, ResolucionCreate, ResolucionUpdate, ResolucionInDB
from .ruta_schema import RutaBase, RutaCreate, RutaUpdate, RutaInDB
from .vehiculo_schema import VehiculoBase, VehiculoCreate, VehiculoUpdate, VehiculoInDB
from .historial_vehiculo_schema import HistorialVehiculoBase, HistorialVehiculoCreate, HistorialVehiculoUpdate, HistorialVehiculoInDB
from .tuc_schema import TUCBase, TUCCreate, TUCUpdate, TUCInDB
from .conductor_schema import ConductorBase, ConductorCreate, ConductorUpdate, ConductorInDB
from .terminal_terrestre_schema import TerminalTerrestreBase, TerminalTerrestreCreate, TerminalTerrestreUpdate, TerminalTerrestreInDB
from .infraccion_multa_schema import InfraccionMultaBase, InfraccionMultaCreate, InfraccionMultaUpdate, InfraccionMultaInDB
from .configuracion_mtc_schema import ConfiguracionMTCBase, ConfiguracionMTCCreate, ConfiguracionMTCUpdate, ConfiguracionMTCInDB
