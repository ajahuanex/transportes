import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionService } from '../../services/configuracion';
import {
  ConfiguracionEnum,
  ConfiguracionSistema,
  CATEGORIAS_CONFIGURACION
} from '../../shared/models/configuracion.model';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuraciones.html',
  styleUrls: ['./configuraciones.scss']
})
export class ConfiguracionesComponent implements OnInit {
  private configuracionService = inject(ConfiguracionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // ============================================================================
  // SIGNALS
  // ============================================================================

  // Configuraciones de Enum
  configuracionesEnum = signal<ConfiguracionEnum[]>([]);
  totalConfiguracionesEnum = signal<number>(0);
  paginaActualEnum = signal<number>(1);
  porPaginaEnum = signal<number>(10);
  totalPaginasEnum = signal<number>(0);
  cargandoEnum = signal<boolean>(false);
  errorEnum = signal<string>('');

  // Configuraciones de Sistema
  configuracionesSistema = signal<ConfiguracionSistema[]>([]);
  totalConfiguracionesSistema = signal<number>(0);
  paginaActualSistema = signal<number>(1);
  porPaginaSistema = signal<number>(10);
  totalPaginasSistema = signal<number>(0);
  cargandoSistema = signal<boolean>(false);
  errorSistema = signal<string>('');

  // Filtros
  filtrosEnum = signal<{
    categoria?: string;
    estaActivo?: boolean;
    busqueda?: string;
  }>({});

  filtrosSistema = signal<{
    categoria?: string;
    busqueda?: string;
  }>({});

  // Estadísticas
  estadisticas = signal<{
    totalEnums: number;
    totalSistema: number;
    porCategoria: Record<string, number>;
    activos: number;
    inactivos: number;
  }>({
    totalEnums: 0,
    totalSistema: 0,
    porCategoria: {},
    activos: 0,
    inactivos: 0
  });

  // Formularios
  filtroForm = this.fb.group({
    categoria: [''],
    estaActivo: [null],
    busqueda: ['']
  });

  filtroSistemaForm = this.fb.group({
    categoria: [''],
    busqueda: ['']
  });

  // UI State
  tabActivo = signal<'enums' | 'sistema'>('enums');
  mostrarFiltros = signal<boolean>(false);
  cargandoEstadisticas = signal<boolean>(false);

  // Utilidades
  Math = Math;

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  hasErrorEnum = computed(() => this.errorEnum().length > 0);
  hasErrorSistema = computed(() => this.errorSistema().length > 0);

  categoriasDisponibles = computed(() => [
    { value: '', label: 'Todas las categorías' },
    { value: CATEGORIAS_CONFIGURACION.ESTADOS.EMPRESA, label: 'Estados de Empresa' },
    { value: CATEGORIAS_CONFIGURACION.ESTADOS.VEHICULO, label: 'Estados de Vehículo' },
    { value: CATEGORIAS_CONFIGURACION.ESTADOS.CONDUCTOR, label: 'Estados de Conductor' },
    { value: CATEGORIAS_CONFIGURACION.ESTADOS.TUC, label: 'Estados de TUC' },
    { value: CATEGORIAS_CONFIGURACION.ESTADOS.EXPEDIENTE, label: 'Estados de Expediente' },
    { value: CATEGORIAS_CONFIGURACION.TIPOS.RESOLUCION, label: 'Tipos de Resolución' },
    { value: CATEGORIAS_CONFIGURACION.TIPOS.TRAMITE, label: 'Tipos de Trámite' },
    { value: CATEGORIAS_CONFIGURACION.TIPOS.DOCUMENTO, label: 'Tipos de Documento' }
  ]);

  categoriasSistemaDisponibles = computed(() => [
    { value: '', label: 'Todas las categorías' },
    { value: CATEGORIAS_CONFIGURACION.SISTEMA.GENERAL, label: 'Sistema General' },
    { value: CATEGORIAS_CONFIGURACION.SISTEMA.NOTIFICACIONES, label: 'Notificaciones' },
    { value: CATEGORIAS_CONFIGURACION.SISTEMA.REPORTES, label: 'Reportes' },
    { value: CATEGORIAS_CONFIGURACION.SISTEMA.SEGURIDAD, label: 'Seguridad' }
  ]);

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  ngOnInit(): void {
    this.cargarDatos();
    this.setupFormListeners();
  }

  // ============================================================================
  // MÉTODOS DE CARGA DE DATOS
  // ============================================================================

  cargarDatos(): void {
    this.cargarConfiguracionesEnum();
    this.cargarConfiguracionesSistema();
    this.cargarEstadisticas();
  }

  cargarConfiguracionesEnum(): void {
    this.cargandoEnum.set(true);
    this.errorEnum.set('');

    this.configuracionService.getConfiguracionesEnum(
      this.paginaActualEnum(),
      this.porPaginaEnum(),
      this.filtrosEnum()
    ).subscribe({
      next: (response) => {
        this.configuracionesEnum.set(response.configuraciones);
        this.totalConfiguracionesEnum.set(response.total);
        this.totalPaginasEnum.set(response.totalPaginas);
        this.cargandoEnum.set(false);
      },
      error: (error) => {
        this.errorEnum.set('Error al cargar configuraciones: ' + error.message);
        this.cargandoEnum.set(false);
      }
    });
  }

  cargarConfiguracionesSistema(): void {
    this.cargandoSistema.set(true);
    this.errorSistema.set('');

    this.configuracionService.getConfiguracionesSistema(
      this.paginaActualSistema(),
      this.porPaginaSistema(),
      this.filtrosSistema()
    ).subscribe({
      next: (response) => {
        this.configuracionesSistema.set(response.configuraciones);
        this.totalConfiguracionesSistema.set(response.total);
        this.totalPaginasSistema.set(response.totalPaginas);
        this.cargandoSistema.set(false);
      },
      error: (error) => {
        this.errorSistema.set('Error al cargar configuraciones de sistema: ' + error.message);
        this.cargandoSistema.set(false);
      }
    });
  }

  cargarEstadisticas(): void {
    this.cargandoEstadisticas.set(true);

    this.configuracionService.getEstadisticasConfiguraciones().subscribe({
      next: (stats) => {
        this.estadisticas.set(stats);
        this.cargandoEstadisticas.set(false);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.cargandoEstadisticas.set(false);
      }
    });
  }

  // ============================================================================
  // MÉTODOS DE FILTRADO
  // ============================================================================

  setupFormListeners(): void {
    this.filtroForm.valueChanges.subscribe(values => {
      this.filtrosEnum.set({
        categoria: values.categoria || undefined,
        estaActivo: values.estaActivo !== null ? values.estaActivo : undefined,
        busqueda: values.busqueda || undefined
      });
      this.paginaActualEnum.set(1);
      this.cargarConfiguracionesEnum();
    });

    this.filtroSistemaForm.valueChanges.subscribe(values => {
      this.filtrosSistema.set({
        categoria: values.categoria || undefined,
        busqueda: values.busqueda || undefined
      });
      this.paginaActualSistema.set(1);
      this.cargarConfiguracionesSistema();
    });
  }

  aplicarFiltros(): void {
    this.paginaActualEnum.set(1);
    this.paginaActualSistema.set(1);
    this.cargarDatos();
  }

  limpiarFiltros(): void {
    this.filtroForm.reset();
    this.filtroSistemaForm.reset();
    this.filtrosEnum.set({});
    this.filtrosSistema.set({});
    this.paginaActualEnum.set(1);
    this.paginaActualSistema.set(1);
    this.cargarDatos();
  }

  // ============================================================================
  // MÉTODOS DE PAGINACIÓN
  // ============================================================================

  cambiarPaginaEnum(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginasEnum()) {
      this.paginaActualEnum.set(pagina);
      this.cargarConfiguracionesEnum();
    }
  }

  cambiarPaginaSistema(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginasSistema()) {
      this.paginaActualSistema.set(pagina);
      this.cargarConfiguracionesSistema();
    }
  }

  getPageNumbersEnum(): number[] {
    const total = this.totalPaginasEnum();
    const actual = this.paginaActualEnum();
    const pages: number[] = [];

    const start = Math.max(1, actual - 2);
    const end = Math.min(total, actual + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getPageNumbersSistema(): number[] {
    const total = this.totalPaginasSistema();
    const actual = this.paginaActualSistema();
    const pages: number[] = [];

    const start = Math.max(1, actual - 2);
    const end = Math.min(total, actual + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ============================================================================
  // MÉTODOS DE NAVEGACIÓN
  // ============================================================================

  verConfiguracionEnum(id: string): void {
    this.router.navigate(['/configuraciones/enum', id]);
  }

  editarConfiguracionEnum(id: string): void {
    this.router.navigate(['/configuraciones/enum', id, 'editar']);
  }

  nuevaConfiguracionEnum(): void {
    this.router.navigate(['/configuraciones/enum/nuevo']);
  }

  verConfiguracionSistema(id: string): void {
    this.router.navigate(['/configuraciones/sistema', id]);
  }

  editarConfiguracionSistema(id: string): void {
    this.router.navigate(['/configuraciones/sistema', id, 'editar']);
  }

  nuevaConfiguracionSistema(): void {
    this.router.navigate(['/configuraciones/sistema/nuevo']);
  }

  verEliminadasEnum(): void {
    this.router.navigate(['/configuraciones/enum/eliminadas']);
  }

  verEliminadasSistema(): void {
    this.router.navigate(['/configuraciones/sistema/eliminadas']);
  }

  // ============================================================================
  // MÉTODOS DE ACCIÓN
  // ============================================================================

  eliminarConfiguracionEnum(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta configuración?')) {
      this.configuracionService.deleteConfiguracionEnum(id).subscribe({
        next: () => {
          this.mostrarNotificacion('Configuración eliminada correctamente', 'success');
          this.cargarDatos();
        },
        error: (error) => {
          this.mostrarNotificacion('Error al eliminar configuración: ' + error.message, 'error');
        }
      });
    }
  }

  eliminarConfiguracionSistema(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta configuración de sistema?')) {
      this.configuracionService.deleteConfiguracionSistema(id).subscribe({
        next: () => {
          this.mostrarNotificacion('Configuración de sistema eliminada correctamente', 'success');
          this.cargarDatos();
        },
        error: (error) => {
          this.mostrarNotificacion('Error al eliminar configuración: ' + error.message, 'error');
        }
      });
    }
  }

  exportarConfiguraciones(tipo: 'EXCEL' | 'PDF' | 'CSV'): void {
    const filtros = this.tabActivo() === 'enums' ? this.filtrosEnum() : this.filtrosSistema();
    
    this.configuracionService.exportarConfiguraciones(tipo, filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `configuraciones_${tipo.toLowerCase()}_${new Date().toISOString().split('T')[0]}.${tipo.toLowerCase()}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.mostrarNotificacion(`Configuraciones exportadas en formato ${tipo}`, 'success');
      },
      error: (error) => {
        this.mostrarNotificacion('Error al exportar configuraciones: ' + error.message, 'error');
      }
    });
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  cambiarTab(tab: 'enums' | 'sistema'): void {
    this.tabActivo.set(tab);
  }

  toggleFiltros(): void {
    this.mostrarFiltros.update(value => !value);
  }

  obtenerClaseEstado(estaActivo: boolean): string {
    return estaActivo ? 'badge-success' : 'badge-secondary';
  }

  obtenerClaseCategoria(categoria: string): string {
    const clases: Record<string, string> = {
      [CATEGORIAS_CONFIGURACION.ESTADOS.EMPRESA]: 'badge-primary',
      [CATEGORIAS_CONFIGURACION.ESTADOS.VEHICULO]: 'badge-info',
      [CATEGORIAS_CONFIGURACION.ESTADOS.CONDUCTOR]: 'badge-warning',
      [CATEGORIAS_CONFIGURACION.ESTADOS.TUC]: 'badge-success',
      [CATEGORIAS_CONFIGURACION.ESTADOS.EXPEDIENTE]: 'badge-secondary',
      [CATEGORIAS_CONFIGURACION.TIPOS.RESOLUCION]: 'badge-primary',
      [CATEGORIAS_CONFIGURACION.TIPOS.TRAMITE]: 'badge-info',
      [CATEGORIAS_CONFIGURACION.TIPOS.DOCUMENTO]: 'badge-warning'
    };
    return clases[categoria] || 'badge-secondary';
  }

  obtenerClaseTipoSistema(tipo: string): string {
    const clases: Record<string, string> = {
      'STRING': 'badge-primary',
      'NUMBER': 'badge-info',
      'BOOLEAN': 'badge-success',
      'JSON': 'badge-warning'
    };
    return clases[tipo] || 'badge-secondary';
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerNombreCategoria(categoria: string): string {
    const nombres: Record<string, string> = {
      [CATEGORIAS_CONFIGURACION.ESTADOS.EMPRESA]: 'Estados de Empresa',
      [CATEGORIAS_CONFIGURACION.ESTADOS.VEHICULO]: 'Estados de Vehículo',
      [CATEGORIAS_CONFIGURACION.ESTADOS.CONDUCTOR]: 'Estados de Conductor',
      [CATEGORIAS_CONFIGURACION.ESTADOS.TUC]: 'Estados de TUC',
      [CATEGORIAS_CONFIGURACION.ESTADOS.EXPEDIENTE]: 'Estados de Expediente',
      [CATEGORIAS_CONFIGURACION.TIPOS.RESOLUCION]: 'Tipos de Resolución',
      [CATEGORIAS_CONFIGURACION.TIPOS.TRAMITE]: 'Tipos de Trámite',
      [CATEGORIAS_CONFIGURACION.TIPOS.DOCUMENTO]: 'Tipos de Documento',
      [CATEGORIAS_CONFIGURACION.SISTEMA.GENERAL]: 'Sistema General',
      [CATEGORIAS_CONFIGURACION.SISTEMA.NOTIFICACIONES]: 'Notificaciones',
      [CATEGORIAS_CONFIGURACION.SISTEMA.REPORTES]: 'Reportes',
      [CATEGORIAS_CONFIGURACION.SISTEMA.SEGURIDAD]: 'Seguridad'
    };
    return nombres[categoria] || categoria;
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success'): void {
    // Placeholder para sistema de notificaciones
    console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    // En producción, aquí se integraría con un servicio de notificaciones
  }

  refrescarDatos(): void {
    this.cargarDatos();
  }

  cambiarElementosPorPagina(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const porPagina = parseInt(target.value, 10);
    this.porPaginaEnum.set(porPagina);
    this.porPaginaSistema.set(porPagina);
    this.paginaActualEnum.set(1);
    this.paginaActualSistema.set(1);
    this.cargarDatos();
  }
} 