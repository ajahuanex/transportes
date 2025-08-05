import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../services/vehiculo';
import { EmpresaService } from '../../../services/empresa';
import { NotificationService } from '../../../services/notification.service';
import { ValidationService } from '../../../services/validation.service';
import { Vehiculo, TipoVehiculo } from '../../../models/vehiculo.model';
import { EmpresaTransporte } from '../../../models/empresa.model';
import { Resolucion } from '../../../models/resolucion.model'; // NUEVO: Importar Resolucion
import { ResolucionService } from '../../../services/resolucion'; // NUEVO: Servicio de resoluciones

@Component({
  selector: 'app-vehiculo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-form.html',
  styleUrls: ['./vehiculo-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiculoFormComponent implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehiculoService = inject(VehiculoService);
  private empresaService = inject(EmpresaService);
  private notificationService = inject(NotificationService);
  private resolucionService = inject(ResolucionService);  // NUEVO: Servicio de resoluciones
  private fb = inject(FormBuilder);
  
  // Signals para el estado del componente
  vehiculo = signal<Vehiculo | null>(null);
  empresas = signal<EmpresaTransporte[]>([]);
  resoluciones = signal<Resolucion[]>([]);  // NUEVO: Resoluciones disponibles
  cargando = signal(false);
  guardando = signal(false);
  esEdicion = signal(false);
  vehiculoId = signal<string | null>(null);

  // Computed properties
  currentVehiculo = computed(() => this.vehiculo());
  currentEmpresas = computed(() => this.empresas());
  currentResoluciones = computed(() => this.resoluciones());  // NUEVO
  isLoading = computed(() => this.cargando());
  isSaving = computed(() => this.guardando());
  isEditMode = computed(() => this.esEdicion());
  currentVehiculoId = computed(() => this.vehiculoId());

  // Formulario reactivo
  vehiculoForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarModo();
    this.cargarEmpresas();
    this.cargarResoluciones();  // NUEVO: Cargar resoluciones
  }

  private inicializarFormulario(): void {
    this.vehiculoForm = this.fb.group({
      placa: ['', [
        Validators.required, 
        ValidationService.placaValidator
      ]],
      resolucionId: ['', [Validators.required]],  // CAMPO REQUERIDO - Relación directa
      empresaId: ['', []],                        // CAMPO DERIVADO - Se auto-completa
      marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      anioFabricacion: ['', [
        Validators.required, 
        ValidationService.anioFabricacionValidator
      ]],
      color: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      categoria: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      estado: ['ACTIVO', [Validators.required]],
      // observaciones se manejará en el mantenimiento
    });
  }

  private verificarModo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.vehiculoId.set(id);
      this.esEdicion.set(true);
      this.cargarVehiculo(id);
    } else {
      this.esEdicion.set(false);
    }
  }

  private cargarEmpresas(): void {
    this.empresaService.getEmpresas(1, 1000, {}).subscribe({
      next: (response) => {
        this.empresas.set(response.empresas);
      },
      error: (error: any) => {
        console.error('Error al cargar empresas:', error);
      }
    });
  }

  private cargarResoluciones(): void {
    this.resolucionService.getResoluciones(1, 1000, {}).subscribe({
      next: (response) => {
        this.resoluciones.set(response.resoluciones);
      },
      error: (error: any) => {
        console.error('Error al cargar resoluciones:', error);
      }
    });
  }

  private cargarVehiculo(id: string): void {
    this.cargando.set(true);
    this.vehiculoService.getVehiculo(id).subscribe({
      next: (vehiculo: Vehiculo) => {
        this.vehiculo.set(vehiculo);
        this.vehiculoForm.patchValue({
          placa: vehiculo.placa,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          anioFabricacion: vehiculo.anioFabricacion,
          color: vehiculo.color,
          categoria: vehiculo.categoria,
          tipo: vehiculo.tipo,
          empresaId: vehiculo.empresaId || vehiculo.empresaActualId,
          estado: vehiculo.estado,
          // observaciones se manejará en el mantenimiento
        });
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar vehículo:', error);
        this.cargando.set(false);
      }
    });
  }

  guardarVehiculo(): void {
    if (this.vehiculoForm.invalid) {
      this.marcarCamposInvalidos();
      this.notificationService.errorValidacion('formulario');
      return;
    }

    this.guardando.set(true);
    const vehiculoData = this.vehiculoForm.value;

    if (this.isEditMode()) {
      // Actualizar vehículo existente
      const vehiculoActualizado = {
        ...vehiculoData,
        id: this.currentVehiculoId()
      };

      this.vehiculoService.updateVehiculo(this.currentVehiculoId()!, vehiculoActualizado).subscribe({
        next: (vehiculoActualizado) => {
          this.guardando.set(false);
          this.notificationService.vehiculoActualizado(vehiculoActualizado.placa);
          this.router.navigate(['/vehiculos', vehiculoActualizado.id]);
        },
        error: (error: any) => {
          console.error('Error al actualizar vehículo:', error);
          this.guardando.set(false);
          this.notificationService.error('Error al Actualizar', 'No se pudo actualizar el vehículo. Intente nuevamente.');
        }
      });
    } else {
      // Crear nuevo vehículo
      this.vehiculoService.createVehiculo(vehiculoData).subscribe({
        next: (nuevoVehiculo) => {
          this.guardando.set(false);
          this.notificationService.vehiculoRegistrado(nuevoVehiculo.placa);
          this.router.navigate(['/vehiculos', nuevoVehiculo.id]);
        },
        error: (error: any) => {
          console.error('Error al crear vehículo:', error);
          this.guardando.set(false);
          this.notificationService.error('Error al Registrar', 'No se pudo registrar el vehículo. Intente nuevamente.');
        }
      });
    }
  }

  private marcarCamposInvalidos(): void {
    ValidationService.markInvalidFieldsAsTouched(this.vehiculoForm);
  }

  cancelar(): void {
    this.router.navigate(['/vehiculos']);
  }

  // Métodos para validación de campos usando el nuevo servicio
  esCampoInvalido(campo: string): boolean {
    const control = this.vehiculoForm.get(campo);
    return ValidationService.isFieldInvalid(control!);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.vehiculoForm.get(campo);
    if (!control) return '';
    
    const fieldNames: { [key: string]: string } = {
      placa: 'Placa',
      resolucionId: 'Resolución',
      empresaId: 'Empresa',
      marca: 'Marca',
      modelo: 'Modelo',
      anioFabricacion: 'Año de Fabricación',
      color: 'Color',
      categoria: 'Categoría',
      tipo: 'Tipo',
      estado: 'Estado'
    };
    
    return ValidationService.getErrorMessage(control, fieldNames[campo] || campo);
  }



  // Método para mostrar notificaciones usando el nuevo servicio
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info'): void {
    switch (tipo) {
      case 'success':
        this.notificationService.success('Éxito', mensaje);
        break;
      case 'error':
        this.notificationService.error('Error', mensaje);
        break;
      case 'warning':
        this.notificationService.warning('Advertencia', mensaje);
        break;
      case 'info':
        this.notificationService.info('Información', mensaje);
        break;
    }
  }

  // Método para formatear placa automáticamente usando el nuevo servicio
  formatearPlaca(event: any): void {
    const placa = ValidationService.formatearPlaca(event.target.value);
    this.vehiculoForm.patchValue({ placa });
  }

  // Método para validar año de fabricación
  validarAnioFabricacion(anio: number): boolean {
    const anioActual = new Date().getFullYear();
    return anio >= 1900 && anio <= anioActual + 1;
  }

  // Método para manejar cambio de resolución
  onResolucionChange(): void {
    const resolucionId = this.vehiculoForm.get('resolucionId')?.value;
    if (resolucionId) {
      const resolucion = this.currentResoluciones().find(r => r.id === resolucionId);
      if (resolucion) {
        // Auto-completar la empresa basada en la resolución
        this.vehiculoForm.patchValue({ empresaId: resolucion.empresaId });
      }
    }
  }

  // Método para obtener información de la resolución seleccionada
  obtenerResolucionSeleccionada(): Resolucion | undefined {
    const resolucionId = this.vehiculoForm.get('resolucionId')?.value;
    return this.currentResoluciones().find(r => r.id === resolucionId);
  }

  // Método para obtener información de la empresa seleccionada
  obtenerEmpresaSeleccionada(): any {
    const empresaId = this.vehiculoForm.get('empresaId')?.value;
    return this.currentEmpresas().find(emp => emp.id === empresaId);
  }
} 