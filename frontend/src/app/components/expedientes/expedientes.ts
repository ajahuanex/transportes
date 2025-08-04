import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpedienteService } from '../../services/expediente';
import { Expediente, ExpedienteFilter, EstadoExpediente, TipoExpediente, TipoTramite } from '../../models/expediente.model';
import { ColumnSelectorComponent, ColumnOption } from '../shared/column-selector/column-selector';
import { ExportService, ColumnConfig } from '../../services/export.service';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnSelectorComponent],
  templateUrl: './expedientes.html',
  styleUrls: ['./expedientes.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpedientesComponent implements OnInit {
  private router = inject(Router);
  private expedienteService = inject(ExpedienteService);
  private exportService = inject(ExportService);

  // Signals para el estado del componente
  expedientes = signal<Expediente[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  totalExpedientes = signal(0);
  pagina = signal(1);
  porPagina = signal(10);

  // Filtros
  filtros = signal<ExpedienteFilter>({
    numero: '',
    tipo: undefined,
    tipoTramite: undefined,
    estado: undefined,
    solicitanteId: '',
    prioridad: undefined,
    responsable: '',
    busquedaGeneral: ''
  });

  // Control de filtros avanzados
  mostrarFiltrosAvanzados = signal(false);

  // Control de dropdowns
  dropdownsAbiertos = signal<string[]>([]);

  // Configuración de columnas
  columnas = signal<ColumnOption[]>([
    { key: 'numero', label: 'Número', visible: true, sortable: true },
    { key: 'tipo', label: 'Tipo', visible: true, sortable: true },
    { key: 'tipoTramite', label: 'Trámite', visible: true, sortable: true },
    { key: 'solicitante.nombre', label: 'Solicitante', visible: true, sortable: true },
    { key: 'solicitante.documento', label: 'Documento', visible: false, sortable: true },
    { key: 'estado', label: 'Estado', visible: true, sortable: true },
    { key: 'prioridad', label: 'Prioridad', visible: true, sortable: true },
    { key: 'responsable', label: 'Responsable', visible: false, sortable: true },
    { key: 'fechaApertura', label: 'Fecha Apertura', visible: true, sortable: true },
    { key: 'fechaLimite', label: 'Fecha Límite', visible: false, sortable: true },
    { key: 'descripcion', label: 'Descripción', visible: false, sortable: false },
    { key: 'fechaCreacion', label: 'Fecha Registro', visible: true, sortable: true }
  ]);

  // Computed properties
  currentExpedientes = computed(() => this.expedientes());
  currentIsLoading = computed(() => this.isLoading());
  currentError = computed(() => this.error());
  currentTotalExpedientes = computed(() => this.totalExpedientes());
  currentFiltros = computed(() => this.filtros());
  currentColumnas = computed(() => this.columnas());

  // Enums para el template
  EstadoExpediente = EstadoExpediente;
  TipoExpediente = TipoExpediente;
  TipoTramite = TipoTramite;

  ngOnInit(): void {
    this.cargarExpedientes();
  }

  // Métodos principales
  cargarExpedientes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.expedienteService.getExpedientes(this.currentFiltros(), this.pagina(), this.porPagina())
      .subscribe({
        next: (response) => {
          this.expedientes.set(response.expedientes);
          this.totalExpedientes.set(response.total);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Error al cargar los expedientes');
          this.isLoading.set(false);
          console.error('Error cargando expedientes:', err);
        }
      });
  }

  aplicarFiltros(): void {
    this.pagina.set(1);
    this.cargarExpedientes();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      numero: '',
      tipo: undefined,
      tipoTramite: undefined,
      estado: undefined,
      solicitanteId: '',
      prioridad: undefined,
      responsable: '',
      busquedaGeneral: ''
    });
    this.aplicarFiltros();
  }

  // Control de filtros avanzados
  toggleFiltrosAvanzados(): void {
    this.mostrarFiltrosAvanzados.update(mostrar => !mostrar);
  }

  // Control de dropdowns
  toggleDropdown(dropdown: HTMLElement): void {
    const expedienteId = this.getExpedienteIdFromDropdown(dropdown);
    if (!expedienteId) return;

    const currentDropdowns = this.dropdownsAbiertos();
    if (currentDropdowns.includes(expedienteId)) {
      this.dropdownsAbiertos.set(currentDropdowns.filter(id => id !== expedienteId));
    } else {
      this.dropdownsAbiertos.set([...currentDropdowns, expedienteId]);
    }
  }

  private getExpedienteIdFromDropdown(dropdown: HTMLElement): string | null {
    const row = dropdown.closest('tr');
    if (!row) return null;
    
    const expedienteId = row.getAttribute('data-expediente-id');
    return expedienteId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownsAbiertos.set([]);
    }
  }

  // Navegación
  nuevoExpediente(): void {
    this.router.navigate(['/expedientes/nuevo']);
  }

  verExpediente(id: string): void {
    this.router.navigate(['/expedientes', id]);
  }

  editarExpediente(id: string): void {
    this.router.navigate(['/expedientes', id, 'editar']);
  }

  verExpedientesEliminados(): void {
    this.router.navigate(['/expedientes/eliminados']);
  }

  // CRUD Operations
  eliminarExpediente(id: string): void {
    const motivo = prompt('Ingrese el motivo de eliminación:');
    if (!motivo) return;

    const request = {
      id,
      motivo,
      usuario: 'usuario_actual' // TODO: Obtener del servicio de autenticación
    };

    this.expedienteService.deleteExpediente(request).subscribe({
      next: () => {
        this.cargarExpedientes();
        // TODO: Mostrar notificación de éxito
      },
      error: (err) => {
        console.error('Error eliminando expediente:', err);
        // TODO: Mostrar notificación de error
      }
    });
  }

  cambiarEstado(id: string, nuevoEstado: string): void {
    const observaciones = prompt('Ingrese observaciones (opcional):');
    
    this.expedienteService.cambiarEstadoExpediente(id, nuevoEstado, observaciones || undefined)
      .subscribe({
        next: () => {
          this.cargarExpedientes();
          this.dropdownsAbiertos.set([]);
          // TODO: Mostrar notificación de éxito
        },
        error: (err) => {
          console.error('Error cambiando estado:', err);
          // TODO: Mostrar notificación de error
        }
      });
  }

  // Exportación
  exportarDatos(): void {
    const columnasConfig: ColumnConfig[] = this.currentColumnas()
      .filter(col => col.visible)
      .map(col => ({
        key: col.key,
        label: col.label,
        visible: col.visible,
        formatter: this.getColumnFormatter(col.key)
      }));

    const datos = this.currentExpedientes().map(expediente => {
      const row: any = {};
      columnasConfig.forEach(col => {
        row[col.key] = this.getNestedValue(expediente, col.key);
      });
      return row;
    });

    this.exportService.exportToCSV(datos, columnasConfig, {
      filename: `expedientes_${new Date().toISOString().split('T')[0]}`,
      format: 'csv'
    });
  }

  // Configuración de columnas
  onColumnasChange(columnas: ColumnOption[]): void {
    this.columnas.set(columnas);
  }

  // Formatters para columnas
  getColumnFormatter(key: string): ((value: any) => string) | undefined {
    const formatters: { [key: string]: (value: any) => string } = {
      tipo: (value: TipoExpediente) => {
        const tipos = {
          [TipoExpediente.EMPRESA_TRANSPORTE]: 'Empresa Transporte',
          [TipoExpediente.VEHICULO]: 'Vehículo',
          [TipoExpediente.CONDUCTOR]: 'Conductor',
          [TipoExpediente.RUTA]: 'Ruta',
          [TipoExpediente.TUC]: 'TUC',
          [TipoExpediente.RESOLUCION]: 'Resolución',
          [TipoExpediente.OTRO]: 'Otro'
        };
        return tipos[value] || value;
      },
      tipoTramite: (value: string) => {
        const tramites: Record<string, string> = {
          'SOLICITUD_INICIAL': 'Solicitud Inicial',
          'RENOVACION': 'Renovación',
          'MODIFICACION': 'Modificación',
          'CANCELACION': 'Cancelación',
          'SUSPENSION': 'Suspensión',
          'REACTIVACION': 'Reactivación',
          'RENOVACION_HABILITACION_VEHICULAR': 'Renovación Habilitación Vehicular'
        };
        return tramites[value] || value;
      },
      estado: (value: string) => {
        const estados: Record<string, string> = {
          'ABIERTO': 'Abierto',
          'EN_TRAMITE': 'En Trámite',
          'PENDIENTE_DOCUMENTACION': 'Pendiente Documentación',
          'EN_REVISION': 'En Revisión',
          'APROBADO': 'Aprobado',
          'RECHAZADO': 'Rechazado',
          'CERRADO': 'Cerrado',
          'SUSPENDIDO': 'Suspendido',
          'EN_EVALUACION': 'En Evaluación'
        };
        return estados[value] || value;
      },
      prioridad: (value: string) => {
        const prioridades = {
          'BAJA': 'Baja',
          'MEDIA': 'Media',
          'ALTA': 'Alta',
          'URGENTE': 'Urgente'
        };
        return prioridades[value as keyof typeof prioridades] || value;
      }
    };
    return formatters[key];
  }

  // Utilidades
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      'ABIERTO': 'estado-abierto',
      'EN_TRAMITE': 'estado-tramite',
      'PENDIENTE_DOCUMENTACION': 'estado-pendiente',
      'EN_REVISION': 'estado-revision',
      'APROBADO': 'estado-aprobado',
      'RECHAZADO': 'estado-rechazado',
      'CERRADO': 'estado-cerrado',
      'SUSPENDIDO': 'estado-suspendido',
      'EN_EVALUACION': 'estado-evaluacion'
    };
    return `badge ${clases[estado] || ''}`;
  }

  getPrioridadClass(prioridad: string): string {
    const clases = {
      'BAJA': 'prioridad-baja',
      'MEDIA': 'prioridad-media',
      'ALTA': 'prioridad-alta',
      'URGENTE': 'prioridad-urgente'
    };
    return `badge ${clases[prioridad as keyof typeof clases] || ''}`;
  }

  // Actualizadores de filtros
  actualizarBusquedaGeneral(busqueda: string): void {
    this.filtros.update(f => ({ ...f, busquedaGeneral: busqueda }));
  }

  actualizarFiltroNumero(numero: string): void {
    this.filtros.update(f => ({ ...f, numero }));
  }

  actualizarFiltroTipo(tipo: TipoExpediente | undefined): void {
    this.filtros.update(f => ({ ...f, tipo }));
  }

  actualizarFiltroTipoTramite(tipoTramite: string | undefined): void {
    this.filtros.update(f => ({ ...f, tipoTramite }));
  }

  actualizarFiltroEstado(estado: string | undefined): void {
    this.filtros.update(f => ({ ...f, estado }));
  }

  actualizarFiltroSolicitante(solicitanteId: string): void {
    this.filtros.update(f => ({ ...f, solicitanteId }));
  }

  actualizarFiltroPrioridad(prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' | undefined): void {
    this.filtros.update(f => ({ ...f, prioridad }));
  }

  actualizarFiltroResponsable(responsable: string): void {
    this.filtros.update(f => ({ ...f, responsable }));
  }

  // Utilidades
  isFechaVencida(fecha: Date): boolean {
    return new Date(fecha) < new Date();
  }
} 