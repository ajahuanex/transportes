import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TUCService } from '../../services/tuc';
import { 
  TUC as TUCModel,
  EstadoTUC
} from '../../models/tuc.model';

@Component({
  selector: 'app-tucs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tucs.html',
  styleUrls: ['./tucs.scss']
})
export class TUCsComponent implements OnInit {
  
  private tucService = inject(TUCService);
  private router = inject(Router);

  // Signals
  tucs = signal<TUCModel[]>([]);
  totalTUCs = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);
  error = signal<string | null>(null);

  filtros = signal({
    nroTuc: '',
    vehiculo: '',
    empresa: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Computed properties
  currentTUCs = computed(() => this.tucs());
  currentTotalTUCs = computed(() => this.totalTUCs());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  hasError = computed(() => this.error());
  currentFiltros = computed(() => this.filtros());

  // Computed para estadísticas
  estadisticas = computed(() => {
    const tucs = this.currentTUCs();
    return {
      total: tucs.length,
      vigentes: tucs.filter(t => t.estado === EstadoTUC.VIGENTE).length,
      vencidos: tucs.filter(t => t.estado === EstadoTUC.VENCIDA).length,
      dadosDeBaja: tucs.filter(t => t.estado === EstadoTUC.DADA_DE_BAJA).length,
      desechados: tucs.filter(t => t.estado === EstadoTUC.DESECHADA).length,
      suspendidos: tucs.filter(t => t.estado === EstadoTUC.SUSPENDIDA).length
    };
  });

  ngOnInit(): void {
    this.cargarTUCs();
  }

  cargarTUCs(): void {
    this.error.set(null);
    this.cargando.set(true);

    this.tucService.getTUCs(
      this.currentPaginaActual(),
      this.currentPorPagina(),
      this.currentFiltros()
    ).subscribe({
      next: (response) => {
        this.tucs.set(response.tucs);
        this.totalTUCs.set(response.total);
        this.totalPaginas.set(response.totalPaginas);
        this.cargando.set(false);
      },
      error: (error: any) => {
        this.error.set('Error al cargar los TUCs: ' + error.message);
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarTUCs();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      nroTuc: '',
      vehiculo: '',
      empresa: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    this.paginaActual.set(1);
    this.cargarTUCs();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarTUCs();
    }
  }

  verTUC(id: string): void {
    this.router.navigate(['/tucs', id]);
  }

  editarTUC(id: string): void {
    this.router.navigate(['/tucs', id, 'editar']);
  }

  eliminarTUC(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este TUC?')) {
      this.tucService.deleteTUC({
        tucId: id,
        motivo: 'Eliminación por usuario',
        usuarioEliminacion: 'admin'
      }).subscribe({
        next: () => {
          this.cargarTUCs();
        },
        error: (error: any) => {
          this.error.set('Error al eliminar el TUC: ' + error.message);
        }
      });
    }
  }

  nuevoTUC(): void {
    this.router.navigate(['/tucs/nuevo']);
  }

  verEliminados(): void {
    this.router.navigate(['/tucs/eliminados']);
  }

  exportarTUCs(): void {
    this.tucService.exportarTUCs(this.currentFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tucs.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        this.error.set('Error al exportar los TUCs: ' + error.message);
      }
    });
  }

  verificarTUC(qrCode: string): void {
    this.tucService.verificarTUC(qrCode).subscribe({
      next: (tuc) => {
        this.router.navigate(['/tucs', tuc.id]);
      },
      error: (error: any) => {
        this.error.set('TUC no encontrado: ' + error.message);
      }
    });
  }

  actualizarFiltroNroTUC(valor: string): void {
    this.filtros.update(f => ({ ...f, nroTuc: valor }));
  }

  actualizarFiltroVehiculo(valor: string): void {
    this.filtros.update(f => ({ ...f, vehiculo: valor }));
  }

  actualizarFiltroEmpresa(valor: string): void {
    this.filtros.update(f => ({ ...f, empresa: valor }));
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
  obtenerEstadoTexto(estado: EstadoTUC): string {
    const estados = {
      [EstadoTUC.VIGENTE]: 'Vigente',
      [EstadoTUC.VENCIDA]: 'Vencido',
      [EstadoTUC.DADA_DE_BAJA]: 'Dado de Baja',
      [EstadoTUC.DESECHADA]: 'Desechado',
      [EstadoTUC.SUSPENDIDA]: 'Suspendido'
    };
    return estados[estado] || estado;
  }

  obtenerClaseEstado(estado: EstadoTUC): string {
    const clases = {
      [EstadoTUC.VIGENTE]: 'badge-success',
      [EstadoTUC.VENCIDA]: 'badge-warning',
      [EstadoTUC.DADA_DE_BAJA]: 'badge-danger',
      [EstadoTUC.DESECHADA]: 'badge-dark',
      [EstadoTUC.SUSPENDIDA]: 'badge-secondary'
    };
    return clases[estado] || 'badge-secondary';
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

  copiarQR(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      // Mostrar notificación de éxito
      console.log('URL copiada al portapapeles');
    }).catch(err => {
      console.error('Error al copiar URL:', err);
    });
  }
} 