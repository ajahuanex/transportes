import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConductorService } from '../../../services/conductor';
import { Conductor } from '../../../models/conductor.model';

@Component({
  selector: 'app-conductor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conductor-detail.html',
  styleUrls: ['./conductor-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConductorDetailComponent implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private conductorService = inject(ConductorService);
  
  // Signals para el estado del componente
  conductor = signal<Conductor | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  // Computed properties
  currentConductor = computed(() => this.conductor());
  isLoading = computed(() => this.cargando());
  hasError = computed(() => this.error());

  ngOnInit(): void {
    this.cargarConductor();
  }

  cargarConductor(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de conductor no válido');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.conductorService.getConductor(id).subscribe({
      next: (conductor: Conductor) => {
        this.conductor.set(conductor);
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar conductor:', error);
        this.error.set('Error al cargar los datos del conductor');
        this.cargando.set(false);
      }
    });
  }

  editarConductor(): void {
    const conductor = this.currentConductor();
    if (conductor) {
      this.router.navigate(['conductores', conductor.id, 'editar']);
    }
  }

  volverAtras(): void {
    this.router.navigate(['conductores']);
  }

  eliminarConductor(): void {
    const conductor = this.currentConductor();
    if (!conductor) return;

    if (confirm(`¿Está seguro que desea eliminar al conductor ${conductor.nombres} ${conductor.apellidos}?`)) {
      this.conductorService.deleteConductor({
        conductorId: conductor.id,
        motivo: 'Eliminación manual',
        usuario: 'admin'
      }).subscribe({
        next: () => {
          alert('Conductor eliminado correctamente');
          this.volverAtras();
        },
        error: (error: any) => {
          console.error('Error al eliminar conductor:', error);
          alert('Error al eliminar el conductor');
        }
      });
    }
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

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularEdad(fechaNacimiento: Date | string): number {
    if (!fechaNacimiento) return 0;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  verificarLicenciaVencida(fechaVencimiento: Date | string): boolean {
    if (!fechaVencimiento) return false;
    const vencimiento = new Date(fechaVencimiento);
    const hoy = new Date();
    return vencimiento < hoy;
  }

  diasParaVencimiento(fechaVencimiento: Date | string): number {
    if (!fechaVencimiento) return 0;
    const vencimiento = new Date(fechaVencimiento);
    const hoy = new Date();
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
} 