import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../services/vehiculo';
import { EmpresaService } from '../../../services/empresa';
import { Vehiculo } from '../../../models/vehiculo.model';
import { EmpresaTransporte } from '../../../models/empresa.model';

@Component({
  selector: 'app-vehiculo-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculo-detail.html',
  styleUrls: ['./vehiculo-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiculoDetailComponent implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehiculoService = inject(VehiculoService);
  private empresaService = inject(EmpresaService);
  
  // Signals para el estado del componente
  vehiculo = signal<Vehiculo | null>(null);
  empresa = signal<EmpresaTransporte | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  // Computed properties
  currentVehiculo = computed(() => this.vehiculo());
  currentEmpresa = computed(() => this.empresa());
  isLoading = computed(() => this.cargando());
  hasError = computed(() => this.error());

  ngOnInit(): void {
    this.cargarVehiculo();
  }

  private cargarVehiculo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de vehículo no válido');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.vehiculoService.getVehiculo(id).subscribe({
      next: (vehiculo: Vehiculo) => {
        this.vehiculo.set(vehiculo);
        this.cargarEmpresa(vehiculo.empresaId || vehiculo.empresaActualId || '');
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar vehículo:', error);
        this.error.set('Error al cargar los datos del vehículo');
        this.cargando.set(false);
        
        // Si el vehículo no existe, mostrar un mensaje más específico
        if (error.message === 'Vehículo no encontrado') {
          this.error.set('El vehículo solicitado no existe. Redirigiendo a la lista de vehículos...');
          setTimeout(() => {
            this.router.navigate(['/vehiculos']);
          }, 3000);
        }
      }
    });
  }

  private cargarEmpresa(empresaId: string): void {
    this.empresaService.getEmpresa(empresaId).subscribe({
      next: (empresa: EmpresaTransporte) => {
        this.empresa.set(empresa);
      },
      error: (error: any) => {
        console.error('Error al cargar empresa:', error);
        // No mostramos error aquí porque no es crítico
      }
    });
  }

  editarVehiculo(): void {
    const vehiculo = this.currentVehiculo();
    if (vehiculo) {
      this.router.navigate(['/vehiculos', vehiculo.id, 'editar']);
    }
  }

  volver(): void {
    this.router.navigate(['/vehiculos']);
  }

  eliminarVehiculo(): void {
    const vehiculo = this.currentVehiculo();
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
        vehiculoId: vehiculo.id,
        motivo: motivo,
        usuario: 'admin' // TODO: Obtener del servicio de autenticación
      };

      this.vehiculoService.deleteVehiculo(request).subscribe({
        next: () => {
          this.cargando.set(false);
          this.mostrarNotificacion('Vehículo eliminado exitosamente', 'success');
          this.router.navigate(['/vehiculos']);
        },
        error: (error: any) => {
          console.error('Error al eliminar vehículo:', error);
          this.cargando.set(false);
          this.mostrarNotificacion('Error al eliminar el vehículo', 'error');
        }
      });
    }
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
      'INACTIVO': 'Inactivo',
      'MANTENIMIENTO': 'En Mantenimiento'
    };
    return estados[estado as keyof typeof estados] || estado;
  }

  obtenerClaseEstado(estado: string): string {
    const clases = {
      'ACTIVO': 'badge-success',
      'INACTIVO': 'badge-danger',
      'MANTENIMIENTO': 'badge-warning'
    };
    return clases[estado as keyof typeof clases] || 'badge-secondary';
  }

  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return 'No especificada';
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Método para obtener información completa del vehículo
  obtenerInfoCompleta(): string {
    const vehiculo = this.currentVehiculo();
    if (!vehiculo) return '';
    
    return `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anioFabricacion}) - ${this.obtenerEstadoTexto(vehiculo.estado)}`;
  }

  // Método para verificar si el vehículo está activo
  estaActivo(): boolean {
    const vehiculo = this.currentVehiculo();
    return vehiculo ? vehiculo.estado === 'ACTIVO' : false;
  }

  // Método para obtener la edad del vehículo
  obtenerEdadVehiculo(): number {
    const vehiculo = this.currentVehiculo();
    if (!vehiculo) return 0;
    
    const anioActual = new Date().getFullYear();
    return anioActual - vehiculo.anioFabricacion;
  }

  // Método para verificar si el vehículo necesita mantenimiento
  necesitaMantenimiento(): boolean {
    const vehiculo = this.currentVehiculo();
    if (!vehiculo) return false;
    
    // Lógica simple: vehículos con más de 5 años o en mantenimiento
    return this.obtenerEdadVehiculo() > 5 || vehiculo.estado === 'MANTENIMIENTO';
  }

  // Método para copiar información al portapapeles
  copiarInformacion(): void {
    const info = this.obtenerInfoCompleta();
    navigator.clipboard.writeText(info).then(() => {
      this.mostrarNotificacion('Información copiada al portapapeles', 'success');
    }).catch(() => {
      this.mostrarNotificacion('Error al copiar información', 'error');
    });
  }
} 