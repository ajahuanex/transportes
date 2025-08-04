import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculoService } from '../../services/vehiculo';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiculosComponent implements OnInit {
  
  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);
  
  // Signals para el estado del componente
  vehiculos = signal<Vehiculo[]>([]);
  totalVehiculos = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);

  filtros = signal({
    placa: '',
    marca: '',
    modelo: '',
    empresa: ''
  });

  // Computed properties
  currentVehiculos = computed(() => this.vehiculos());
  currentTotalVehiculos = computed(() => this.totalVehiculos());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  currentFiltros = computed(() => this.filtros());

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.cargando.set(true);
    
    this.vehiculoService.getVehiculos(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.vehiculos.set(response.vehiculos);
          this.totalVehiculos.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar vehículos:', error);
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarVehiculos();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      placa: '',
      marca: '',
      modelo: '',
      empresa: ''
    });
    this.paginaActual.set(1);
    this.cargarVehiculos();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarVehiculos();
    }
  }

  nuevoVehiculo(): void {
    this.router.navigate(['vehiculos', 'nuevo']);
  }

  verVehiculo(id: string): void {
    this.router.navigate(['vehiculos', id]);
  }

  editarVehiculo(id: string): void {
    this.router.navigate(['vehiculos', id, 'editar']);
  }

  eliminarVehiculo(id: string): void {
    const motivo = prompt('Ingrese el motivo de la eliminación:');
    if (!motivo) {
      alert('Debe ingresar un motivo para la eliminación');
      return;
    }

    const confirmacion = confirm('¿Está seguro que desea eliminar este vehículo? El vehículo será marcado como eliminado pero podrá ser restaurado posteriormente.');
    
    if (confirmacion) {
      const request = {
        vehiculoId: id,
        motivo: motivo,
        usuario: 'admin' // TODO: Obtener del servicio de autenticación
      };

      this.vehiculoService.deleteVehiculo(request).subscribe({
        next: () => {
          this.cargarVehiculos();
          alert('Vehículo eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar vehículo:', error);
          alert('Error al eliminar el vehículo');
        }
      });
    }
  }

  exportarDatos(): void {
    this.vehiculoService.exportarVehiculos(this.currentFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehiculos_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  actualizarFiltroPlaca(placa: string): void {
    this.filtros.update(filtros => ({ ...filtros, placa }));
  }

  actualizarFiltroMarca(marca: string): void {
    this.filtros.update(filtros => ({ ...filtros, marca }));
  }

  actualizarFiltroModelo(modelo: string): void {
    this.filtros.update(filtros => ({ ...filtros, modelo }));
  }

  actualizarFiltroEmpresa(empresa: string): void {
    this.filtros.update(filtros => ({ ...filtros, empresa }));
  }
}
