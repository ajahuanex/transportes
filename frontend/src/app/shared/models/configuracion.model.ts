import { BaseEntity } from './common.model';

// ============================================================================
// ENUMS PRINCIPALES DEL SISTEMA
// ============================================================================

// Estados de Empresa
export enum EstadoEmpresa {
  HABILITADA = 'HABILITADA',
  SUSPENDIDA = 'SUSPENDIDA',
  CANCELADA = 'CANCELADA'
}

// Estados de Vehículo
export enum EstadoVehiculo {
  ACTIVO = 'ACTIVO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  SUSPENDIDO = 'SUSPENDIDO',
  BAJA = 'BAJA'
}

// Estados de Conductor
export enum EstadoConductor {
  HABILITADO = 'HABILITADO',
  SUSPENDIDO = 'SUSPENDIDO',
  VENCIDO = 'VENCIDO'
}

// Estados de TUC
export enum EstadoTUC {
  VIGENTE = 'VIGENTE',
  DADA_DE_BAJA = 'DADA_DE_BAJA',
  DESECHADA = 'DESECHADA'
}

// Estados de Expediente
export enum EstadoExpediente {
  EN_EVALUACION = 'EN_EVALUACION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  OBSERVADO = 'OBSERVADO'
}

// Tipos de Resolución
export enum TipoResolucion {
  PADRE = 'PADRE',
  HIJO = 'HIJO'
}

// Tipos de Trámite
export enum TipoTramite {
  HABILITACION_VEHICULAR = 'HABILITACION_VEHICULAR',
  INCREMENTO = 'INCREMENTO',
  SUSTITUCION = 'SUSTITUCION',
  RENOVACION_HABILITACION_VEHICULAR = 'RENOVACION_HABILITACION_VEHICULAR'
}

// Estados de Papeleta
export enum EstadoPapeleta {
  EMITIDA = 'EMITIDA',
  PAGADA = 'PAGADA',
  IMPUGNADA = 'IMPUGNADA'
}

// Tipos de Documento
export enum TipoDocumento {
  RESOLUCION = 'RESOLUCION',
  TUC = 'TUC',
  CERTIFICADO = 'CERTIFICADO'
}

// Tipos de Destinatario de Notificación
export enum TipoDestinatario {
  EMPRESA = 'EMPRESA',
  USUARIO = 'USUARIO'
}

// Estados de Consulta Externa
export enum EstadoConsulta {
  EXITOSA = 'EXITOSA',
  FALLIDA = 'FALLIDA'
}

// Tipos de Cambio en Historial
export enum TipoCambioVehiculo {
  CAMBIO_EMPRESA = 'CAMBIO_EMPRESA',
  CAMBIO_ESTADO = 'CAMBIO_ESTADO',
  DESVINCULACION = 'DESVINCULACION',
  CAMBIO_PLACA = 'CAMBIO_PLACA'
}

export enum TipoCambioConductor {
  ASOCIACION_EMPRESA = 'ASOCIACION_EMPRESA',
  CAMBIO_LICENCIA = 'CAMBIO_LICENCIA',
  INFRACCION = 'INFRACCION'
}

export enum TipoCambioExpediente {
  CAMBIO_ESTADO = 'CAMBIO_ESTADO',
  ADJUNTAR_DOCUMENTO = 'ADJUNTAR_DOCUMENTO'
}

export enum TipoCambioEmpresa {
  APERTURA_TRAMITE = 'APERTURA_TRAMITE',
  RESOLUCION_EMITIDA = 'RESOLUCION_EMITIDA',
  CAMBIO_ESTADO = 'CAMBIO_ESTADO'
}

// ============================================================================
// MODELOS DE CONFIGURACIÓN
// ============================================================================

// Configuración de Enum
export interface ConfiguracionEnum extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string; // 'ESTADO_EMPRESA', 'ESTADO_VEHICULO', etc.
  valor: string;
  orden: number;
  estaActivo: boolean;
  color?: string; // Para badges en la UI
  icono?: string; // Para iconos en la UI
  eliminado: boolean;
  fechaEliminacion?: Date;
  usuarioEliminacion?: string;
  motivoEliminacion?: string;
  version: number;
}

// Configuración de Sistema
export interface ConfiguracionSistema extends BaseEntity {
  clave: string;
  valor: string;
  descripcion: string;
  tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  categoria: string;
  editable: boolean;
  visible: boolean;
  eliminado: boolean;
  fechaEliminacion?: Date;
  usuarioEliminacion?: string;
  motivoEliminacion?: string;
  version: number;
}

// Catálogo de Configuraciones
export interface CatalogoConfiguracion {
  id: string;
  nombre: string;
  descripcion: string;
  enums: ConfiguracionEnum[];
  configuraciones: ConfiguracionSistema[];
}

// ============================================================================
// REQUEST/RESPONSE MODELS
// ============================================================================

export interface CreateConfiguracionEnumRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  valor: string;
  orden: number;
  color?: string;
  icono?: string;
}

export interface UpdateConfiguracionEnumRequest {
  nombre?: string;
  descripcion?: string;
  orden?: number;
  color?: string;
  icono?: string;
  estaActivo?: boolean;
}

export interface CreateConfiguracionSistemaRequest {
  clave: string;
  valor: string;
  descripcion: string;
  tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  categoria: string;
  editable: boolean;
  visible: boolean;
}

export interface UpdateConfiguracionSistemaRequest {
  valor?: string;
  descripcion?: string;
  editable?: boolean;
  visible?: boolean;
}

export interface ConfiguracionListResponse {
  configuraciones: ConfiguracionEnum[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface ConfiguracionSistemaListResponse {
  configuraciones: ConfiguracionSistema[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type EstadoGeneral = 
  | EstadoEmpresa 
  | EstadoVehiculo 
  | EstadoConductor 
  | EstadoTUC 
  | EstadoExpediente;

export type TipoGeneral = 
  | TipoResolucion 
  | TipoTramite 
  | TipoDocumento 
  | TipoDestinatario;

// ============================================================================
// CONSTANTES DE CATEGORÍAS
// ============================================================================

export const CATEGORIAS_CONFIGURACION = {
  ESTADOS: {
    EMPRESA: 'ESTADO_EMPRESA',
    VEHICULO: 'ESTADO_VEHICULO',
    CONDUCTOR: 'ESTADO_CONDUCTOR',
    TUC: 'ESTADO_TUC',
    EXPEDIENTE: 'ESTADO_EXPEDIENTE',
    PAPELETA: 'ESTADO_PAPELETA'
  },
  TIPOS: {
    RESOLUCION: 'TIPO_RESOLUCION',
    TRAMITE: 'TIPO_TRAMITE',
    DOCUMENTO: 'TIPO_DOCUMENTO',
    DESTINATARIO: 'TIPO_DESTINATARIO'
  },
  HISTORIAL: {
    CAMBIO_VEHICULO: 'TIPO_CAMBIO_VEHICULO',
    CAMBIO_CONDUCTOR: 'TIPO_CAMBIO_CONDUCTOR',
    CAMBIO_EXPEDIENTE: 'TIPO_CAMBIO_EXPEDIENTE',
    CAMBIO_EMPRESA: 'TIPO_CAMBIO_EMPRESA'
  },
  SISTEMA: {
    GENERAL: 'SISTEMA_GENERAL',
    NOTIFICACIONES: 'SISTEMA_NOTIFICACIONES',
    REPORTES: 'SISTEMA_REPORTES',
    SEGURIDAD: 'SISTEMA_SEGURIDAD'
  }
} as const;

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

export function obtenerEstadosEmpresa(): ConfiguracionEnum[] {
  return Object.values(EstadoEmpresa).map((estado, index) => ({
    id: `estado-empresa-${estado}`,
    codigo: estado,
    nombre: estado.replace('_', ' '),
    descripcion: `Estado ${estado.toLowerCase()} para empresas`,
    categoria: CATEGORIAS_CONFIGURACION.ESTADOS.EMPRESA,
    valor: estado,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorEstado(estado),
    icono: obtenerIconoEstado(estado),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

export function obtenerEstadosVehiculo(): ConfiguracionEnum[] {
  return Object.values(EstadoVehiculo).map((estado, index) => ({
    id: `estado-vehiculo-${estado}`,
    codigo: estado,
    nombre: estado.replace('_', ' '),
    descripcion: `Estado ${estado.toLowerCase()} para vehículos`,
    categoria: CATEGORIAS_CONFIGURACION.ESTADOS.VEHICULO,
    valor: estado,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorEstado(estado),
    icono: obtenerIconoEstado(estado),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

export function obtenerEstadosConductor(): ConfiguracionEnum[] {
  return Object.values(EstadoConductor).map((estado, index) => ({
    id: `estado-conductor-${estado}`,
    codigo: estado,
    nombre: estado.replace('_', ' '),
    descripcion: `Estado ${estado.toLowerCase()} para conductores`,
    categoria: CATEGORIAS_CONFIGURACION.ESTADOS.CONDUCTOR,
    valor: estado,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorEstado(estado),
    icono: obtenerIconoEstado(estado),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

export function obtenerEstadosTUC(): ConfiguracionEnum[] {
  return Object.values(EstadoTUC).map((estado, index) => ({
    id: `estado-tuc-${estado}`,
    codigo: estado,
    nombre: estado.replace('_', ' '),
    descripcion: `Estado ${estado.toLowerCase()} para TUCs`,
    categoria: CATEGORIAS_CONFIGURACION.ESTADOS.TUC,
    valor: estado,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorEstado(estado),
    icono: obtenerIconoEstado(estado),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

export function obtenerTiposResolucion(): ConfiguracionEnum[] {
  return Object.values(TipoResolucion).map((tipo, index) => ({
    id: `tipo-resolucion-${tipo}`,
    codigo: tipo,
    nombre: tipo,
    descripcion: `Tipo de resolución: ${tipo.toLowerCase()}`,
    categoria: CATEGORIAS_CONFIGURACION.TIPOS.RESOLUCION,
    valor: tipo,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorTipo(tipo),
    icono: obtenerIconoTipo(tipo),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

export function obtenerTiposTramite(): ConfiguracionEnum[] {
  return Object.values(TipoTramite).map((tipo, index) => ({
    id: `tipo-tramite-${tipo}`,
    codigo: tipo,
    nombre: tipo.replace('_', ' '),
    descripcion: `Tipo de trámite: ${tipo.toLowerCase().replace('_', ' ')}`,
    categoria: CATEGORIAS_CONFIGURACION.TIPOS.TRAMITE,
    valor: tipo,
    orden: index + 1,
    estaActivo: true,
    color: obtenerColorTipo(tipo),
    icono: obtenerIconoTipo(tipo),
    eliminado: false,
    fechaEliminacion: undefined,
    usuarioEliminacion: undefined,
    motivoEliminacion: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema',
    updatedBy: 'sistema',
    version: 1
  }));
}

// ============================================================================
// FUNCIONES DE COLORES E ICONOS
// ============================================================================

export function obtenerColorEstado(estado: string): string {
  // Mapeo de estados a colores
  const mapeoColores: Record<string, string> = {
    // Estados de Empresa
    'HABILITADA': 'success',
    'SUSPENDIDA': 'warning',
    'CANCELADA': 'danger',
    
    // Estados de Vehículo
    'ACTIVO': 'success',
    'MANTENIMIENTO': 'info',
    'BAJA': 'danger',
    
    // Estados de Conductor
    'HABILITADO': 'success',
    'VENCIDO': 'danger',
    
    // Estados de TUC
    'VIGENTE': 'success',
    'DADA_DE_BAJA': 'warning',
    'DESECHADA': 'danger',
    
    // Estados de Expediente
    'EN_EVALUACION': 'info',
    'APROBADO': 'success',
    'RECHAZADO': 'danger',
    'OBSERVADO': 'warning'
  };
  
  return mapeoColores[estado] || 'secondary';
}

export function obtenerIconoEstado(estado: string): string {
  // Mapeo de estados a iconos
  const mapeoIconos: Record<string, string> = {
    // Estados de Empresa
    'HABILITADA': 'check-circle',
    'SUSPENDIDA': 'pause-circle',
    'CANCELADA': 'x-circle',
    
    // Estados de Vehículo
    'ACTIVO': 'check-circle',
    'MANTENIMIENTO': 'wrench',
    'BAJA': 'x-circle',
    
    // Estados de Conductor
    'HABILITADO': 'check-circle',
    'VENCIDO': 'clock',
    
    // Estados de TUC
    'VIGENTE': 'check-circle',
    'DADA_DE_BAJA': 'pause-circle',
    'DESECHADA': 'trash',
    
    // Estados de Expediente
    'EN_EVALUACION': 'clock',
    'APROBADO': 'check-circle',
    'RECHAZADO': 'x-circle',
    'OBSERVADO': 'alert-circle'
  };
  
  return mapeoIconos[estado] || 'help-circle';
}

export function obtenerColorTipo(tipo: string): string {
  const colores: Record<string, string> = {
    // Tipos de Resolución
    [TipoResolucion.PADRE]: 'primary',
    [TipoResolucion.HIJO]: 'info',
    
    // Tipos de Trámite
    [TipoTramite.HABILITACION_VEHICULAR]: 'success',
    [TipoTramite.INCREMENTO]: 'warning',
    [TipoTramite.SUSTITUCION]: 'info',
    [TipoTramite.RENOVACION_HABILITACION_VEHICULAR]: 'primary',
    
    // Tipos de Documento
    [TipoDocumento.RESOLUCION]: 'primary',
    [TipoDocumento.TUC]: 'success',
    [TipoDocumento.CERTIFICADO]: 'info'
  };
  
  return colores[tipo] || 'secondary';
}

export function obtenerIconoTipo(tipo: string): string {
  const iconos: Record<string, string> = {
    // Tipos de Resolución
    [TipoResolucion.PADRE]: 'file-text',
    [TipoResolucion.HIJO]: 'file',
    
    // Tipos de Trámite
    [TipoTramite.HABILITACION_VEHICULAR]: 'check-circle',
    [TipoTramite.INCREMENTO]: 'plus-circle',
    [TipoTramite.SUSTITUCION]: 'refresh-cw',
    [TipoTramite.RENOVACION_HABILITACION_VEHICULAR]: 'rotate-cw',
    
    // Tipos de Documento
    [TipoDocumento.RESOLUCION]: 'file-text',
    [TipoDocumento.TUC]: 'credit-card',
    [TipoDocumento.CERTIFICADO]: 'award'
  };
  
  return iconos[tipo] || 'file';
} 