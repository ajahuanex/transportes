import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConductorService } from '../../../services/conductor';
import { EmpresaService } from '../../../services/empresa';
import { Conductor } from '../../../models/conductor.model';
import { EmpresaTransporte } from '../../../models/empresa.model';

@Component({
  selector: 'app-conductor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conductor-form.html',
  styleUrls: ['./conductor-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConductorFormComponent implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private conductorService = inject(ConductorService);
  private empresaService = inject(EmpresaService);
  private fb = inject(FormBuilder);
  
  // Signals para el estado del componente
  conductor = signal<Conductor | null>(null);
  empresas = signal<EmpresaTransporte[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  esEdicion = signal(false);
  conductorId = signal<string | null>(null);

  // Computed properties
  currentConductor = computed(() => this.conductor());
  currentEmpresas = computed(() => this.empresas());
  isLoading = computed(() => this.cargando());
  isSaving = computed(() => this.guardando());
  isEditMode = computed(() => this.esEdicion());
  currentConductorId = computed(() => this.conductorId());

  // Formulario reactivo
  conductorForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEmpresas();
    this.verificarModo();
  }

  private inicializarFormulario(): void {
    this.conductorForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required]],
      licencia: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      categoriaLicencia: ['', [Validators.required]],
      fechaVencimientoLicencia: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      estado: ['HABILITADO', [Validators.required]]
    });
  }

  private verificarModo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.conductorId.set(id);
      this.esEdicion.set(true);
      this.cargarConductor(id);
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

  private cargarConductor(id: string): void {
    this.cargando.set(true);
    this.conductorService.getConductor(id).subscribe({
      next: (conductor: Conductor) => {
        this.conductor.set(conductor);
        this.conductorForm.patchValue({
          dni: conductor.dni,
          nombres: conductor.nombres,
          apellidos: conductor.apellidos,
          fechaNacimiento: conductor.fechaNacimiento,
          licencia: conductor.licencia?.numero,
          categoriaLicencia: conductor.licencia?.categoria,
          fechaVencimientoLicencia: conductor.licencia?.fechaVencimiento,
          telefono: conductor.contacto?.telefono,
          email: conductor.contacto?.email,
          direccion: conductor.direccion?.calle + ' ' + conductor.direccion?.numero,
          estado: conductor.estado
        });
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar conductor:', error);
        this.cargando.set(false);
      }
    });
  }

  guardarConductor(): void {
    if (this.conductorForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    this.guardando.set(true);
    const conductorData = this.conductorForm.value;

    if (this.isEditMode()) {
      // Actualizar conductor existente
      const conductorActualizado = {
        ...conductorData,
        id: this.currentConductorId()
      };

      this.conductorService.updateConductor(this.currentConductorId()!, conductorActualizado).subscribe({
        next: () => {
          this.guardando.set(false);
          alert('Conductor actualizado exitosamente');
          this.router.navigate(['/conductores']);
        },
        error: (error: any) => {
          console.error('Error al actualizar conductor:', error);
          this.guardando.set(false);
          alert('Error al actualizar el conductor');
        }
      });
    } else {
      // Crear nuevo conductor
      this.conductorService.createConductor(conductorData).subscribe({
        next: () => {
          this.guardando.set(false);
          alert('Conductor creado exitosamente');
          this.router.navigate(['/conductores']);
        },
        error: (error: any) => {
          console.error('Error al crear conductor:', error);
          this.guardando.set(false);
          alert('Error al crear el conductor');
        }
      });
    }
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.conductorForm.controls).forEach(key => {
      const control = this.conductorForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/conductores']);
  }

  // Métodos para validación de campos
  esCampoInvalido(campo: string): boolean {
    const control = this.conductorForm.get(campo);
    return control ? (control.invalid && control.touched) : false;
  }

  obtenerMensajeError(campo: string): string {
    const control = this.conductorForm.get(campo);
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
    if (control.errors['pattern']) {
      return 'Formato inválido';
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }

    return 'Campo inválido';
  }

  // Validación de fecha de vencimiento
  validarFechaVencimiento(): boolean {
    const fechaVencimiento = this.conductorForm.get('fechaVencimientoLicencia')?.value;
    if (fechaVencimiento) {
      const fechaVenc = new Date(fechaVencimiento);
      const hoy = new Date();
      return fechaVenc > hoy;
    }
    return true;
  }

  // Validación de edad mínima
  validarEdadMinima(): boolean {
    const fechaNacimiento = this.conductorForm.get('fechaNacimiento')?.value;
    if (fechaNacimiento) {
      const fechaNac = new Date(fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        return edad - 1 >= 18;
      }
      return edad >= 18;
    }
    return true;
  }
} 