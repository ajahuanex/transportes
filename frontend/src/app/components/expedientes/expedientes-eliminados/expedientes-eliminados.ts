import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpedienteService } from '../../../services/expediente';
import { Expediente, EstadoExpediente, TipoExpediente, TipoTramite } from '../../../models/expediente.model';

@Component({
  selector: 'app-expedientes-eliminados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expedientes-eliminados.html',
  styleUrls: ['./expedientes-eliminados.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpedientesEliminadosComponent implements OnInit {
  private router = inject(Router);
  private expedienteService = inject(ExpedienteService);

  // Signals
  expedientes = signal<Expediente[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Computed properties
  currentExpedientes = computed(() => this.expedientes());
  currentIsLoading = computed(() => this.isLoading());
  currentError = computed(() => this.error());

  // Enums para el template
  EstadoExpediente = EstadoExpediente;
  TipoExpediente = TipoExpediente;
  TipoTramite = TipoTramite;

  ngOnInit(): void {
    this.cargarExpedientesEliminados();
  }

  cargarExpedientesEliminados(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.expedienteService.getExpedientesEliminados().subscribe({
      next: (expedientes) => {
        this.expedientes.set(expedientes);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los expedientes eliminados');
        this.isLoading.set(false);
        console.error('Error cargando expedientes eliminados:', err);
      }
    });
  }

  // Navegación
  volverALista(): void {
    this.router.navigate(['/expedientes']);
  }

  // Acciones
  restaurarExpediente(id: string): void {
    const motivo = prompt('Ingrese el motivo de restauración:');
    if (!motivo) return;

    const request = {
      id,
      usuario: 'usuario_actual', // TODO: Obtener del servicio de autenticación
      motivo
    };

    this.expedienteService.restoreExpediente(request).subscribe({
      next: () => {
        this.cargarExpedientesEliminados();
        // TODO: Mostrar notificación de éxito
      },
      error: (err) => {
        console.error('Error restaurando expediente:', err);
        // TODO: Mostrar notificación de error
      }
    });
  }

  eliminarPermanentemente(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este expediente? Esta acción no se puede deshacer.')) {
      this.expedienteService.deleteExpedientePermanente(id).subscribe({
        next: () => {
          this.cargarExpedientesEliminados();
          // TODO: Mostrar notificación de éxito
        },
        error: (err) => {
          console.error('Error eliminando expediente permanentemente:', err);
          // TODO: Mostrar notificación de error
        }
      });
    }
  }

  // Utilidades
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

  formatTipo(tipo: TipoExpediente | undefined): string {
    if (!tipo) return 'N/A';
    const tipos: Record<string, string> = {
      'EMPRESA_TRANSPORTE': 'Empresa Transporte',
      'VEHICULO': 'Vehículo',
      'CONDUCTOR': 'Conductor',
      'RUTA': 'Ruta',
      'TUC': 'TUC',
      'RESOLUCION': 'Resolución',
      'OTRO': 'Otro'
    };
    return tipos[tipo] || tipo;
  }

  formatTipoTramite(tipoTramite: string): string {
    const tramites: Record<string, string> = {
      'SOLICITUD_INICIAL': 'Solicitud Inicial',
      'RENOVACION': 'Renovación',
      'MODIFICACION': 'Modificación',
      'CANCELACION': 'Cancelación',
      'SUSPENSION': 'Suspensión',
      'REACTIVACION': 'Reactivación',
      'RENOVACION_HABILITACION_VEHICULAR': 'Renovación Habilitación Vehicular'
    };
    return tramites[tipoTramite] || tipoTramite;
  }

  formatEstado(estado: string): string {
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
    return estados[estado] || estado;
  }

  formatPrioridad(prioridad: string): string {
    const prioridades = {
      'BAJA': 'Baja',
      'MEDIA': 'Media',
      'ALTA': 'Alta',
      'URGENTE': 'Urgente'
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridad;
  }
} 