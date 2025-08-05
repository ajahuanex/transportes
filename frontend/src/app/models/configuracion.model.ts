import { BaseEntity } from './base.model';

// ============================================================================
// ENUMS Y TIPOS DE CONFIGURACIÓN
// ============================================================================

export enum TipoConfiguracion {
  ESTADO = 'ESTADO',
  CATEGORIA = 'CATEGORIA',
  TIPO = 'TIPO',
  CLASIFICACION = 'CLASIFICACION',
  PARAMETRO = 'PARAMETRO'
}

export enum ModuloSistema {
  EMPRESAS = 'EMPRESAS',
  VEHICULOS = 'VEHICULOS',
  CONDUCTORES = 'CONDUCTORES',
  RUTAS = 'RUTAS',
  EXPEDIENTES = 'EXPEDIENTES',
  RESOLUCIONES = 'RESOLUCIONES',
  TUCS = 'TUCS',
  REPORTES = 'REPORTES',
  SISTEMA = 'SISTEMA'
}

// ============================================================================
// ESTADOS DE ENTIDADES
// ============================================================================

export enum EstadoEmpresa {
  HABILITADA = 'HABILITADA',
  SUSPENDIDA = 'SUSPENDIDA',
  CANCELADA = 'CANCELADA'
}

export enum EstadoVehiculo {
  ACTIVO = 'ACTIVO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  SUSPENDIDO = 'SUSPENDIDO',
  BAJA = 'BAJA'
}

export enum EstadoConductor {
  HABILITADO = 'HABILITADO',
  SUSPENDIDO = 'SUSPENDIDO',
  VENCIDO = 'VENCIDO'
}

export enum EstadoTUC {
  VIGENTE = 'VIGENTE',
  DADA_DE_BAJA = 'DADA_DE_BAJA',
  DESECHADA = 'DESECHADA'
}

export enum EstadoExpediente {
  EN_EVALUACION = 'EN_EVALUACION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  OBSERVADO = 'OBSERVADO'
}

export enum TipoResolucion {
  PADRE = 'PADRE',
  HIJO = 'HIJO'
}

export enum TipoTramite {
  HABILITACION_VEHICULAR = 'HABILITACION_VEHICULAR',
  INCREMENTO = 'INCREMENTO',
  SUSTITUCION = 'SUSTITUCION',
  RENOVACION_HABILITACION_VEHICULAR = 'RENOVACION_HABILITACION_VEHICULAR'
}

// ============================================================================
// CATEGORÍAS Y TIPOS
// ============================================================================

export enum CategoriaVehiculo {
  M1 = 'M1', // Vehículos de pasajeros
  M2 = 'M2', // Vehículos de pasajeros
  M3 = 'M3', // Vehículos de pasajeros
  N1 = 'N1', // Vehículos de carga
  N2 = 'N2', // Vehículos de carga
  N3 = 'N3', // Vehículos de carga
  O1 = 'O1', // Remolques
  O2 = 'O2', // Remolques
  O3 = 'O3', // Remolques
  O4 = 'O4'  // Remolques
}

export enum TipoVehiculo {
  BUS = 'BUS',
  MICROBUS = 'MICROBUS',
  CAMION = 'CAMION',
  CAMIONETA = 'CAMIONETA',
  FURGON = 'FURGON',
  REMOLQUE = 'REMOQUE',
  SEMIRREMOLQUE = 'SEMIRREMOLQUE',
  MOTOCICLETA = 'MOTOCICLETA',
  TRICICLO = 'TRICICLO',
  CUATRICICLO = 'CUATRICICLO'
}

export enum ClasificacionEmpresa {
  TRANSPORTE_PASAJEROS = 'TRANSPORTE_PASAJEROS',
  TRANSPORTE_CARGA = 'TRANSPORTE_CARGA',
  TRANSPORTE_ESCOLAR = 'TRANSPORTE_ESCOLAR',
  TRANSPORTE_TURISTICO = 'TRANSPORTE_TURISTICO',
  TRANSPORTE_ESPECIALIZADO = 'TRANSPORTE_ESPECIALIZADO'
}

export enum TipoDocumento {
  DNI = 'DNI',
  RUC = 'RUC',
  CE = 'CE',
  PASAPORTE = 'PASAPORTE'
}

export enum TipoLicencia {
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

// ============================================================================
// INTERFACES DE CONFIGURACIÓN
// ============================================================================

export interface ConfiguracionItem {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
  color?: string;
  icono?: string;
}

export interface ConfiguracionModulo {
  id: string;
  modulo: ModuloSistema;
  tipo: TipoConfiguracion;
  nombre: string;
  descripcion?: string;
  items: ConfiguracionItem[];
  activo: boolean;
  editable: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

export interface ConfiguracionSistema extends BaseEntity {
  id: string;
  modulo: ModuloSistema;
  tipo: TipoConfiguracion;
  nombre: string;
  descripcion?: string;
  items: ConfiguracionItem[];
  activo: boolean;
  editable: boolean;
}

// ============================================================================
// REQUEST/RESPONSE INTERFACES
// ============================================================================

export interface CreateConfiguracionRequest {
  modulo: ModuloSistema;
  tipo: TipoConfiguracion;
  nombre: string;
  descripcion?: string;
  items: Omit<ConfiguracionItem, 'activo' | 'orden'>[];
  editable?: boolean;
}

export interface UpdateConfiguracionRequest {
  id: string;
  nombre?: string;
  descripcion?: string;
  items?: ConfiguracionItem[];
  activo?: boolean;
}

export interface ConfiguracionFilter {
  modulo?: ModuloSistema;
  tipo?: TipoConfiguracion;
  activo?: boolean;
  nombre?: string;
}

export interface ConfiguracionResponse {
  configuracion: ConfiguracionSistema;
}

export interface ConfiguracionesResponse {
  configuraciones: ConfiguracionSistema[];
  total: number;
  pagina: number;
  porPagina: number;
}

// ============================================================================
// UTILIDADES Y HELPERS
// ============================================================================

export class ConfiguracionHelper {
  
  /**
   * Obtener estados por módulo
   */
  static getEstadosByModulo(modulo: ModuloSistema): string[] {
    switch (modulo) {
      case ModuloSistema.EMPRESAS:
        return Object.values(EstadoEmpresa);
      case ModuloSistema.VEHICULOS:
        return Object.values(EstadoVehiculo);
      case ModuloSistema.CONDUCTORES:
        return Object.values(EstadoConductor);
      case ModuloSistema.TUCS:
        return Object.values(EstadoTUC);
      case ModuloSistema.EXPEDIENTES:
        return Object.values(EstadoExpediente);
      case ModuloSistema.RESOLUCIONES:
        return Object.values(TipoResolucion);
      default:
        return [];
    }
  }

  /**
   * Obtener categorías por módulo
   */
  static getCategoriasByModulo(modulo: ModuloSistema): string[] {
    switch (modulo) {
      case ModuloSistema.VEHICULOS:
        return Object.values(CategoriaVehiculo);
      default:
        return [];
    }
  }

  /**
   * Obtener tipos por módulo
   */
  static getTiposByModulo(modulo: ModuloSistema): string[] {
    switch (modulo) {
      case ModuloSistema.VEHICULOS:
        return Object.values(TipoVehiculo);
      case ModuloSistema.EMPRESAS:
        return Object.values(ClasificacionEmpresa);
      case ModuloSistema.CONDUCTORES:
        return Object.values(TipoLicencia);
      case ModuloSistema.RESOLUCIONES:
        return Object.values(TipoTramite);
      default:
        return [];
    }
  }

  /**
   * Obtener color para estado
   */
  static getColorEstado(estado: string): string {
    switch (estado) {
      case EstadoEmpresa.HABILITADA:
      case EstadoVehiculo.ACTIVO:
      case EstadoConductor.HABILITADO:
      case EstadoTUC.VIGENTE:
      case EstadoExpediente.APROBADO:
        return '#28a745'; // Verde
      
      case EstadoEmpresa.SUSPENDIDA:
      case EstadoVehiculo.SUSPENDIDO:
      case EstadoConductor.SUSPENDIDO:
      case EstadoExpediente.EN_EVALUACION:
        return '#ffc107'; // Amarillo
      
      case EstadoVehiculo.MANTENIMIENTO:
      case EstadoExpediente.OBSERVADO:
        return '#17a2b8'; // Azul
      
      case EstadoEmpresa.CANCELADA:
      case EstadoVehiculo.BAJA:
      case EstadoConductor.VENCIDO:
      case EstadoTUC.DADA_DE_BAJA:
      case EstadoTUC.DESECHADA:
      case EstadoExpediente.RECHAZADO:
        return '#dc3545'; // Rojo
      
      default:
        return '#6c757d'; // Gris
    }
  }

  /**
   * Obtener icono para estado
   */
  static getIconoEstado(estado: string): string {
    switch (estado) {
      case EstadoEmpresa.HABILITADA:
      case EstadoVehiculo.ACTIVO:
      case EstadoConductor.HABILITADO:
      case EstadoTUC.VIGENTE:
      case EstadoExpediente.APROBADO:
        return 'fas fa-check-circle';
      
      case EstadoEmpresa.SUSPENDIDA:
      case EstadoVehiculo.SUSPENDIDO:
      case EstadoConductor.SUSPENDIDO:
      case EstadoExpediente.EN_EVALUACION:
        return 'fas fa-exclamation-triangle';
      
      case EstadoVehiculo.MANTENIMIENTO:
      case EstadoExpediente.OBSERVADO:
        return 'fas fa-tools';
      
      case EstadoEmpresa.CANCELADA:
      case EstadoVehiculo.BAJA:
      case EstadoConductor.VENCIDO:
      case EstadoTUC.DADA_DE_BAJA:
      case EstadoTUC.DESECHADA:
      case EstadoExpediente.RECHAZADO:
        return 'fas fa-times-circle';
      
      default:
        return 'fas fa-circle';
    }
  }

  /**
   * Obtener texto para estado
   */
  static getTextoEstado(estado: string): string {
    switch (estado) {
      case EstadoEmpresa.HABILITADA:
        return 'Habilitada';
      case EstadoEmpresa.SUSPENDIDA:
        return 'Suspendida';
      case EstadoEmpresa.CANCELADA:
        return 'Cancelada';
      
      case EstadoVehiculo.ACTIVO:
        return 'Activo';
      case EstadoVehiculo.MANTENIMIENTO:
        return 'En Mantenimiento';
      case EstadoVehiculo.SUSPENDIDO:
        return 'Suspendido';
      case EstadoVehiculo.BAJA:
        return 'Dado de Baja';
      
      case EstadoConductor.HABILITADO:
        return 'Habilitado';
      case EstadoConductor.SUSPENDIDO:
        return 'Suspendido';
      case EstadoConductor.VENCIDO:
        return 'Vencido';
      
      case EstadoTUC.VIGENTE:
        return 'Vigente';
      case EstadoTUC.DADA_DE_BAJA:
        return 'Dado de Baja';
      case EstadoTUC.DESECHADA:
        return 'Desechada';
      
      case EstadoExpediente.EN_EVALUACION:
        return 'En Evaluación';
      case EstadoExpediente.APROBADO:
        return 'Aprobado';
      case EstadoExpediente.RECHAZADO:
        return 'Rechazado';
      case EstadoExpediente.OBSERVADO:
        return 'Observado';
      
      default:
        return estado;
    }
  }

  /**
   * Obtener clase CSS para estado
   */
  static getClaseEstado(estado: string): string {
    switch (estado) {
      case EstadoEmpresa.HABILITADA:
      case EstadoVehiculo.ACTIVO:
      case EstadoConductor.HABILITADO:
      case EstadoTUC.VIGENTE:
      case EstadoExpediente.APROBADO:
        return 'badge-success';
      
      case EstadoEmpresa.SUSPENDIDA:
      case EstadoVehiculo.SUSPENDIDO:
      case EstadoConductor.SUSPENDIDO:
      case EstadoExpediente.EN_EVALUACION:
        return 'badge-warning';
      
      case EstadoVehiculo.MANTENIMIENTO:
      case EstadoExpediente.OBSERVADO:
        return 'badge-info';
      
      case EstadoEmpresa.CANCELADA:
      case EstadoVehiculo.BAJA:
      case EstadoConductor.VENCIDO:
      case EstadoTUC.DADA_DE_BAJA:
      case EstadoTUC.DESECHADA:
      case EstadoExpediente.RECHAZADO:
        return 'badge-danger';
      
      default:
        return 'badge-secondary';
    }
  }
} 