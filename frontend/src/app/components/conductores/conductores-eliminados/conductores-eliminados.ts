import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConductorService } from '../../../services/conductor';
import { Conductor } from '../../../models/conductor.model';

@Component({
  selector: 'app-conductores-eliminados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conductores-eliminados.html',
  styleUrls: ['./conductores-eliminados.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConductoresEliminadosComponent implements OnInit {
  
  private router = inject(Router);
  private conductorService = inject(ConductorService);
  
  // Signals para el estado del componente
  conductores = signal<Conductor[]>([]);
  totalConductores = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);

  filtros = signal({
    dni: '',
    nombres: '',
    apellidos: '',
    licencia: ''
  });

  // Computed properties
  currentConductores = computed(() => this.conductores());
  currentTotalConductores = computed(() => this.totalConductores());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  currentFiltros = computed(() => this.filtros());

  ngOnInit(): void {
    this.cargarConductoresEliminados();
  }

  cargarConductoresEliminados(): void {
    this.cargando.set(true);
    
    this.conductorService.getConductoresEliminados(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.conductores.set(response.conductores);
          this.totalConductores.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar conductores eliminados:', error);
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarConductoresEliminados();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      dni: '',
      nombres: '',
      apellidos: '',
      licencia: ''
    });
    this.paginaActual.set(1);
    this.cargarConductoresEliminados();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarConductoresEliminados();
    }
  }

  restaurarConductor(id: string): void {
    if (confirm('¿Está seguro que desea restaurar este conductor?')) {
      this.conductorService.restoreConductor({
        conductorId: id,
        motivo: 'Restauración manual',
        usuario: 'admin'
      }).subscribe({
        next: () => {
          alert('Conductor restaurado correctamente');
          this.cargarConductoresEliminados();
        },
        error: (error: any) => {
          console.error('Error al restaurar conductor:', error);
          alert('Error al restaurar el conductor');
        }
      });
    }
  }

  eliminarPermanente(id: string): void {
    if (confirm('¿Está seguro que desea eliminar permanentemente este conductor? Esta acción no se puede deshacer.')) {
      this.conductorService.deleteConductorPermanente(id).subscribe({
        next: () => {
          alert('Conductor eliminado permanentemente');
          this.cargarConductoresEliminados();
        },
        error: (error: any) => {
          console.error('Error al eliminar conductor:', error);
          alert('Error al eliminar el conductor');
        }
      });
    }
  }

  volverAtras(): void {
    this.router.navigate(['conductores']);
  }

  exportarDatos(): void {
    this.conductorService.exportarConductores(this.currentFiltros()).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conductores-eliminados.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error('Error al exportar datos:', error);
        alert('Error al exportar los datos');
      }
    });
  }

  actualizarFiltroDNI(dni: string): void {
    this.filtros.update(f => ({ ...f, dni }));
  }

  actualizarFiltroNombres(nombres: string): void {
    this.filtros.update(f => ({ ...f, nombres }));
  }

  actualizarFiltroApellidos(apellidos: string): void {
    this.filtros.update(f => ({ ...f, apellidos }));
  }

  actualizarFiltroLicencia(licencia: string): void {
    this.filtros.update(f => ({ ...f, licencia }));
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerEstadoClass(estado: string): string {
    switch (estado) {
      case 'HABILITADO':
        return 'estado-habilitado';
      case 'INHABILITADO':
        return 'estado-inhabilitado';
      case 'SUSPENDIDO':
        return 'estado-suspendido';
      default:
        return 'estado-desconocido';
    }
  }

  // Método para generar array de páginas
  generarArrayPaginas(total: number): number[] {
    return Array.from({length: total}, (_, i) => i + 1);
  }
} 