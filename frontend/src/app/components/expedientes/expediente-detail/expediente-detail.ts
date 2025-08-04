import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpedienteService } from '../../../services/expediente';
import { Expediente, EstadoExpediente, TipoExpediente, TipoTramite } from '../../../models/expediente.model';

@Component({
  selector: 'app-expediente-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expediente-detail.html',
  styleUrls: ['./expediente-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpedienteDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private expedienteService = inject(ExpedienteService);

  // Signals
  expediente = signal<Expediente | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Computed properties
  currentExpediente = computed(() => this.expediente());
  currentIsLoading = computed(() => this.isLoading());
  currentError = computed(() => this.error());

  // Enums para el template
  EstadoExpediente = EstadoExpediente;
  TipoExpediente = TipoExpediente;
  TipoTramite = TipoTramite;

  ngOnInit(): void {
    this.loadExpediente();
  }

  private loadExpediente(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de expediente no válido');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.expedienteService.getExpediente(id).subscribe({
      next: (expediente) => {
        if (expediente) {
          this.expediente.set(expediente);
        } else {
          this.error.set('Expediente no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el expediente');
        this.isLoading.set(false);
        console.error('Error cargando expediente:', err);
      }
    });
  }

  // Navegación
  editarExpediente(): void {
    if (this.currentExpediente()) {
      this.router.navigate(['/expedientes', this.currentExpediente()!.id, 'editar']);
    }
  }

  volverALista(): void {
    this.router.navigate(['/expedientes']);
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

  getTipoClass(tipo: TipoExpediente): string {
    return 'badge tipo-expediente';
  }

  getTipoTramiteClass(tipoTramite: string): string {
    return 'badge tipo-tramite';
  }

  isFechaVencida(fecha: Date): boolean {
    return new Date(fecha) < new Date();
  }

  formatTipo(tipo: TipoExpediente): string {
    const tipos = {
      [TipoExpediente.EMPRESA_TRANSPORTE]: 'Empresa Transporte',
      [TipoExpediente.VEHICULO]: 'Vehículo',
      [TipoExpediente.CONDUCTOR]: 'Conductor',
      [TipoExpediente.RUTA]: 'Ruta',
      [TipoExpediente.TUC]: 'TUC',
      [TipoExpediente.RESOLUCION]: 'Resolución',
      [TipoExpediente.OTRO]: 'Otro'
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

  // Helper methods for safe array checks
  hasTags(): boolean {
    const expediente = this.currentExpediente();
    return !!(expediente?.tags && expediente.tags.length > 0);
  }

  hasSeguimiento(): boolean {
    const expediente = this.currentExpediente();
    return !!(expediente?.seguimiento && expediente.seguimiento.length > 0);
  }

  hasDocumentos(): boolean {
    const expediente = this.currentExpediente();
    return !!(expediente?.documentos && expediente.documentos.length > 0);
  }

  getTags(): string[] {
    const expediente = this.currentExpediente();
    return expediente?.tags || [];
  }

  getSeguimiento(): any[] {
    const expediente = this.currentExpediente();
    return expediente?.seguimiento || [];
  }

  getDocumentos(): any[] {
    const expediente = this.currentExpediente();
    return expediente?.documentos || [];
  }
} 