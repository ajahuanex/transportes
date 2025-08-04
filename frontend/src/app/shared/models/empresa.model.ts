import { BaseEntity, Documento, Direccion } from './common.model';

export interface EmpresaTransporte extends BaseEntity {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  tipoEmpresa: TipoEmpresa;
  categoria: CategoriaEmpresa;
  estado: EstadoEmpresa;
  fechaRegistro: Date;
  fechaVencimiento: Date;
  direccion: Direccion;
  representanteLegal: RepresentanteLegal;
  documentos: Documento[];
  rutas: string[]; // IDs de rutas
  vehiculos: string[]; // IDs de vehículos
  resoluciones: string[]; // IDs de resoluciones
  expedientes: string[]; // IDs de expedientes
  contacto: ContactoEmpresa;
  informacionFinanciera: InformacionFinanciera;
  cumplimiento: CumplimientoEmpresa;
  historial: HistorialEmpresa[];
}

export interface RepresentanteLegal {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  direccion: string;
  cargo: string;
  fechaDesignacion: Date;
  documentoDesignacion: Documento;
}

export interface ContactoEmpresa {
  telefono: string;
  email: string;
  web?: string;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  horarioAtencion: string;
  personaContacto: string;
}

export interface InformacionFinanciera {
  capitalSocial: number;
  moneda: 'PEN' | 'USD';
  fechaConstitución: Date;
  tipoOrganizacion: 'SOCIEDAD_ANONIMA' | 'SOCIEDAD_COMERCIAL' | 'EMPRESA_INDIVIDUAL' | 'OTRO';
  numeroTrabajadores: number;
  ingresosAnuales?: number;
}

export interface CumplimientoEmpresa {
  infracciones: InfraccionEmpresa[];
  sanciones: SancionEmpresa[];
  certificaciones: CertificacionEmpresa[];
  auditorias: AuditoriaEmpresa[];
  puntaje: number; // 0-100
  nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
}

export interface InfraccionEmpresa extends BaseEntity {
  tipo: TipoInfraccion;
  descripcion: string;
  fecha: Date;
  lugar: string;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'APELADA' | 'PRESCRITA';
  documento: Documento;
  observaciones?: string;
}

export interface SancionEmpresa extends BaseEntity {
  tipo: TipoSancion;
  descripcion: string;
  fecha: Date;
  duracion: number; // días
  estado: 'ACTIVA' | 'CUMPLIDA' | 'SUSPENDIDA';
  documento: Documento;
  motivo: string;
}

export interface CertificacionEmpresa extends BaseEntity {
  tipo: TipoCertificacion;
  numero: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  entidadEmisora: string;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
  documento: Documento;
}

export interface AuditoriaEmpresa extends BaseEntity {
  tipo: TipoAuditoria;
  fecha: Date;
  auditor: string;
  resultado: 'APROBADA' | 'OBSERVADA' | 'RECHAZADA';
  observaciones: string;
  documento: Documento;
  fechaSiguienteAuditoria?: Date;
}

export interface HistorialEmpresa extends BaseEntity {
  accion: AccionHistorial;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  motivo: string;
  usuarioId: string;
}

// Enums y tipos
export type TipoEmpresa = 'PASAJEROS' | 'CARGA' | 'MIXTO' | 'ESCOLAR' | 'TURISTICO';
export type CategoriaEmpresa = 'A' | 'B' | 'C' | 'D';
export type EstadoEmpresa = 'ACTIVO' | 'SUSPENDIDO' | 'CANCELADO' | 'EN_TRAMITE' | 'OBSERVADO';

export type TipoInfraccion = 
  | 'EXCESO_VELOCIDAD'
  | 'SIN_SOAT'
  | 'SIN_REVISION_TECNICA'
  | 'SIN_LICENCIA'
  | 'EXCESO_CARGA'
  | 'SIN_TUC'
  | 'OTRO';

export type TipoSancion = 
  | 'MULTA'
  | 'SUSPENSION'
  | 'CANCELACION'
  | 'CLAUUSURA'
  | 'OTRO';

export type TipoCertificacion = 
  | 'ISO_9001'
  | 'ISO_14001'
  | 'OHSAS_18001'
  | 'CERTIFICACION_MTC'
  | 'OTRO';

export type TipoAuditoria = 
  | 'ANUAL'
  | 'EXTRAORDINARIA'
  | 'SEGUIMIENTO'
  | 'CERTIFICACION'
  | 'OTRO';

export type AccionHistorial = 
  | 'CREACION'
  | 'MODIFICACION'
  | 'SUSPENSION'
  | 'REACTIVACION'
  | 'CANCELACION'
  | 'RENOVACION'
  | 'OTRO';

// Interfaces para formularios
export interface CreateEmpresaRequest {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  tipoEmpresa: TipoEmpresa;
  categoria: CategoriaEmpresa;
  direccion: Direccion;
  representanteLegal: Omit<RepresentanteLegal, 'documentoDesignacion'>;
  contacto: ContactoEmpresa;
  informacionFinanciera: InformacionFinanciera;
}

export interface UpdateEmpresaRequest {
  nombreComercial?: string;
  direccion?: Direccion;
  representanteLegal?: Partial<RepresentanteLegal>;
  contacto?: Partial<ContactoEmpresa>;
  informacionFinanciera?: Partial<InformacionFinanciera>;
}

export interface EmpresaFilters {
  search?: string;
  tipoEmpresa?: TipoEmpresa;
  categoria?: CategoriaEmpresa;
  estado?: EstadoEmpresa;
  departamento?: string;
  provincia?: string;
  fechaRegistroDesde?: Date;
  fechaRegistroHasta?: Date;
  fechaVencimientoDesde?: Date;
  fechaVencimientoHasta?: Date;
} 