import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { VehiculoService } from '../../../services/vehiculo';
import { EmpresaService } from '../../../services/empresa';
import { NotificationService } from '../../../services/notification.service';
import { ValidationService } from '../../../services/validation.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { EmpresaTransporte } from '../../../models/empresa.model';
import { Resolucion } from '../../../models/resolucion.model';
import { ResolucionService } from '../../../services/resolucion';
import { DatosAdicionalesDialogComponent } from './datos-adicionales-dialog';

@Component({
  selector: 'app-vehiculo-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './vehiculo-form.html',
  styleUrls: ['./vehiculo-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiculoFormComponent implements OnInit {
  
  // Inputs for modal usage
  empresaId = input<string>('');
  empresaNombre = input<string>('');
  empresaResoluciones = input<Resolucion[]>([]);
  
  // Outputs for modal usage
  entityCreated = output<void>();
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehiculoService = inject(VehiculoService);
  private empresaService = inject(EmpresaService);
  private notificationService = inject(NotificationService);
  private resolucionService = inject(ResolucionService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  
  // Signals para el estado del componente
  vehiculo = signal<Vehiculo | null>(null);
  empresas = signal<EmpresaTransporte[]>([]);
  resoluciones = signal<Resolucion[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  esEdicion = signal(false);
  vehiculoId = signal<string | null>(null);

  // Computed properties
  currentVehiculo = computed(() => this.vehiculo());
  currentEmpresas = computed(() => this.empresas());
  currentResoluciones = computed(() => this.resoluciones());
  currentEmpresaResoluciones = computed(() => this.empresaResoluciones());
  isLoading = computed(() => this.cargando());
  isSaving = computed(() => this.guardando());
  isEditMode = computed(() => this.esEdicion());
  currentVehiculoId = computed(() => this.vehiculoId());

  // Computed property for available resolutions (company + general)
  availableResoluciones = computed(() => {
    const empresaResoluciones = this.currentEmpresaResoluciones();
    const generalResoluciones = this.currentResoluciones();
    
    // Si tenemos resoluciones de la empresa, las usamos primero
    if (empresaResoluciones.length > 0) {
      return empresaResoluciones;
    }
    
    // Si no, usamos las resoluciones generales
    return generalResoluciones;
  });

  // Formularios reactivos
  vehiculoForm!: FormGroup;
  datosAdicionalesForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormularios();
    this.verificarModo();
    this.cargarEmpresas();
    this.cargarResoluciones();
  }

  private inicializarFormularios(): void {
    // Formulario principal con datos básicos
    this.vehiculoForm = this.fb.group({
      placa: ['', [
        Validators.required, 
        ValidationService.placaValidator
      ]],
      resolucionId: ['', [Validators.required]],
      empresaId: [this.empresaId() || '', [Validators.required]],
      marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      categoria: ['', [Validators.required]],
      anioFabricacion: ['', [
        Validators.required, 
        ValidationService.anioFabricacionValidator
      ]],
      anioModelo: ['', [
        Validators.required, 
        ValidationService.anioFabricacionValidator
      ]],
      estado: ['ACTIVO', [Validators.required]],
    });

    // Formulario para datos adicionales (opcionales)
    this.datosAdicionalesForm = this.fb.group({
      color: [''],
      tipo: [''],
      modelo: [''],
      motor: [''],
      chasis: [''],
      ejes: [''],
      asientos: [''],
      pesoNeto: [''],
      pesoBruto: [''],
      largo: [''],
      ancho: [''],
      alto: [''],
    });

    // If empresaId is provided, set it in the form
    if (this.empresaId()) {
      this.vehiculoForm.patchValue({ empresaId: this.empresaId() });
    }
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
      next: (vehiculo) => {
        if (vehiculo) {
          this.vehiculo.set(vehiculo);
          this.patchFormWithVehiculo(vehiculo);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar vehículo:', error);
        this.cargando.set(false);
      }
    });
  }

  private patchFormWithVehiculo(vehiculo: Vehiculo): void {
    // Datos básicos en el formulario principal
    this.vehiculoForm.patchValue({
      placa: vehiculo.placa,
      resolucionId: vehiculo.resolucionId,
      empresaId: vehiculo.empresaId || vehiculo.empresaActualId,
      marca: vehiculo.marca,
      categoria: vehiculo.categoria,
      anioFabricacion: vehiculo.anioFabricacion,
      anioModelo: vehiculo.anioFabricacion, // Por defecto igual al año de fabricación
      estado: vehiculo.estado
    });

    // Datos adicionales en el formulario secundario
    this.datosAdicionalesForm.patchValue({
      color: vehiculo.color || '',
      tipo: vehiculo.tipo || '',
      modelo: vehiculo.modelo || '',
      motor: vehiculo.datosTecnicos?.motor || '',
      chasis: vehiculo.datosTecnicos?.chasis || '',
      ejes: vehiculo.datosTecnicos?.ejes || '',
      asientos: vehiculo.datosTecnicos?.asientos || '',
      pesoNeto: vehiculo.datosTecnicos?.pesoNeto || '',
      pesoBruto: vehiculo.datosTecnicos?.pesoBruto || '',
      largo: vehiculo.datosTecnicos?.medidas?.largo || '',
      ancho: vehiculo.datosTecnicos?.medidas?.ancho || '',
      alto: vehiculo.datosTecnicos?.medidas?.alto || '',
    });
  }

  guardarVehiculo(): void {
    if (this.vehiculoForm.invalid) {
      this.marcarCamposInvalidos();
      this.mostrarNotificacion('Por favor, complete todos los campos requeridos', 'warning');
      return;
    }

    this.guardando.set(true);
    const formData = this.vehiculoForm.value;
    const datosAdicionales = this.datosAdicionalesForm.value;

    // Combinar datos básicos con datos adicionales
    const vehiculoData = {
      ...formData,
      ...datosAdicionales,
      datosTecnicos: {
        motor: datosAdicionales.motor || '',
        chasis: datosAdicionales.chasis || '',
        ejes: datosAdicionales.ejes || 0,
        asientos: datosAdicionales.asientos || 0,
        pesoNeto: datosAdicionales.pesoNeto || 0,
        pesoBruto: datosAdicionales.pesoBruto || 0,
        medidas: {
          largo: datosAdicionales.largo || 0,
          ancho: datosAdicionales.ancho || 0,
          alto: datosAdicionales.alto || 0,
        }
      }
    };

    if (this.currentVehiculoId()) {
      // Modo edición
      const updateRequest = {
        id: this.currentVehiculoId()!,
        ...vehiculoData
      };

      this.vehiculoService.updateVehiculo(this.currentVehiculoId()!, updateRequest).subscribe({
        next: () => {
          this.mostrarNotificacion('Vehículo actualizado exitosamente', 'success');
          this.guardando.set(false);
          this.router.navigate(['/vehiculos']);
        },
        error: (error) => {
          console.error('Error al actualizar vehículo:', error);
          this.mostrarNotificacion('Error al actualizar vehículo', 'error');
          this.guardando.set(false);
        }
      });
    } else {
      // Modo creación
      this.vehiculoService.createVehiculo(vehiculoData).subscribe({
        next: () => {
          this.mostrarNotificacion('Vehículo creado exitosamente', 'success');
          this.guardando.set(false);
          
          // Emit event for modal usage
          this.entityCreated.emit();
          
          // Navigate only if not in modal mode
          if (!this.empresaId()) {
            this.router.navigate(['/vehiculos']);
          }
        },
        error: (error) => {
          console.error('Error al crear vehículo:', error);
          this.mostrarNotificacion('Error al crear vehículo', 'error');
          this.guardando.set(false);
        }
      });
    }
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.vehiculoForm.controls).forEach(key => {
      const control = this.vehiculoForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  cancelar(): void {
    if (!this.empresaId()) {
      this.router.navigate(['/vehiculos']);
    } else {
      // In modal mode, just close the modal
      this.entityCreated.emit();
    }
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.vehiculoForm.get(campo);
    return control ? control.invalid && control.touched : false;
  }

  obtenerMensajeError(campo: string): string {
    const control = this.vehiculoForm.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }
    
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    
    if (errors['pattern']) {
      switch (campo) {
        case 'placa':
          return 'Formato de placa inválido (ej: ABC-123)';
        case 'anioFabricacion':
        case 'anioModelo':
          return 'Año inválido';
        default:
          return 'Formato inválido';
      }
    }
    
    if (errors['placaInvalida']) {
      return 'La placa ya está registrada';
    }
    
    if (errors['anioInvalido']) {
      return 'El año debe estar entre 1900 y el año actual';
    }
    
    return 'Campo inválido';
  }

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

  formatearPlaca(event: any): void {
    let value = event.target.value.toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 6);
    }
    this.vehiculoForm.patchValue({ placa: value });
  }

  validarAnioFabricacion(anio: number): boolean {
    const anioActual = new Date().getFullYear();
    return anio >= 1900 && anio <= anioActual;
  }

  onResolucionChange(): void {
    const resolucionId = this.vehiculoForm.get('resolucionId')?.value;
    if (resolucionId) {
      const resolucion = this.currentResoluciones().find(r => r.id === resolucionId);
      if (resolucion && resolucion.empresaId) {
        this.vehiculoForm.patchValue({ empresaId: resolucion.empresaId });
      }
    }
  }

  obtenerResolucionSeleccionada(): Resolucion | undefined {
    const resolucionId = this.vehiculoForm.get('resolucionId')?.value;
    return this.availableResoluciones().find(r => r.id === resolucionId);
  }

  obtenerEmpresaSeleccionada(): any {
    const empresaId = this.vehiculoForm.get('empresaId')?.value;
    return this.currentEmpresas().find(e => e.id === empresaId);
  }

  // Métodos para el modal de datos adicionales
  abrirModalDatosAdicionales(): void {
    const datosActuales = this.datosAdicionalesForm.value;
    
    const dialogRef = this.dialog.open(DatosAdicionalesDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: datosActuales,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datosAdicionalesForm.patchValue(result);
        this.mostrarNotificacion('Datos adicionales guardados', 'success');
      }
    });
  }
} 