import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

export interface Resolucion extends BaseEntity {
  nroResolucion: string;
  empresaId: string;                    // Solo resoluciones PADRE tienen empresaId
  fechaEmision: Date;
  fechaVigenciaInicio: Date;
  fechaVigenciaFin: Date;
  tipoResolucion: 'PADRE' | 'HIJO';
  resolucionPadreId?: string;           // Solo para resoluciones HIJO
  tipoTramite: TipoTramite;
  descripcion: string;
  expedienteId: string;
  documentoId?: string;
  estaActivo: boolean;
  
  // Campos derivados para display
  empresaNombre?: string;
  resolucionPadreNumero?: string;
  expedienteNumero?: string;
}

export enum TipoTramite {
  HABILITACION_VEHICULAR = 'HABILITACION_VEHICULAR',
  INCREMENTO = 'INCREMENTO',
  SUSTITUCION = 'SUSTITUCION',
  RENOVACION_HABILITACION_VEHICULAR = 'RENOVACION_HABILITACION_VEHICULAR'
}

// Interfaces para requests y responses
export interface CreateResolucionRequest {
  nroResolucion: string;
  empresaId: string;
  fechaEmision: Date;
  fechaVigenciaInicio: Date;
  fechaVigenciaFin: Date;
  tipoResolucion: 'PADRE' | 'HIJO';
  resolucionPadreId?: string;
  tipoTramite: TipoTramite;
  descripcion: string;
  expedienteId: string;
  documentoId?: string;
}

export interface UpdateResolucionRequest {
  nroResolucion?: string;
  fechaEmision?: Date;
  fechaVigenciaInicio?: Date;
  fechaVigenciaFin?: Date;
  tipoResolucion?: 'PADRE' | 'HIJO';
  resolucionPadreId?: string;
  tipoTramite?: TipoTramite;
  descripcion?: string;
  expedienteId?: string;
  documentoId?: string;
}

export interface ResolucionFilter extends BaseFilter {
  nroResolucion?: string;
  empresaId?: string;
  empresaNombre?: string;
  tipoResolucion?: 'PADRE' | 'HIJO';
  resolucionPadreId?: string;
  tipoTramite?: TipoTramite;
  estado?: EstadoGeneral;
  fechaEmisionDesde?: Date;
  fechaEmisionHasta?: Date;
  fechaVigenciaDesde?: Date;
  fechaVigenciaHasta?: Date;
}

export interface ResolucionListResponse {
  resoluciones: Resolucion[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Interfaces para soft delete
export interface DeleteResolucionRequest extends SoftDeleteRequest {
  resolucionId: string;
}

export interface RestoreResolucionRequest extends RestoreRequest {
  resolucionId: string;
}

// Interfaces para auditoría
export interface ResolucionAuditLog {
  id: string;
  resolucionId: string;
  fecha: Date;
  accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RESTAURAR' | 'SUSPENDER' | 'REACTIVAR';
  usuario: string;
  detalles: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
}

// Interfaces para reportes
export interface ResolucionReport {
  totalResoluciones: number;
  resolucionesActivas: number;
  resolucionesVigentes: number;
  resolucionesVencidas: number;
  distribucionPorTipo: {
    tipo: TipoTramite;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorEmpresa: {
    empresa: string;
    cantidad: number;
    porcentaje: number;
  }[];
} 