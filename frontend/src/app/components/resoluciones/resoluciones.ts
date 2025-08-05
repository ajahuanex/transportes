import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResolucionService } from '../../services/resolucion';
import { 
  Resolucion as ResolucionModel
} from '../../models/resolucion.model';

@Component({
  selector: 'app-resoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resoluciones.html',
  styleUrls: ['./resoluciones.scss']
})
export class ResolucionesComponent implements OnInit {
  
  private resolucionService = inject(ResolucionService);
  private router = inject(Router);

  // Signals
  resoluciones = signal<ResolucionModel[]>([]);
  totalResoluciones = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);
  error = signal<string | null>(null);

  filtros = signal({
    nroResolucion: '',
    empresa: '',
    tipoResolucion: '',
    tipoTramite: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Computed properties
  currentResoluciones = computed(() => this.resoluciones());
  currentTotalResoluciones = computed(() => this.totalResoluciones());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  hasError = computed(() => this.error());
  currentFiltros = computed(() => this.filtros());

  // Computed para estadísticas
  estadisticas = computed(() => {
    const resoluciones = this.currentResoluciones();
    return {
      total: resoluciones.length,
      vigentes: resoluciones.filter(r => r.estaActivo).length,
      aprobadas: resoluciones.filter(r => r.estaActivo).length,
      enRevision: resoluciones.filter(r => r.estaActivo).length,
      rechazadas: resoluciones.filter(r => !r.estaActivo).length,
      vencidas: resoluciones.filter(r => !r.estaActivo).length
    };
  });

  ngOnInit(): void {
    this.cargarResoluciones();
  }

  cargarResoluciones(): void {
    this.error.set(null);
    this.cargando.set(true);

    this.resolucionService.getResoluciones(
      this.currentPaginaActual(),
      this.currentPorPagina(),
      {
        nroResolucion: this.currentFiltros().nroResolucion,
        empresaNombre: this.currentFiltros().empresa,
        tipoResolucion: this.currentFiltros().tipoResolucion as 'PADRE' | 'HIJO' | undefined,
        tipoTramite: this.currentFiltros().tipoTramite as any,
        estado: this.currentFiltros().estado as any,
        fechaEmisionDesde: this.currentFiltros().fechaDesde ? new Date(this.currentFiltros().fechaDesde) : undefined,
        fechaEmisionHasta: this.currentFiltros().fechaHasta ? new Date(this.currentFiltros().fechaHasta) : undefined
      }
    ).subscribe({
      next: (response) => {
        this.resoluciones.set(response.resoluciones);
        this.totalResoluciones.set(response.total);
        this.totalPaginas.set(response.totalPaginas);
        this.cargando.set(false);
      },
      error: (error: any) => {
        this.error.set('Error al cargar las resoluciones: ' + error.message);
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarResoluciones();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      nroResolucion: '',
      empresa: '',
      tipoResolucion: '',
      tipoTramite: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    this.paginaActual.set(1);
    this.cargarResoluciones();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarResoluciones();
    }
  }

  verResolucion(id: string): void {
    this.router.navigate(['/resoluciones', id]);
  }

  editarResolucion(id: string): void {
    this.router.navigate(['/resoluciones', id, 'editar']);
  }

  eliminarResolucion(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta resolución?')) {
            this.resolucionService.deleteResolucion({
        resolucionId: id,
        motivo: 'Eliminación por usuario',
        usuario: 'admin'
      }).subscribe({
        next: () => {
          this.cargarResoluciones();
        },
        error: (error: any) => {
          this.error.set('Error al eliminar la resolución: ' + error.message);
        }
      });
    }
  }

  nuevaResolucion(): void {
    this.router.navigate(['/resoluciones/nueva']);
  }

  verEliminadas(): void {
    this.router.navigate(['/resoluciones/eliminadas']);
  }

  exportarResoluciones(): void {
          this.resolucionService.exportarResoluciones({
        nroResolucion: this.currentFiltros().nroResolucion,
        empresaNombre: this.currentFiltros().empresa,
        tipoResolucion: this.currentFiltros().tipoResolucion as 'PADRE' | 'HIJO' | undefined,
        tipoTramite: this.currentFiltros().tipoTramite as any,
        estado: this.currentFiltros().estado as any,
        fechaEmisionDesde: this.currentFiltros().fechaDesde ? new Date(this.currentFiltros().fechaDesde) : undefined,
        fechaEmisionHasta: this.currentFiltros().fechaHasta ? new Date(this.currentFiltros().fechaHasta) : undefined
      }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resoluciones.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        this.error.set('Error al exportar las resoluciones: ' + error.message);
      }
    });
  }

  actualizarFiltroNroResolucion(valor: string): void {
    this.filtros.update(f => ({ ...f, nroResolucion: valor }));
  }

  actualizarFiltroEmpresa(valor: string): void {
    this.filtros.update(f => ({ ...f, empresa: valor }));
  }

  actualizarFiltroTipoResolucion(valor: string): void {
    this.filtros.update(f => ({ ...f, tipoResolucion: valor }));
  }

  actualizarFiltroTipoTramite(valor: string): void {
    this.filtros.update(f => ({ ...f, tipoTramite: valor }));
  }

  actualizarFiltroEstado(valor: string): void {
    this.filtros.update(f => ({ ...f, estado: valor }));
  }

  actualizarFiltroFechaDesde(valor: string): void {
    this.filtros.update(f => ({ ...f, fechaDesde: valor }));
  }

  actualizarFiltroFechaHasta(valor: string): void {
    this.filtros.update(f => ({ ...f, fechaHasta: valor }));
  }

  // Métodos auxiliares para mostrar información
  obtenerTipoResolucionTexto(tipo: string): string {
    const tipos = {
      'PADRE': 'Padre',
      'HIJO': 'Hijo'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }

  obtenerTipoTramiteTexto(tipo: string): string {
    const tipos = {
      'HABILITACION_VEHICULAR': 'Habilitación Vehicular',
      'INCREMENTO': 'Incremento',
      'SUSTITUCION': 'Sustitución',
      'RENOVACION_HABILITACION_VEHICULAR': 'Renovación'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }

  obtenerEstadoTexto(estado: string): string {
    const estados = {
      'ACTIVO': 'Activo',
      'INACTIVO': 'Inactivo',
      'VIGENTE': 'Vigente',
      'VENCIDA': 'Vencida'
    };
    return estados[estado as keyof typeof estados] || estado;
  }

  obtenerClaseEstado(estado: string): string {
    const clases = {
      'ACTIVO': 'badge-success',
      'INACTIVO': 'badge-secondary',
      'VIGENTE': 'badge-primary',
      'VENCIDA': 'badge-warning'
    };
    return clases[estado as keyof typeof clases] || 'badge-secondary';
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getPageNumbers(): number[] {
    const total = this.currentTotalPaginas();
    const current = this.currentPaginaActual();
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
} 