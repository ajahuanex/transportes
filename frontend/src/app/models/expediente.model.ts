import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

// Estados específicos de un expediente
export enum EstadoExpediente {
  ABIERTO = 'ABIERTO',
  EN_TRAMITE = 'EN_TRAMITE',
  PENDIENTE_DOCUMENTACION = 'PENDIENTE_DOCUMENTACION',
  EN_REVISION = 'EN_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  CERRADO = 'CERRADO',
  SUSPENDIDO = 'SUSPENDIDO'
}

// Tipos de expediente
export enum TipoExpediente {
  EMPRESA_TRANSPORTE = 'EMPRESA_TRANSPORTE',
  VEHICULO = 'VEHICULO',
  CONDUCTOR = 'CONDUCTOR',
  RUTA = 'RUTA',
  TUC = 'TUC',
  RESOLUCION = 'RESOLUCION',
  OTRO = 'OTRO'
}

// Tipos de trámite
export enum TipoTramite {
  SOLICITUD_INICIAL = 'SOLICITUD_INICIAL',
  RENOVACION = 'RENOVACION',
  MODIFICACION = 'MODIFICACION',
  CANCELACION = 'CANCELACION',
  SUSPENSION = 'SUSPENSION',
  REACTIVACION = 'REACTIVACION'
}

// Interfaz para documentos del expediente
export interface DocumentoExpediente {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  fechaSubida: Date;
  usuarioSubida: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observaciones?: string;
}

// Interfaz para seguimiento del expediente
export interface SeguimientoExpediente {
  id: string;
  fecha: Date;
  usuario: string;
  accion: string;
  descripcion: string;
  estadoAnterior?: EstadoExpediente;
  estadoNuevo?: EstadoExpediente;
  observaciones?: string;
}

// Interfaz principal del expediente según nuevas reglas DRTC
export interface Expediente extends BaseEntity {
  nroExpediente: string; // Formato: E-XXXX-YYYY
  tipoTramite: string; // RENOVACION_HABILITACION_VEHICULAR, etc.
  estado: string; // EN_EVALUACION, APROBADO, RECHAZADO, etc.
  estaActivo: boolean;
  resolucionFinalId?: string;
  
  // Campos adicionales para compatibilidad
  numero?: string; // Formato: E-XXXX-YYYY
  tipo?: TipoExpediente;
  fechaApertura?: Date;
  fechaCierre?: Date;
  
  // Información del solicitante
  solicitante?: {
    tipo: 'EMPRESA' | 'PERSONA_NATURAL';
    id: string; // ID de la empresa o persona
    nombre: string;
    documento: string; // RUC o DNI
  };
  
  // Información del trámite
  descripcion?: string;
  observaciones?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  
  // Documentos
  documentos?: DocumentoExpediente[];
  
  // Seguimiento
  seguimiento?: SeguimientoExpediente[];
  
  // Información adicional
  responsable?: string; // Usuario responsable del expediente
  fechaLimite?: Date;
  tags?: string[]; // Etiquetas para categorización
  
  // Relaciones
  expedientePadre?: string; // Para expedientes relacionados
  expedientesHijos?: string[]; // Expedientes derivados
}

// Interfaces para operaciones CRUD
export interface CreateExpedienteRequest {
  numero: string;
  tipo: TipoExpediente;
  tipoTramite: TipoTramite;
  solicitante: {
    tipo: 'EMPRESA' | 'PERSONA_NATURAL';
    id: string;
    nombre: string;
    documento: string;
  };
  descripcion: string;
  observaciones?: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  responsable?: string;
  fechaLimite?: Date;
  tags?: string[];
  expedientePadre?: string;
}

export interface UpdateExpedienteRequest {
  estado?: EstadoExpediente;
  descripcion?: string;
  observaciones?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  responsable?: string;
  fechaLimite?: Date;
  tags?: string[];
  fechaCierre?: Date;
}

export interface ExpedienteFilter extends BaseFilter {
  numero?: string;
  tipo?: TipoExpediente;
  tipoTramite?: string;
  estado?: string;
  solicitanteId?: string;
  solicitanteTipo?: 'EMPRESA' | 'PERSONA_NATURAL';
  responsable?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  fechaAperturaDesde?: Date;
  fechaAperturaHasta?: Date;
  fechaLimiteDesde?: Date;
  fechaLimiteHasta?: Date;
  tags?: string[];
  busquedaGeneral?: string; // Búsqueda general por número, tipo, trámite, solicitante
}

// Interfaces para respuestas
export interface ExpedienteListResponse {
  expedientes: Expediente[];
  total: number;
  pagina: number;
  porPagina: number;
}

// Interfaces para soft delete
export interface DeleteExpedienteRequest {
  id: string;
  motivo: string;
  usuario: string;
}

export interface RestoreExpedienteRequest {
  id: string;
  usuario: string;
  motivo: string;
}

// Interfaces para auditoría
export interface ExpedienteAuditLog {
  id: string;
  expedienteId: string;
  fecha: Date;
  usuario: string;
  accion: string;
  detalles: any;
  ip?: string;
  userAgent?: string;
}

// Interfaces para estadísticas
export interface ExpedienteStats {
  total: number;
  porEstado: Record<EstadoExpediente, number>;
  porTipo: Record<TipoExpediente, number>;
  porPrioridad: Record<string, number>;
  promedioTiempoResolucion: number; // en días
  expedientesVencidos: number;
  expedientesUrgentes: number;
} 