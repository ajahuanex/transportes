// Modelos y tipos comunes del sistema

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Documento extends BaseEntity {
  nombre: string;
  tipo: TipoDocumento;
  url: string;
  tamaño: number; // en bytes
  formato: string;
  fechaSubida: Date;
  fechaVencimiento?: Date;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'VENCIDO';
  observaciones?: string;
}

export type TipoDocumento = 
  | 'RUC'
  | 'TARJETA_PROPIEDAD'
  | 'SOAT'
  | 'REVISION_TECNICA'
  | 'CERTIFICADO_EMISIONES'
  | 'LICENCIA_CONDUCIR'
  | 'CERTIFICADO_MEDICO'
  | 'ANTECEDENTES_PENALES'
  | 'ANTECEDENTES_JUDICIALES'
  | 'RESOLUCION'
  | 'EXPEDIENTE'
  | 'TUC'
  | 'OTRO';

export interface Direccion {
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface SearchFilters {
  search?: string;
  estado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  [key: string]: any;
}

export interface HistorialCambio extends BaseEntity {
  entidad: string;
  entidadId: string;
  campo: string;
  valorAnterior: any;
  valorNuevo: any;
  motivo: string;
  usuarioId: string;
}

export interface Observacion extends BaseEntity {
  titulo: string;
  descripcion: string;
  tipo: 'INFORMACION' | 'ADVERTENCIA' | 'ERROR' | 'REQUERIMIENTO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  estado: 'PENDIENTE' | 'RESUELTA' | 'CANCELADA';
  fechaLimite?: Date;
  asignadoA?: string;
}

export interface AccionNotificacion {
  id: string;
  nombre: string;
  url: string;
  icono: string;
  color: string;
}

// Enums para estados comunes
export enum EstadoGeneral {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  CANCELADO = 'CANCELADO',
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  OBSERVADO = 'OBSERVADO'
}

export enum TipoEntidad {
  EMPRESA = 'EMPRESA',
  VEHICULO = 'VEHICULO',
  CONDUCTOR = 'CONDUCTOR',
  RUTA = 'RUTA',
  EXPEDIENTE = 'EXPEDIENTE',
  RESOLUCION = 'RESOLUCION'
}

// Constantes del sistema
export const CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  NOTIFICACIONES: {
    VENCIMIENTO_ANTICIPADO: 30, // días
    MAX_RETRY_ATTEMPTS: 3
  }
} as const; 