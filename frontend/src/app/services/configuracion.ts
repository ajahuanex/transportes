import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';
import {
  ConfiguracionEnum,
  ConfiguracionSistema,
  CreateConfiguracionEnumRequest,
  UpdateConfiguracionEnumRequest,
  CreateConfiguracionSistemaRequest,
  UpdateConfiguracionSistemaRequest,
  ConfiguracionListResponse,
  ConfiguracionSistemaListResponse,
  CATEGORIAS_CONFIGURACION,
  obtenerEstadosEmpresa,
  obtenerEstadosVehiculo,
  obtenerEstadosConductor,
  obtenerEstadosTUC,
  obtenerTiposResolucion,
  obtenerTiposTramite
} from '../shared/models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private mockDataService = inject(MockDataService);

  // ============================================================================
  // MÉTODOS PARA CONFIGURACIONES DE ENUM
  // ============================================================================

  /**
   * Obtiene todas las configuraciones de enum con filtros y paginación
   */
  getConfiguracionesEnum(
    pagina: number = 1,
    porPagina: number = 10,
    filtros?: {
      categoria?: string;
      estaActivo?: boolean;
      busqueda?: string;
    }
  ): Observable<ConfiguracionListResponse> {
    return this.mockDataService.getConfiguracionesEnum(pagina, porPagina, filtros);
  }

  /**
   * Obtiene una configuración de enum específica por ID
   */
  getConfiguracionEnum(id: string): Observable<ConfiguracionEnum> {
    return this.mockDataService.getConfiguracionEnum(id);
  }

  /**
   * Crea una nueva configuración de enum
   */
  createConfiguracionEnum(request: CreateConfiguracionEnumRequest): Observable<ConfiguracionEnum> {
    return this.mockDataService.createConfiguracionEnum(request);
  }

  /**
   * Actualiza una configuración de enum existente
   */
  updateConfiguracionEnum(id: string, request: UpdateConfiguracionEnumRequest): Observable<ConfiguracionEnum> {
    return this.mockDataService.updateConfiguracionEnum(id, request);
  }

  /**
   * Elimina lógicamente una configuración de enum
   */
  deleteConfiguracionEnum(id: string): Observable<boolean> {
    return this.mockDataService.deleteConfiguracionEnum(id);
  }

  /**
   * Restaura una configuración de enum eliminada
   */
  restoreConfiguracionEnum(id: string): Observable<ConfiguracionEnum> {
    return this.mockDataService.restoreConfiguracionEnum(id);
  }

  /**
   * Obtiene configuraciones de enum eliminadas
   */
  getConfiguracionesEnumEliminadas(
    pagina: number = 1,
    porPagina: number = 10
  ): Observable<ConfiguracionListResponse> {
    return this.mockDataService.getConfiguracionesEnumEliminadas(pagina, porPagina);
  }

  // ============================================================================
  // MÉTODOS PARA CONFIGURACIONES DE SISTEMA
  // ============================================================================

  /**
   * Obtiene todas las configuraciones de sistema con filtros y paginación
   */
  getConfiguracionesSistema(
    pagina: number = 1,
    porPagina: number = 10,
    filtros?: {
      categoria?: string;
      estaActivo?: boolean;
      busqueda?: string;
    }
  ): Observable<ConfiguracionSistemaListResponse> {
    return this.mockDataService.getConfiguracionesSistema(pagina, porPagina, filtros);
  }

  /**
   * Obtiene una configuración de sistema específica por ID
   */
  getConfiguracionSistema(id: string): Observable<ConfiguracionSistema> {
    return this.mockDataService.getConfiguracionSistema(id);
  }

  /**
   * Crea una nueva configuración de sistema
   */
  createConfiguracionSistema(request: CreateConfiguracionSistemaRequest): Observable<ConfiguracionSistema> {
    return this.mockDataService.createConfiguracionSistema(request);
  }

  /**
   * Actualiza una configuración de sistema existente
   */
  updateConfiguracionSistema(id: string, request: UpdateConfiguracionSistemaRequest): Observable<ConfiguracionSistema> {
    return this.mockDataService.updateConfiguracionSistema(id, request);
  }

  /**
   * Elimina lógicamente una configuración de sistema
   */
  deleteConfiguracionSistema(id: string): Observable<boolean> {
    return this.mockDataService.deleteConfiguracionSistema(id);
  }

  /**
   * Restaura una configuración de sistema eliminada
   */
  restoreConfiguracionSistema(id: string): Observable<ConfiguracionSistema> {
    return this.mockDataService.restoreConfiguracionSistema(id);
  }

  /**
   * Obtiene configuraciones de sistema eliminadas
   */
  getConfiguracionesSistemaEliminadas(
    pagina: number = 1,
    porPagina: number = 10
  ): Observable<ConfiguracionSistemaListResponse> {
    return this.mockDataService.getConfiguracionesSistemaEliminadas(pagina, porPagina);
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS POR CATEGORÍA
  // ============================================================================

  /**
   * Obtiene todos los estados de empresa
   */
  getEstadosEmpresa(): Observable<ConfiguracionEnum[]> {
    return of(obtenerEstadosEmpresa()).pipe(delay(300));
  }

  /**
   * Obtiene todos los estados de vehículo
   */
  getEstadosVehiculo(): Observable<ConfiguracionEnum[]> {
    return of(obtenerEstadosVehiculo()).pipe(delay(300));
  }

  /**
   * Obtiene todos los estados de conductor
   */
  getEstadosConductor(): Observable<ConfiguracionEnum[]> {
    return of(obtenerEstadosConductor()).pipe(delay(300));
  }

  /**
   * Obtiene todos los estados de TUC
   */
  getEstadosTUC(): Observable<ConfiguracionEnum[]> {
    return of(obtenerEstadosTUC()).pipe(delay(300));
  }

  /**
   * Obtiene todos los tipos de resolución
   */
  getTiposResolucion(): Observable<ConfiguracionEnum[]> {
    return of(obtenerTiposResolucion()).pipe(delay(300));
  }

  /**
   * Obtiene todos los tipos de trámite
   */
  getTiposTramite(): Observable<ConfiguracionEnum[]> {
    return of(obtenerTiposTramite()).pipe(delay(300));
  }

  /**
   * Obtiene configuraciones por categoría
   */
  getConfiguracionesPorCategoria(categoria: string): Observable<ConfiguracionEnum[]> {
    return this.getConfiguracionesEnum(1, 100, { categoria }).pipe(
      map(response => response.configuraciones.filter(c => c.estaActivo))
    );
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  /**
   * Obtiene todas las categorías disponibles
   */
  getCategorias(): Observable<string[]> {
    const categorias = [
      ...Object.values(CATEGORIAS_CONFIGURACION.ESTADOS),
      ...Object.values(CATEGORIAS_CONFIGURACION.TIPOS),
      ...Object.values(CATEGORIAS_CONFIGURACION.HISTORIAL),
      ...Object.values(CATEGORIAS_CONFIGURACION.SISTEMA)
    ];
    return of(categorias).pipe(delay(200));
  }

  /**
   * Obtiene estadísticas de configuraciones
   */
  getEstadisticasConfiguraciones(): Observable<{
    totalEnums: number;
    totalSistema: number;
    porCategoria: Record<string, number>;
    activos: number;
    inactivos: number;
  }> {
    return this.mockDataService.getEstadisticasConfiguraciones();
  }

  /**
   * Exporta configuraciones a diferentes formatos
   */
  exportarConfiguraciones(
    tipo: 'EXCEL' | 'PDF' | 'CSV',
    filtros?: {
      categoria?: string;
      estaActivo?: boolean;
      busqueda?: string;
    }
  ): Observable<Blob> {
    return this.mockDataService.exportarConfiguraciones(tipo, filtros);
  }

  /**
   * Valida si un código de configuración ya existe
   */
  verificarDisponibilidadCodigo(codigo: string, excludeId?: string): Observable<boolean> {
    return this.mockDataService.verificarDisponibilidadCodigo(codigo, excludeId);
  }

  /**
   * Obtiene configuración por clave (para configuraciones de sistema)
   */
  getConfiguracionPorClave(clave: string): Observable<ConfiguracionSistema | null> {
    return this.mockDataService.getConfiguracionPorClave(clave);
  }

  /**
   * Actualiza configuración por clave
   */
  updateConfiguracionPorClave(clave: string, valor: string): Observable<ConfiguracionSistema> {
    return this.mockDataService.updateConfiguracionPorClave(clave, valor);
  }

  /**
   * Obtiene configuraciones visibles para el usuario actual
   */
  getConfiguracionesVisibles(): Observable<ConfiguracionSistema[]> {
    return this.mockDataService.getConfiguracionesVisibles();
  }

  /**
   * Inicializa configuraciones por defecto del sistema
   */
  inicializarConfiguracionesSistema(): Observable<boolean> {
    return this.mockDataService.inicializarConfiguracionesSistema();
  }

  /**
   * Resetea configuraciones a valores por defecto
   */
  resetearConfiguraciones(categoria?: string): Observable<boolean> {
    return this.mockDataService.resetearConfiguraciones(categoria);
  }

  /**
   * Obtiene historial de cambios de una configuración
   */
  getHistorialConfiguracion(id: string): Observable<any[]> {
    return this.mockDataService.getHistorialConfiguracion(id);
  }

  /**
   * Busca configuraciones por texto
   */
  buscarConfiguraciones(texto: string, categoria?: string): Observable<ConfiguracionEnum[]> {
    return this.mockDataService.buscarConfiguraciones(texto, categoria);
  }

  /**
   * Obtiene configuraciones relacionadas
   */
  getConfiguracionesRelacionadas(id: string): Observable<ConfiguracionEnum[]> {
    return this.mockDataService.getConfiguracionesRelacionadas(id);
  }

  /**
   * Valida configuración antes de guardar
   */
  validarConfiguracion(configuracion: CreateConfiguracionEnumRequest): Observable<{
    valido: boolean;
    errores: string[];
  }> {
    const errores: string[] = [];

    if (!configuracion.codigo || configuracion.codigo.trim().length === 0) {
      errores.push('El código es obligatorio');
    }

    if (!configuracion.nombre || configuracion.nombre.trim().length === 0) {
      errores.push('El nombre es obligatorio');
    }

    if (!configuracion.categoria || configuracion.categoria.trim().length === 0) {
      errores.push('La categoría es obligatoria');
    }

    if (!configuracion.valor || configuracion.valor.trim().length === 0) {
      errores.push('El valor es obligatorio');
    }

    if (configuracion.orden < 1) {
      errores.push('El orden debe ser mayor a 0');
    }

    return of({
      valido: errores.length === 0,
      errores
    }).pipe(delay(100));
  }
} 