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
  error = signal<string | null>(null);

  filtros = signal({
    placa: '',
    marca: '',
    modelo: '',
    empresa: '',
    tipo: '',
    estado: ''
  });

  // Computed properties
  currentVehiculos = computed(() => this.vehiculos());
  currentTotalVehiculos = computed(() => this.totalVehiculos());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  hasError = computed(() => this.error());
  currentFiltros = computed(() => this.filtros());

  // Computed para estadísticas
  estadisticas = computed(() => {
    const vehiculos = this.currentVehiculos();
    return {
      total: vehiculos.length,
      activos: vehiculos.filter(v => v.estado === 'ACTIVO').length,
      mantenimiento: vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length,
      suspendidos: vehiculos.filter(v => v.estado === 'SUSPENDIDO').length,
      baja: vehiculos.filter(v => v.estado === 'BAJA').length
    };
  });

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.cargando.set(true);
    this.error.set(null);
    
    this.vehiculoService.getVehiculos(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.vehiculos.set(response.vehiculos);
          this.totalVehiculos.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error: any) => {
          console.error('Error al cargar vehículos:', error);
          this.error.set('Error al cargar los vehículos');
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
      empresa: '',
      tipo: '',
      estado: ''
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
    const vehiculo = this.currentVehiculos().find(v => v.id === id);
    if (!vehiculo) return;

    const motivo = prompt(`Ingrese el motivo de la eliminación para el vehículo ${vehiculo.placa}:`);
    if (!motivo) {
      alert('Debe ingresar un motivo para la eliminación');
      return;
    }

    const confirmacion = confirm(`¿Está seguro que desea eliminar el vehículo ${vehiculo.placa}?\n\nMotivo: ${motivo}\n\nEl vehículo será marcado como eliminado pero podrá ser restaurado posteriormente.`);
    
    if (confirmacion) {
      this.cargando.set(true);
      const request = {
        vehiculoId: id,
        motivo: motivo,
        usuario: 'admin' // TODO: Obtener del servicio de autenticación
      };

      this.vehiculoService.deleteVehiculo(request).subscribe({
        next: () => {
          this.cargarVehiculos();
          this.cargando.set(false);
          this.mostrarNotificacion('Vehículo eliminado exitosamente', 'success');
        },
        error: (error: any) => {
          console.error('Error al eliminar vehículo:', error);
          this.cargando.set(false);
          this.mostrarNotificacion('Error al eliminar el vehículo', 'error');
        }
      });
    }
  }

  exportarDatos(): void {
    this.cargando.set(true);
    this.vehiculoService.exportarVehiculos(this.currentFiltros()).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehiculos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.cargando.set(false);
        this.mostrarNotificacion('Datos exportados exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error al exportar datos:', error);
        this.cargando.set(false);
        this.mostrarNotificacion('Error al exportar los datos', 'error');
      }
    });
  }

  verEliminados(): void {
    this.router.navigate(['vehiculos', 'eliminados']);
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

  actualizarFiltroTipo(tipo: string): void {
    this.filtros.update(filtros => ({ ...filtros, tipo }));
  }

  actualizarFiltroEstado(estado: string): void {
    this.filtros.update(filtros => ({ ...filtros, estado }));
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

  obtenerEstadoTexto(estado: string): string {
    const estados = {
      'ACTIVO': 'Activo',
      'MANTENIMIENTO': 'En Mantenimiento',
      'SUSPENDIDO': 'Suspendido',
      'BAJA': 'Baja'
    };
    return estados[estado as keyof typeof estados] || estado;
  }

  obtenerClaseEstado(estado: string): string {
    const clases = {
      'ACTIVO': 'badge-success',
      'MANTENIMIENTO': 'badge-warning',
      'SUSPENDIDO': 'badge-danger',
      'BAJA': 'badge-secondary'
    };
    return clases[estado as keyof typeof clases] || 'badge-secondary';
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

  // Método para mostrar notificaciones
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info'): void {
    // TODO: Implementar sistema de notificaciones
    console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    
    // Por ahora usamos alert temporal
    if (tipo === 'error') {
      alert(`Error: ${mensaje}`);
    } else if (tipo === 'success') {
      alert(`Éxito: ${mensaje}`);
    } else {
      alert(`${mensaje}`);
    }
  }

  // Método para refrescar datos
  refrescarDatos(): void {
    this.cargarVehiculos();
  }

  // Método para cambiar el número de elementos por página
  cambiarElementosPorPagina(porPagina: number): void {
    this.porPagina.set(porPagina);
    this.paginaActual.set(1);
    this.cargarVehiculos();
  }

  // Método para obtener información rápida del vehículo
  obtenerInfoRapida(vehiculo: Vehiculo): string {
    return `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anioFabricacion})`;
  }

  // Método para verificar si un vehículo está próximo a vencer documentos
  estaProximoAVencer(vehiculo: Vehiculo): boolean {
    // TODO: Implementar lógica de verificación de documentos
    return false;
  }
}
