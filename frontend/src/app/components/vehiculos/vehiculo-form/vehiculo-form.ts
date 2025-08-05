import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../services/vehiculo';
import { EmpresaService } from '../../../services/empresa';
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
        Validators.minLength(7), 
        Validators.maxLength(7),
        Validators.pattern(/^[A-Z0-9]{3}-\d{3}$/)
      ]],
      resolucionId: ['', [Validators.required]],  // CAMPO REQUERIDO - Relación directa
      empresaId: ['', []],                        // CAMPO DERIVADO - Se auto-completa
      marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      anioFabricacion: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
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
      this.mostrarNotificacion('Por favor, corrija los errores en el formulario', 'error');
      return;
    }

    this.guardando.set(true);
    const vehiculoData = this.vehiculoForm.value;

    // Validaciones adicionales
    if (!this.validarPlaca(vehiculoData.placa)) {
      this.guardando.set(false);
      this.mostrarNotificacion('El formato de placa no es válido', 'error');
      return;
    }

    if (this.isEditMode()) {
      // Actualizar vehículo existente
      const vehiculoActualizado = {
        ...vehiculoData,
        id: this.currentVehiculoId()
      };

      this.vehiculoService.updateVehiculo(this.currentVehiculoId()!, vehiculoActualizado).subscribe({
        next: (vehiculoActualizado) => {
          this.guardando.set(false);
          this.mostrarNotificacion('Vehículo actualizado exitosamente', 'success');
          this.router.navigate(['/vehiculos', vehiculoActualizado.id]);
        },
        error: (error: any) => {
          console.error('Error al actualizar vehículo:', error);
          this.guardando.set(false);
          this.mostrarNotificacion('Error al actualizar el vehículo', 'error');
        }
      });
    } else {
      // Crear nuevo vehículo
      this.vehiculoService.createVehiculo(vehiculoData).subscribe({
        next: (nuevoVehiculo) => {
          this.guardando.set(false);
          this.mostrarNotificacion('Vehículo creado exitosamente', 'success');
          this.router.navigate(['/vehiculos', nuevoVehiculo.id]);
        },
        error: (error: any) => {
          console.error('Error al crear vehículo:', error);
          this.guardando.set(false);
          this.mostrarNotificacion('Error al crear el vehículo', 'error');
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
    this.router.navigate(['/vehiculos']);
  }

  // Métodos para validación de campos
  esCampoInvalido(campo: string): boolean {
    const control = this.vehiculoForm.get(campo);
    return control ? (control.invalid && control.touched) : false;
  }

  obtenerMensajeError(campo: string): string {
    const control = this.vehiculoForm.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) {
      return `Valor mínimo: ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `Valor máximo: ${control.errors['max'].max}`;
    }
    if (control.errors['pattern']) {
      if (campo === 'placa') {
        return 'El formato de placa debe ser XXX-NNN (XXX alfanumérico en mayúsculas, NNN 3 dígitos)';
      }
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }

  // Validación personalizada para placa
  private validarPlaca(placa: string): boolean {
    // Formato: XXX-NNN donde XXX es alfanumérico en mayúsculas y NNN es exactamente 3 dígitos
    const placaRegex = /^[A-Z0-9]{3}-\d{3}$/;
    return placaRegex.test(placa.toUpperCase());
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

  // Método para formatear placa automáticamente
  formatearPlaca(event: any): void {
    let placa = event.target.value.toUpperCase();
    // Remover todos los caracteres que no sean alfanuméricos
    placa = placa.replace(/[^A-Z0-9]/g, '');
    
    // Aplicar formato XXX-NNN
    if (placa.length >= 3) {
      placa = placa.slice(0, 3) + '-' + placa.slice(3, 6);
    }
    
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