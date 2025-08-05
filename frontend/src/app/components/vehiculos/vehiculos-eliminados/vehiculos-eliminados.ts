import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculoService } from '../../../services/vehiculo';
import { Vehiculo } from '../../../models/vehiculo.model';

@Component({
  selector: 'app-vehiculos-eliminados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos-eliminados.html',
  styleUrls: ['./vehiculos-eliminados.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiculosEliminadosComponent implements OnInit {
  
  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);
  
  // Signals para el estado del componente
  vehiculosEliminados = signal<Vehiculo[]>([]);
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
  currentVehiculosEliminados = computed(() => this.vehiculosEliminados());
  currentTotalVehiculos = computed(() => this.totalVehiculos());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  currentFiltros = computed(() => this.filtros());

  ngOnInit(): void {
    this.cargarVehiculosEliminados();
  }

  cargarVehiculosEliminados(): void {
    this.cargando.set(true);
    
    this.vehiculoService.getVehiculosEliminados(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.vehiculosEliminados.set(response.vehiculos);
          this.totalVehiculos.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error: any) => {
          console.error('Error al cargar vehículos eliminados:', error);
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarVehiculosEliminados();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      placa: '',
      marca: '',
      modelo: '',
      empresa: ''
    });
    this.paginaActual.set(1);
    this.cargarVehiculosEliminados();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarVehiculosEliminados();
    }
  }

  verVehiculo(id: string): void {
    this.router.navigate(['vehiculos', id]);
  }

  restaurarVehiculo(id: string): void {
    const confirmacion = confirm('¿Está seguro que desea restaurar este vehículo? El vehículo volverá a estar activo en el sistema.');
    
    if (confirmacion) {
      this.vehiculoService.restoreVehiculo({ 
        vehiculoId: id,
        usuario: 'admin', // TODO: Obtener del servicio de autenticación
        motivo: 'Restauración manual'
      }).subscribe({
        next: () => {
          this.cargarVehiculosEliminados();
          alert('Vehículo restaurado exitosamente');
        },
        error: (error: any) => {
          console.error('Error al restaurar vehículo:', error);
          alert('Error al restaurar el vehículo');
        }
      });
    }
  }

  eliminarPermanentemente(id: string): void {
    const confirmacion = confirm('¿Está seguro que desea eliminar permanentemente este vehículo? Esta acción no se puede deshacer.');
    
    if (confirmacion) {
      this.vehiculoService.deleteVehiculoPermanente(id).subscribe({
        next: () => {
          this.cargarVehiculosEliminados();
          alert('Vehículo eliminado permanentemente');
        },
        error: (error: any) => {
          console.error('Error al eliminar permanentemente vehículo:', error);
          alert('Error al eliminar permanentemente el vehículo');
        }
      });
    }
  }

  exportarDatos(): void {
    this.vehiculoService.exportarVehiculos(this.currentFiltros()).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehiculos_eliminados_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  volver(): void {
    this.router.navigate(['/vehiculos']);
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

  // Métodos auxiliares para formatear datos
  obtenerTipoVehiculoTexto(tipo: string | undefined): string {
    if (!tipo) return 'No especificado';
    const tipos = {
      'BUS': 'Bus',
      'MICROBUS': 'Microbús',
      'COMBIS': 'Combis',
      'CAMION': 'Camión',
      'CAMIONETA': 'Camioneta',
      'MOTOTAXI': 'Mototaxi',
      'TAXI': 'Taxi',
      'OTRO': 'Otro'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }

  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return 'No especificada';
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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