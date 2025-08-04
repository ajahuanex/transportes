import { BaseEntity, SoftDeleteRequest, RestoreRequest, BaseFilter, EstadoGeneral } from './base.model';

export interface Ruta extends BaseEntity {
  codigoRuta: string; // Formato: PUN-JUL-01
  nombre: string; // Puno - Juliaca
  origen: string;
  destino: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA';
  estaActivo: boolean;
  
  // Información adicional de la ruta
  descripcion?: string;
  distancia?: number; // en kilómetros
  tiempoEstimado?: number; // en minutos
  tipoRuta: TipoRuta;
  categoria: CategoriaRuta;
  
  // Información geográfica
  coordenadas?: {
    origen: {
      latitud: number;
      longitud: number;
    };
    destino: {
      latitud: number;
      longitud: number;
    };
    waypoints?: Array<{
      latitud: number;
      longitud: number;
      nombre: string;
    }>;
  };
  
  // Información de operación
  horarios?: HorarioRuta[];
  tarifas?: TarifaRuta[];
  empresasOperadoras?: string[]; // IDs de empresas que operan esta ruta
  vehiculosAsignados?: string[]; // IDs de vehículos asignados a esta ruta
  
  // Documentación
  documentos?: DocumentoRuta[];
  
  // Historial de cambios
  historial?: HistorialRuta[];
}

export enum TipoRuta {
  URBANA = 'URBANA',
  INTERURBANA = 'INTERURBANA',
  INTERPROVINCIAL = 'INTERPROVINCIAL',
  INTERREGIONAL = 'INTERREGIONAL',
  NACIONAL = 'NACIONAL'
}

export enum CategoriaRuta {
  PASAJEROS = 'PASAJEROS',
  CARGA = 'CARGA',
  MIXTA = 'MIXTA',
  ESPECIAL = 'ESPECIAL'
}

export interface HorarioRuta {
  id: string;
  dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
  horaSalida: string; // Formato: HH:MM
  horaLlegada: string; // Formato: HH:MM
  frecuencia?: number; // en minutos
  tipoServicio: 'REGULAR' | 'EXPRESS' | 'NOCTURNO';
  activo: boolean;
}

export interface TarifaRuta {
  id: string;
  tipoPasajero: 'ADULTO' | 'NINO' | 'ESTUDIANTE' | 'ADULTO_MAYOR' | 'DISCAPACITADO';
  precio: number;
  moneda: string;
  vigenteDesde: Date;
  vigenteHasta?: Date;
  activo: boolean;
}

export interface DocumentoRuta {
  id: string;
  nombre: string;
  tipo: 'AUTORIZACION' | 'PERMISO' | 'CONTRATO' | 'OTRO';
  numero: string;
  fechaEmision: Date;
  fechaVencimiento?: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
  url: string;
  observaciones?: string;
}

export interface HistorialRuta {
  id: string;
  fecha: Date;
  accion: string;
  usuario: string;
  descripcion: string;
  observaciones?: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  documentos: string[];
}

// Interfaces para requests y responses
export interface CreateRutaRequest {
  codigoRuta: string;
  nombre: string;
  origen: string;
  destino: string;
  estado?: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA';
  descripcion?: string;
  distancia?: number;
  tiempoEstimado?: number;
  tipoRuta: TipoRuta;
  categoria: CategoriaRuta;
  coordenadas?: {
    origen: {
      latitud: number;
      longitud: number;
    };
    destino: {
      latitud: number;
      longitud: number;
    };
    waypoints?: Array<{
      latitud: number;
      longitud: number;
      nombre: string;
    }>;
  };
  horarios?: Omit<HorarioRuta, 'id' | 'activo'>[];
  tarifas?: Omit<TarifaRuta, 'id' | 'activo'>[];
  empresasOperadoras?: string[];
  vehiculosAsignados?: string[];
  documentos?: DocumentoRuta[];
}

export interface UpdateRutaRequest {
  nombre?: string;
  origen?: string;
  destino?: string;
  descripcion?: string;
  distancia?: number;
  tiempoEstimado?: number;
  tipoRuta?: TipoRuta;
  categoria?: CategoriaRuta;
  estado?: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA';
  coordenadas?: {
    origen: {
      latitud: number;
      longitud: number;
    };
    destino: {
      latitud: number;
      longitud: number;
    };
    waypoints?: Array<{
      latitud: number;
      longitud: number;
      nombre: string;
    }>;
  };
  horarios?: HorarioRuta[];
  tarifas?: TarifaRuta[];
  empresasOperadoras?: string[];
  vehiculosAsignados?: string[];
}

export interface RutaFilter extends BaseFilter {
  codigoRuta?: string;
  nombre?: string;
  origen?: string;
  destino?: string;
  estado?: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA';
  tipoRuta?: TipoRuta;
  categoria?: CategoriaRuta;
  empresaOperadora?: string;
  vehiculoAsignado?: string;
  busquedaGeneral?: string; // Búsqueda general por código, nombre, origen, destino
  estaActivo?: boolean;
  ordenarPor?: string;
  orden?: 'asc' | 'desc';
}

export interface RutaListResponse {
  rutas: Ruta[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface DeleteRutaRequest extends SoftDeleteRequest {
  id: string;
  usuarioEliminacion: string;
  motivoEliminacion: string;
}

export interface RestoreRutaRequest extends RestoreRequest {
  id: string;
  usuarioRestauracion: string;
}

export interface RutaAuditLog {
  id: string;
  rutaId: string;
  fecha: Date;
  accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RESTAURAR' | 'SUSPENDER' | 'REACTIVAR';
  usuario: string;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
}

export interface RutaStats {
  total: number;
  activas: number;
  inactivas: number;
  eliminadas: number;
  porEstado: Record<string, number>;
  porTipo: Record<string, number>;
  porCategoria: Record<string, number>;
  distanciaTotal: number;
  tiempoPromedio: number;
}

export interface RutaReport {
  totalRutas: number;
  rutasActivas: number;
  rutasInactivas: number;
  rutasSuspendidas: number;
  distribucionPorTipo: {
    tipo: TipoRuta;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorCategoria: {
    categoria: CategoriaRuta;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorOrigen: {
    origen: string;
    cantidad: number;
    porcentaje: number;
  }[];
  distribucionPorDestino: {
    destino: string;
    cantidad: number;
    porcentaje: number;
  }[];
  rutasConEmpresas: number;
  rutasSinEmpresas: number;
  rutasConVehiculos: number;
  rutasSinVehiculos: number;
} 