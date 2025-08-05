import { BaseEntity, SoftDelete, AuditoriaBase } from './base.model';

export interface TUC extends BaseEntity, SoftDelete {
  nroTuc: string;
  vehiculoId: string;
  vehiculoPlaca?: string;
  vehiculoMarca?: string;
  vehiculoModelo?: string;
  empresaId: string;
  empresaNombre?: string;
  resolucionPadreId?: string;
  resolucionNumero?: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: EstadoTUC;
  razonDescarte?: string;
  estaActivo: boolean;
  documentoId?: string;
  qrVerificationUrl?: string;
  auditoria: AuditoriaBase;
}

export interface CreateTUCRequest {
  vehiculoId: string;
  empresaId: string;
  resolucionPadreId?: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
}

export interface UpdateTUCRequest {
  fechaVencimiento?: Date;
  estado?: EstadoTUC;
  razonDescarte?: string;
}

export interface DeleteTUCRequest {
  tucId: string;
  motivo: string;
  usuarioEliminacion: string;
}

export interface RestoreTUCRequest {
  tucId: string;
  usuarioRestauracion: string;
}

export interface TUCListResponse {
  tucs: TUC[];
  total: number;
  totalPaginas: number;
}

export enum EstadoTUC {
  VIGENTE = 'VIGENTE',
  DADA_DE_BAJA = 'DADA_DE_BAJA',
  DESECHADA = 'DESECHADA',
  VENCIDA = 'VENCIDA',
  SUSPENDIDA = 'SUSPENDIDA'
}

export interface TUCStats {
  total: number;
  vigentes: number;
  vencidos: number;
  dadosDeBaja: number;
  desechados: number;
  suspendidos: number;
} 