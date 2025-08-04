import { BaseEntity, Documento } from './common.model';

export interface Vehiculo extends BaseEntity {
  placa: string;
  empresaId: string;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  tipoVehiculo: TipoVehiculo;
  capacidad: CapacidadVehiculo;
  estado: EstadoVehiculo;
  fechaRegistro: Date;
  fechaVencimiento: Date;
  documentos: DocumentosVehiculo;
  conductores: string[]; // IDs de conductores
  rutas: string[]; // IDs de rutas
  historialMantenimiento: MantenimientoVehiculo[];
  informacionTecnica: InformacionTecnica;
  seguro: InformacionSeguro;
  tuc?: string; // ID del TUC actual
  historial: HistorialVehiculo[];
}

export interface CapacidadVehiculo {
  pasajeros: number;
  carga: number; // en toneladas
  volumen?: number; // en metros cúbicos
  pesoBruto: number; // en toneladas
  pesoNeto: number; // en toneladas
}

export interface DocumentosVehiculo {
  tarjetaPropiedad: Documento;
  soat: Documento;
  revisionTecnica: Documento;
  certificadoEmisiones: Documento;
  permisoCirculacion?: Documento;
  certificadoSeguridad?: Documento;
  otros: Documento[];
}

export interface InformacionTecnica {
  numeroMotor: string;
  numeroSerie: string;
  cilindros: number;
  cilindrada: number; // en cc
  combustible: TipoCombustible;
  transmision: TipoTransmision;
  traccion: TipoTraccion;
  neumaticos: {
    delanteros: string;
    traseros: string;
  };
  dimensiones: {
    largo: number; // en metros
    ancho: number; // en metros
    alto: number; // en metros
  };
  peso: {
    vacio: number; // en kg
    maximo: number; // en kg
  };
}

export interface InformacionSeguro {
  compania: string;
  numeroPoliza: string;
  fechaInicio: Date;
  fechaVencimiento: Date;
  cobertura: TipoCobertura;
  montoCobertura: number;
  estado: 'VIGENTE' | 'VENCIDO' | 'CANCELADO';
  documento: Documento;
}

export interface MantenimientoVehiculo extends BaseEntity {
  tipo: TipoMantenimiento;
  descripcion: string;
  fecha: Date;
  kilometraje: number;
  taller: string;
  costo: number;
  estado: 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  proximoMantenimiento?: Date;
  observaciones?: string;
  documentos: Documento[];
}

export interface HistorialVehiculo extends BaseEntity {
  accion: AccionHistorialVehiculo;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  motivo: string;
  usuarioId: string;
}

// Enums y tipos
export type TipoVehiculo = 
  | 'BUS'
  | 'COMBIS'
  | 'CAMION'
  | 'CAMIONETA'
  | 'MOTOTAXI'
  | 'TAXI'
  | 'REMOLQUE'
  | 'SEMIRREMOLQUE'
  | 'OTRO';

export type EstadoVehiculo = 
  | 'ACTIVO'
  | 'MANTENIMIENTO'
  | 'SUSPENDIDO'
  | 'BAJA'
  | 'EN_TRAMITE'
  | 'OBSERVADO';

export type TipoCombustible = 
  | 'GASOLINA'
  | 'DIESEL'
  | 'GLP'
  | 'GNV'
  | 'ELECTRICO'
  | 'HIBRIDO'
  | 'OTRO';

export type TipoTransmision = 
  | 'MANUAL'
  | 'AUTOMATICA'
  | 'CVT'
  | 'SEMIAUTOMATICA';

export type TipoTraccion = 
  | 'DELANTERA'
  | 'TRASERA'
  | '4X4'
  | 'AWD';

export type TipoCobertura = 
  | 'RESPONSABILIDAD_CIVIL'
  | 'TODO_RIESGO'
  | 'ROBO_TOTAL'
  | 'DAÑOS_MATERIALES'
  | 'OTRO';

export type TipoMantenimiento = 
  | 'PREVENTIVO'
  | 'CORRECTIVO'
  | 'PREDICTIVO'
  | 'REVISION_TECNICA'
  | 'OTRO';

export type AccionHistorialVehiculo = 
  | 'REGISTRO'
  | 'MODIFICACION'
  | 'ASIGNACION_RUTA'
  | 'ASIGNACION_CONDUCTOR'
  | 'MANTENIMIENTO'
  | 'SUSPENSION'
  | 'REACTIVACION'
  | 'BAJA'
  | 'GENERACION_TUC'
  | 'OTRO';

// Interfaces para formularios
export interface CreateVehiculoRequest {
  placa: string;
  empresaId: string;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  tipoVehiculo: TipoVehiculo;
  capacidad: CapacidadVehiculo;
  informacionTecnica: InformacionTecnica;
  seguro: Omit<InformacionSeguro, 'documento'>;
}

export interface UpdateVehiculoRequest {
  marca?: string;
  modelo?: string;
  color?: string;
  capacidad?: Partial<CapacidadVehiculo>;
  informacionTecnica?: Partial<InformacionTecnica>;
  seguro?: Partial<Omit<InformacionSeguro, 'documento'>>;
}

export interface VehiculoFilters {
  search?: string;
  empresaId?: string;
  tipoVehiculo?: TipoVehiculo;
  estado?: EstadoVehiculo;
  marca?: string;
  modelo?: string;
  año?: number;
  fechaRegistroDesde?: Date;
  fechaRegistroHasta?: Date;
  fechaVencimientoDesde?: Date;
  fechaVencimientoHasta?: Date;
  tieneTuc?: boolean;
}

// Interfaces para reportes
export interface VehiculoReport {
  total: number;
  porTipo: Record<TipoVehiculo, number>;
  porEstado: Record<EstadoVehiculo, number>;
  porEmpresa: Array<{
    empresaId: string;
    empresaNombre: string;
    cantidad: number;
  }>;
  vencimientosProximos: Vehiculo[];
  sinTuc: Vehiculo[];
  enMantenimiento: Vehiculo[];
} 