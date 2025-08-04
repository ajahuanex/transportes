import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConductorService } from '../../services/conductor';
import { Conductor } from '../../models/conductor.model';

@Component({
  selector: 'app-conductores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conductores.html',
  styleUrls: ['./conductores.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConductoresComponent implements OnInit {
  
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
    this.cargarConductores();
  }

  cargarConductores(): void {
    this.cargando.set(true);
    
    this.conductorService.getConductores(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.conductores.set(response.conductores);
          this.totalConductores.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar conductores:', error);
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarConductores();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      dni: '',
      nombres: '',
      apellidos: '',
      licencia: ''
    });
    this.paginaActual.set(1);
    this.cargarConductores();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarConductores();
    }
  }

  nuevoConductor(): void {
    this.router.navigate(['conductores', 'nuevo']);
  }

  verConductor(id: string): void {
    this.router.navigate(['conductores', id]);
  }

  editarConductor(id: string): void {
    this.router.navigate(['conductores', id, 'editar']);
  }

  eliminarConductor(id: string): void {
    const motivo = prompt('Ingrese el motivo de la eliminación:');
    if (!motivo) {
      alert('Debe ingresar un motivo para la eliminación');
      return;
    }

    const confirmacion = confirm('¿Está seguro que desea eliminar este conductor? El conductor será marcado como eliminado pero podrá ser restaurado posteriormente.');
    
    if (confirmacion) {
      const request = {
        conductorId: id,
        motivo: motivo,
        usuario: 'admin' // TODO: Obtener del servicio de autenticación
      };

      this.conductorService.deleteConductor(request).subscribe({
        next: () => {
          this.cargarConductores();
          alert('Conductor eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar conductor:', error);
          alert('Error al eliminar el conductor');
        }
      });
    }
  }

  exportarDatos(): void {
    this.conductorService.exportarConductores(this.currentFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conductores_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error al exportar datos:', error);
        alert('Error al exportar los datos');
      }
    });
  }

  // Métodos para actualizar filtros
  actualizarFiltroDNI(dni: string): void {
    this.filtros.update(filtros => ({ ...filtros, dni }));
  }

  actualizarFiltroNombres(nombres: string): void {
    this.filtros.update(filtros => ({ ...filtros, nombres }));
  }

  actualizarFiltroApellidos(apellidos: string): void {
    this.filtros.update(filtros => ({ ...filtros, apellidos }));
  }

  actualizarFiltroLicencia(licencia: string): void {
    this.filtros.update(filtros => ({ ...filtros, licencia }));
  }
}
