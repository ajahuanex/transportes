// Interfaces base para soft delete y auditoría
export interface SoftDelete {
  eliminado: boolean;
  fechaEliminacion?: Date;
  usuarioEliminacion?: string;
  motivoEliminacion?: string;
}

export interface AuditoriaBase {
  fechaCreacion: Date;
  usuarioCreacion: string;
  fechaModificacion: Date;
  usuarioModificacion: string;
  version: number;
}

// Interfaz base para todas las entidades
export interface BaseEntity extends SoftDelete, AuditoriaBase {
  id: string;
}

// Enums comunes
export enum EstadoGeneral {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  CANCELADO = 'CANCELADO',
  PENDIENTE = 'PENDIENTE',
  ELIMINADO = 'ELIMINADO'
}

// Interfaces para operaciones de soft delete
export interface SoftDeleteRequest {
  motivo: string;
  usuario: string;
}

export interface RestoreRequest {
  usuario: string;
  motivo: string;
}

// Interfaces para filtros que incluyen elementos eliminados
export interface BaseFilter {
  incluirEliminados?: boolean;
  soloEliminados?: boolean;
  fechaEliminacionDesde?: Date;
  fechaEliminacionHasta?: Date;
} 