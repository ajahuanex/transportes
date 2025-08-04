import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

export interface EmpresaTransporte extends BaseEntity {
  ruc: string;
  razonSocial: string;
  razonSocialInterno?: string; // Nuevo campo para razón social interno
  nombreComercial?: string;
  nombreCorto?: string; // Nuevo campo para nombre corto
  representanteLegal: RepresentanteLegal;
  representanteLegalSecundario?: RepresentanteLegal; // Nuevo campo opcional
  direccion: Direccion;
  contacto: ContactoEmpresa;
  informacionFinanciera: InformacionFinanciera;
  cumplimiento: CumplimientoEmpresa;
  infracciones: InfraccionEmpresa[];
  sanciones: SancionEmpresa[];
  certificaciones: CertificacionEmpresa[];
  auditoria: AuditoriaEmpresa;
  historial: HistorialEmpresa[];
  estado: EstadoGeneral;
  
  // Propiedades adicionales para el formulario
  telefono: string;
  email: string;
  sitioWeb?: string;
  fechaConstitucion: Date;
  tipoEmpresa: TipoEmpresa;
  
  // Información del expediente
  expediente: ExpedienteEmpresa;
}

export enum TipoEmpresa {
  TRANSPORTE = 'TRANSPORTE',
  LOGISTICA = 'LOGISTICA',
  CARGA = 'CARGA',
  PASAJEROS = 'PASAJEROS'
}

export interface ExpedienteEmpresa {
  numero: string; // Formato: E-1234-2025
  fecha: Date;
  estado: 'ABIERTO' | 'EN_TRAMITE' | 'APROBADO' | 'RECHAZADO' | 'CERRADO';
  observaciones?: string;
  documentos: string[];
}

export interface RepresentanteLegal {
  dni: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  direccion: Direccion;
}

export interface ContactoEmpresa {
  telefono: string;
  email: string;
  celular?: string;
  fax?: string;
  web?: string;
  redesSociales?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface InformacionFinanciera {
  capitalSocial: number;
  moneda: string;
  bancoPrincipal: string;
  cuentaBancaria: string;
  estadoFinanciero: 'SOLVENTE' | 'EN_DEUDA' | 'SUSPENDIDO';
  fechaVencimientoPagos: Date;
}

export interface CumplimientoEmpresa {
  licenciaVigente: boolean;
  fechaVencimientoLicencia: Date;
  segurosVigentes: boolean;
  fechaVencimientoSeguros: Date;
  revisionTecnicaVigente: boolean;
  fechaVencimientoRevision: Date;
  certificadoOperacionVigente: boolean;
  fechaVencimientoCertificado: Date;
  cumplimientoNormativo: boolean;
  observaciones: string[];
}

export interface InfraccionEmpresa {
  id: string;
  fecha: Date;
  tipo: string;
  descripcion: string;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'APELADA';
  fechaVencimiento: Date;
  documento: string;
}

export interface SancionEmpresa {
  id: string;
  fecha: Date;
  tipo: 'MULTA' | 'SUSPENSION' | 'CANCELACION';
  descripcion: string;
  duracion?: number; // días
  estado: 'ACTIVA' | 'CUMPLIDA' | 'APELADA';
  fechaInicio: Date;
  fechaFin?: Date;
  documento: string;
}

export interface CertificacionEmpresa {
  id: string;
  tipo: string;
  numero: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
  organismoEmisor: string;
  documento: string;
}

export interface AuditoriaEmpresa {
  ultimaAuditoria: Date;
  resultado: 'APROBADA' | 'REPROBADA' | 'CON_OBSERVACIONES';
  observaciones: string[];
  proximaAuditoria: Date;
  auditorResponsable: string;
}

export interface HistorialEmpresa {
  fecha: Date;
  accion: string;
  usuario: string;
  detalles: string;
  documentos: string[];
}

export interface Direccion {
  calle: string;
  numero: string;
  distrito: string;
  provincia: string;
  departamento: string;
  codigoPostal?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  
  // Propiedades adicionales para el formulario
  direccion?: string;
  referencia?: string;
}

// Usar el enum de base.model.ts en lugar de redefinirlo

// Interfaces para requests y responses
export interface CreateEmpresaRequest {
  ruc: string;
  razonSocial: string;
  razonSocialInterno?: string;
  nombreComercial?: string;
  nombreCorto?: string;
  representanteLegal: Omit<RepresentanteLegal, 'id'>;
  representanteLegalSecundario?: Omit<RepresentanteLegal, 'id'>;
  direccion: Direccion;
  contacto: ContactoEmpresa;
  informacionFinanciera: Omit<InformacionFinanciera, 'estadoFinanciero'>;
  
  // Propiedades adicionales para el formulario
  telefono: string;
  email: string;
  sitioWeb?: string;
  fechaConstitucion: Date;
  tipoEmpresa: TipoEmpresa;
  estado: EstadoGeneral;
  fechaRegistro: string;
  
  // Información del expediente
  expediente: Omit<ExpedienteEmpresa, 'documentos'>;
}

export interface UpdateEmpresaRequest {
  razonSocial?: string;
  razonSocialInterno?: string;
  nombreComercial?: string;
  nombreCorto?: string;
  representanteLegal?: Partial<RepresentanteLegal>;
  representanteLegalSecundario?: Partial<RepresentanteLegal>;
  direccion?: Direccion;
  contacto?: ContactoEmpresa;
  informacionFinanciera?: Partial<InformacionFinanciera>;
  
  // Propiedades adicionales para el formulario
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  fechaConstitucion?: Date;
  tipoEmpresa?: TipoEmpresa;
  estado?: EstadoGeneral;
  fechaActualizacion: string;
  
  // Información del expediente
  expediente?: Partial<ExpedienteEmpresa>;
}

export interface EmpresaFilter extends BaseFilter {
  ruc?: string;
  razonSocial?: string;
  estado?: EstadoGeneral;
  distrito?: string;
  provincia?: string;
  fechaRegistroDesde?: Date;
  fechaRegistroHasta?: Date;
  cumplimientoNormativo?: boolean;
  numeroExpediente?: string;
}

export interface EmpresaListResponse {
  empresas: EmpresaTransporte[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Interfaces para soft delete
export interface DeleteEmpresaRequest extends SoftDeleteRequest {
  empresaId: string;
}

export interface RestoreEmpresaRequest extends RestoreRequest {
  empresaId: string;
}

// Interfaces para auditoría
export interface EmpresaAuditLog {
  id: string;
  empresaId: string;
  fecha: Date;
  accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RESTAURAR' | 'SUSPENDER' | 'REACTIVAR';
  usuario: string;
  detalles: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
} 