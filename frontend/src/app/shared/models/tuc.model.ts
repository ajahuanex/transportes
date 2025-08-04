import { BaseEntity, Documento } from './common.model';

export interface TUC extends BaseEntity {
  numero: string;
  vehiculoId: string;
  empresaId: string;
  rutaId: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: EstadoTUC;
  datos: DatosTUC;
  qrCode: string;
  documento: Documento;
  historial: HistorialTUC[];
  observaciones?: string;
}

export interface DatosTUC {
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  capacidad: number;
  ruta: string;
  empresa: string;
  tipoServicio: TipoServicio;
  horarios: HorarioServicio[];
  tarifas: TarifaServicio[];
  paraderos: ParaderoTUC[];
}

export interface HorarioServicio {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  frecuencia: string; // ej: "cada 15 minutos"
  observaciones?: string;
}

export interface TarifaServicio {
  tipo: TipoTarifa;
  monto: number;
  descripcion: string;
  aplicaDesde?: string;
  aplicaHasta?: string;
}

export interface ParaderoTUC {
  nombre: string;
  ubicacion: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  tipo: 'ORIGEN' | 'DESTINO' | 'INTERMEDIO';
  orden: number;
}

export interface HistorialTUC extends BaseEntity {
  accion: AccionHistorialTUC;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  motivo: string;
  usuarioId: string;
}

// Enums y tipos
export type EstadoTUC = 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA' | 'CANCELADA' | 'EN_TRAMITE';
export type TipoServicio = 'PASAJEROS' | 'CARGA' | 'ESCOLAR' | 'TURISTICO' | 'ESPECIAL';
export type TipoTarifa = 'NORMAL' | 'REDUCIDA' | 'ESPECIAL' | 'ESCOLAR' | 'TURISTICO';
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export type AccionHistorialTUC = 
  | 'GENERACION'
  | 'RENOVACION'
  | 'MODIFICACION'
  | 'SUSPENSION'
  | 'REACTIVACION'
  | 'CANCELACION'
  | 'VENCIMIENTO'
  | 'OTRO';

// Interfaces para formularios
export interface CreateTUCRequest {
  vehiculoId: string;
  empresaId: string;
  rutaId: string;
  fechaVencimiento: Date;
  datos: Omit<DatosTUC, 'placa' | 'marca' | 'modelo' | 'año' | 'empresa'>;
  observaciones?: string;
}

export interface UpdateTUCRequest {
  fechaVencimiento?: Date;
  datos?: Partial<DatosTUC>;
  observaciones?: string;
}

export interface TUCFilters {
  search?: string;
  vehiculoId?: string;
  empresaId?: string;
  rutaId?: string;
  estado?: EstadoTUC;
  tipoServicio?: TipoServicio;
  fechaEmisionDesde?: Date;
  fechaEmisionHasta?: Date;
  fechaVencimientoDesde?: Date;
  fechaVencimientoHasta?: Date;
}

// Interfaces para reportes
export interface TUCReport {
  total: number;
  porEstado: Record<EstadoTUC, number>;
  porTipoServicio: Record<TipoServicio, number>;
  porEmpresa: Array<{
    empresaId: string;
    empresaNombre: string;
    cantidad: number;
  }>;
  vencimientosProximos: TUC[];
  vencidas: TUC[];
  suspendidas: TUC[];
}

// Interfaces para validaciones
export interface TUCValidation {
  vehiculoHabilitado: boolean;
  empresaHabilitada: boolean;
  rutaAprobada: boolean;
  documentosVigentes: boolean;
  sinInfracciones: boolean;
  observaciones: string[];
}

// Interfaces para impresión
export interface TUCPrintData {
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  datos: DatosTUC;
  qrCode: string;
  codigoBarras: string;
  logoDRTC: string;
  firmaAutoridad: string;
  selloOficial: string;
} 