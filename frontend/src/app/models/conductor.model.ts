import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

export interface Conductor extends BaseEntity {
  dni: string;
  nombres: string;
  apellidos: string;
  licencia: LicenciaConducir;
  estado: 'HABILITADO' | 'SUSPENDIDO' | 'VENCIDO';
  estaActivo: boolean;
  empresasAsociadasIds: string[];
  // Campos adicionales para compatibilidad
  fechaNacimiento?: Date;
  direccion?: DireccionConductor;
  contacto?: ContactoConductor;
  antecedentes?: AntecedentesConductor;
  certificaciones?: CertificacionConductor[];
  experiencia?: ExperienciaConductor;
  historial?: HistorialConductor[];
}

export interface DireccionConductor {
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
}

export interface ContactoConductor {
  telefono: string;
  celular: string;
  email: string;
  telefonoEmergencia: string;
  contactoEmergencia: string;
}

export interface LicenciaConducir {
  numero: string;
  categoria: CategoriaLicencia;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA' | 'CANCELADA';
  puntos: number;
  restricciones: string[];
  documento: string;
}

export enum CategoriaLicencia {
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3',
  D1 = 'D1',
  D2 = 'D2',
  E1 = 'E1',
  E2 = 'E2'
}

export interface AntecedentesConductor {
  antecedentesPenales: boolean;
  fechaVerificacionAntecedentes: Date;
  resultadoAntecedentes: 'FAVORABLE' | 'DESFAVORABLE' | 'PENDIENTE';
  antecedentesJudiciales: boolean;
  fechaVerificacionJudicial: Date;
  resultadoJudicial: 'FAVORABLE' | 'DESFAVORABLE' | 'PENDIENTE';
  observaciones: string[];
  documentos: string[];
}

export interface CertificacionConductor {
  id: string;
  tipo: TipoCertificacion;
  numero: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
  organismoEmisor: string;
  documento: string;
}

export enum TipoCertificacion {
  CERTIFICADO_MEDICO = 'CERTIFICADO_MEDICO',
  CERTIFICADO_PSICOLOGICO = 'CERTIFICADO_PSICOLOGICO',
  CERTIFICADO_CAPACITACION = 'CERTIFICADO_CAPACITACION',
  CERTIFICADO_SEGURIDAD_VIAL = 'CERTIFICADO_SEGURIDAD_VIAL',
  OTRO = 'OTRO'
}

export interface ExperienciaConductor {
  aniosExperiencia: number;
  empresasAnteriores: string[];
  tiposVehiculosManejados: string[];
  rutasConocidas: string[];
  accidentes: AccidenteConductor[];
  infracciones: InfraccionConductor[];
  evaluaciones: EvaluacionConductor[];
}

export interface AccidenteConductor {
  id: string;
  fecha: Date;
  tipo: 'LEVE' | 'GRAVE' | 'FATAL';
  descripcion: string;
  lugar: string;
  vehiculoInvolucrado: string;
  resultado: string;
  documento: string;
}

export interface InfraccionConductor {
  id: string;
  fecha: Date;
  tipo: string;
  descripcion: string;
  lugar: string;
  monto: number;
  puntosDescontados: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'APELADA';
  documento: string;
}

export interface EvaluacionConductor {
  id: string;
  fecha: Date;
  tipo: 'TEORICA' | 'PRACTICA' | 'MEDICA' | 'PSICOLOGICA';
  resultado: 'APROBADO' | 'REPROBADO' | 'PENDIENTE';
  puntaje?: number;
  observaciones: string;
  evaluador: string;
  documento: string;
}

export interface HistorialConductor {
  fecha: Date;
  accion: string;
  usuario: string;
  detalles: string;
  documentos: string[];
}

// Usar el enum de base.model.ts en lugar de redefinirlo

// Interfaces para requests y responses
export interface CreateConductorRequest {
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  direccion: DireccionConductor;
  contacto: ContactoConductor;
  licencia: Omit<LicenciaConducir, 'estado' | 'puntos'>;
  antecedentes: Omit<AntecedentesConductor, 'fechaVerificacionAntecedentes' | 'fechaVerificacionJudicial' | 'resultadoAntecedentes' | 'resultadoJudicial'>;
}

export interface UpdateConductorRequest {
  nombres?: string;
  apellidos?: string;
  direccion?: DireccionConductor;
  contacto?: ContactoConductor;
  licencia?: Partial<LicenciaConducir>;
  antecedentes?: Partial<AntecedentesConductor>;
}

export interface ConductorFilter extends BaseFilter {
  dni?: string;
  nombres?: string;
  apellidos?: string;
  estado?: EstadoGeneral;
  categoriaLicencia?: CategoriaLicencia;
  distrito?: string;
  provincia?: string;
  fechaRegistroDesde?: Date;
  fechaRegistroHasta?: Date;
  antecedentesPenales?: boolean;
  licenciaVencida?: boolean;
}

export interface ConductorListResponse {
  conductores: Conductor[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Interfaces para reportes
export interface ConductorReport {
  totalConductores: number;
  conductoresActivos: number;
  conductoresSuspendidos: number;
  conductoresEnEvaluacion: number;
  licenciasPorVencer: number;
  licenciasVencidas: number;
  distribucionPorCategoria: {
    categoria: CategoriaLicencia;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorDistrito: {
    distrito: string;
    cantidad: number;
    porcentaje: number;
  }[];
  conductoresConAntecedentes: number;
  conductoresSinAntecedentes: number;
}

// Interfaces para soft delete
export interface DeleteConductorRequest extends SoftDeleteRequest {
  conductorId: string;
}

export interface RestoreConductorRequest extends RestoreRequest {
  conductorId: string;
}

// Interfaces para auditoría
export interface ConductorAuditLog {
  id: string;
  conductorId: string;
  fecha: Date;
  accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RESTAURAR' | 'SUSPENDER' | 'REACTIVAR';
  usuario: string;
  detalles: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
} 