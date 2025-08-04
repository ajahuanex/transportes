import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

export interface Vehiculo extends BaseEntity {
  placa: string;
  empresaActualId: string;
  rutaId?: string;
  categoria: string; // M1, M2, M3, N1, N2, N3, etc.
  marca: string;
  anioFabricacion: number;
  estado: 'ACTIVO' | 'MANTENIMIENTO' | 'SUSPENDIDO' | 'BAJA';
  estaActivo: boolean;
  tuc: {
    nroTuc: string;
    fechaEmision: Date;
  };
  datosTecnicos: {
    motor: string;
    chasis: string;
    ejes: number;
    asientos: number;
    pesoNeto: number;
    pesoBruto: number;
    medidas: {
      largo: number;
      ancho: number;
      alto: number;
    };
  };
  // Campos adicionales para compatibilidad
  empresaId?: string;
  empresaNombre?: string;
  tipo?: TipoVehiculo;
  modelo?: string;
  anio?: number;
  color?: string;
  capacidad?: CapacidadVehiculo;
  documentos?: DocumentosVehiculo;
  informacionTecnica?: InformacionTecnica;
  informacionSeguro?: InformacionSeguro;
  mantenimiento?: MantenimientoVehiculo;
  historial?: HistorialVehiculo[];
}

export enum TipoVehiculo {
  BUS = 'BUS',
  MICROBUS = 'MICROBUS',
  COMBIS = 'COMBIS',
  CAMION = 'CAMION',
  CAMIONETA = 'CAMIONETA',
  MOTOTAXI = 'MOTOTAXI',
  TAXI = 'TAXI',
  OTRO = 'OTRO'
}

export interface CapacidadVehiculo {
  pasajeros: number;
  pesoMaximo: number;
  volumenMaximo?: number;
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
  };
}

export interface DocumentosVehiculo {
  tarjetaPropiedad: {
    numero: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
    documento: string;
  };
  revisionTecnica: {
    numero: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
    documento: string;
  };
  seguroVehicular: {
    numero: string;
    aseguradora: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
    documento: string;
  };
  certificadoOperacion: {
    numero: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
    documento: string;
  };
}

export interface InformacionTecnica {
  numeroMotor: string;
  numeroChasis: string;
  cilindrada: number;
  combustible: TipoCombustible;
  transmision: TipoTransmision;
  traccion: TipoTraccion;
  pesoBruto: number;
  pesoNeto: number;
  kilometraje: number;
  ultimaRevision: Date;
}

export enum TipoCombustible {
  GASOLINA = 'GASOLINA',
  DIESEL = 'DIESEL',
  GAS_NATURAL = 'GAS_NATURAL',
  ELECTRICO = 'ELECTRICO',
  HIBRIDO = 'HIBRIDO'
}

export enum TipoTransmision {
  MANUAL = 'MANUAL',
  AUTOMATICA = 'AUTOMATICA',
  CVT = 'CVT'
}

export enum TipoTraccion {
  DELANTERA = 'DELANTERA',
  TRASERA = 'TRASERA',
  CUATRO_POR_CUATRO = 'CUATRO_POR_CUATRO'
}

export interface InformacionSeguro {
  poliza: string;
  aseguradora: string;
  tipoCobertura: string;
  montoAsegurado: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
  documento: string;
}

export interface MantenimientoVehiculo {
  ultimoMantenimiento: Date;
  proximoMantenimiento: Date;
  kilometrajeUltimoMantenimiento: number;
  tipoUltimoMantenimiento: string;
  taller: string;
  costo: number;
  observaciones: string[];
  documentos: string[];
}

export interface HistorialVehiculo {
  fecha: Date;
  accion: string;
  usuario: string;
  detalles: string;
  documentos: string[];
}

// Usar el enum de base.model.ts en lugar de redefinirlo

// Interfaces para requests y responses
export interface CreateVehiculoRequest {
  placa: string;
  empresaId: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  capacidad: CapacidadVehiculo;
  informacionTecnica: InformacionTecnica;
  informacionSeguro: Omit<InformacionSeguro, 'estado'>;
}

export interface UpdateVehiculoRequest {
  tipo?: TipoVehiculo;
  marca?: string;
  modelo?: string;
  anio?: number;
  color?: string;
  capacidad?: CapacidadVehiculo;
  informacionTecnica?: Partial<InformacionTecnica>;
  informacionSeguro?: Partial<InformacionSeguro>;
}

export interface VehiculoFilter extends BaseFilter {
  placa?: string;
  empresaId?: string;
  empresaNombre?: string;
  tipo?: TipoVehiculo;
  marca?: string;
  modelo?: string;
  estado?: EstadoGeneral;
  fechaRegistroDesde?: Date;
  fechaRegistroHasta?: Date;
  documentosVencidos?: boolean;
}

export interface VehiculoListResponse {
  vehiculos: Vehiculo[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Interfaces para reportes
export interface VehiculoReport {
  totalVehiculos: number;
  vehiculosActivos: number;
  vehiculosSuspendidos: number;
  vehiculosEnMantenimiento: number;
  documentosPorVencer: number;
  documentosVencidos: number;
  distribucionPorTipo: {
    tipo: TipoVehiculo;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorEmpresa: {
    empresa: string;
    cantidad: number;
    porcentaje: number;
  }[];
}

// Interfaces para soft delete
export interface DeleteVehiculoRequest extends SoftDeleteRequest {
  vehiculoId: string;
}

export interface RestoreVehiculoRequest extends RestoreRequest {
  vehiculoId: string;
}

// Interfaces para auditoría
export interface VehiculoAuditLog {
  id: string;
  vehiculoId: string;
  fecha: Date;
  accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RESTAURAR' | 'SUSPENDER' | 'REACTIVAR';
  usuario: string;
  detalles: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
} 