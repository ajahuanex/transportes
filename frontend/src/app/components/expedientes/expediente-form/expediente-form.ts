import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpedienteService } from '../../../services/expediente';
import { Expediente, CreateExpedienteRequest, UpdateExpedienteRequest } from '../../../models/expediente.model';
import { EstadoExpediente, TipoExpediente, TipoTramite } from '../../../models/expediente.model';

@Component({
  selector: 'app-expediente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expediente-form.html',
  styleUrls: ['./expediente-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpedienteFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private expedienteService = inject(ExpedienteService);
  private fb = inject(FormBuilder);

  // Signals
  expediente = signal<Expediente | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);

  // Form
  expedienteForm = signal<FormGroup>(this.fb.group({}));

  // Computed properties
  currentExpediente = computed(() => this.expediente());
  currentIsLoading = computed(() => this.isLoading());
  currentIsSaving = computed(() => this.isSaving());
  currentError = computed(() => this.error());
  currentIsEditMode = computed(() => this.isEditMode());
  currentForm = computed(() => this.expedienteForm());

  // Enums para el template
  EstadoExpediente = EstadoExpediente;
  TipoExpediente = TipoExpediente;
  TipoTramite = TipoTramite;

  ngOnInit(): void {
    this.initializeForm();
    this.loadExpediente();
  }

  private initializeForm(): void {
    const form = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^E-\d{4}-\d{4}$/)]],
      tipo: ['', [Validators.required]],
      tipoTramite: ['', [Validators.required]],
      estado: [EstadoExpediente.ABIERTO, [Validators.required]],
      
      // Información del solicitante
      solicitante: this.fb.group({
        tipo: ['EMPRESA', [Validators.required]],
        id: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        documento: ['', [Validators.required]]
      }),
      
      // Información del trámite
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      observaciones: [''],
      prioridad: ['MEDIA', [Validators.required]],
      responsable: [''],
      fechaLimite: [''],
      tags: [''],
      
      // Relaciones
      expedientePadre: ['']
    });

    this.expedienteForm.set(form);
  }

  private loadExpediente(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isEditMode.set(false);
      return;
    }

    this.isEditMode.set(true);
    this.isLoading.set(true);
    this.error.set(null);

    this.expedienteService.getExpediente(id).subscribe({
      next: (expediente) => {
        if (expediente) {
          this.expediente.set(expediente);
          this.patchFormWithExpediente(expediente);
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

  private patchFormWithExpediente(expediente: Expediente): void {
    const form = this.currentForm();
    form.patchValue({
      numero: expediente.numero,
      tipo: expediente.tipo,
      tipoTramite: expediente.tipoTramite,
      estado: expediente.estado,
      solicitante: expediente.solicitante,
      descripcion: expediente.descripcion,
      observaciones: expediente.observaciones,
      prioridad: expediente.prioridad,
      responsable: expediente.responsable,
      fechaLimite: expediente.fechaLimite ? new Date(expediente.fechaLimite).toISOString().split('T')[0] : '',
      tags: expediente.tags?.join(', ') || ''
    });
  }

  onSubmit(): void {
    if (this.currentForm().invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.currentForm().value;
    const expedienteData = {
      ...formValue,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
      fechaLimite: formValue.fechaLimite ? new Date(formValue.fechaLimite) : undefined
    };

    if (this.currentIsEditMode()) {
      const updateRequest: UpdateExpedienteRequest = expedienteData;
      this.expedienteService.updateExpediente(this.currentExpediente()!.id, updateRequest).subscribe({
        next: () => {
          this.router.navigate(['/expedientes', this.currentExpediente()!.id]);
        },
        error: (err) => {
          this.error.set('Error al actualizar el expediente');
          this.isSaving.set(false);
          console.error('Error actualizando expediente:', err);
        }
      });
    } else {
      const createRequest: CreateExpedienteRequest = expedienteData;
      this.expedienteService.createExpediente(createRequest).subscribe({
        next: (expediente) => {
          this.router.navigate(['/expedientes', expediente.id]);
        },
        error: (err) => {
          this.error.set('Error al crear el expediente');
          this.isSaving.set(false);
          console.error('Error creando expediente:', err);
        }
      });
    }
  }

  onCancel(): void {
    if (this.currentIsEditMode()) {
      this.router.navigate(['/expedientes', this.currentExpediente()!.id]);
    } else {
      this.router.navigate(['/expedientes']);
    }
  }

  generarNumero(): void {
    this.expedienteService.generarNumeroExpediente().subscribe({
      next: (numero) => {
        this.currentForm().patchValue({ numero });
      },
      error: (err) => {
        console.error('Error generando número:', err);
      }
    });
  }

  validarNumero(): void {
    const numero = this.currentForm().get('numero')?.value;
    if (numero) {
      this.expedienteService.validarNumeroExpediente(numero).subscribe({
        next: (esValido) => {
          if (!esValido) {
            this.currentForm().get('numero')?.setErrors({ numeroInvalido: true });
          }
        },
        error: (err) => {
          console.error('Error validando número:', err);
        }
      });
    }
  }

  markFormGroupTouched(): void {
    this.markFormGroupTouchedRecursive(this.currentForm());
  }

  private markFormGroupTouchedRecursive(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedRecursive(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Getters para el template
  get solicitanteGroup() {
    return this.currentForm().get('solicitante') as FormGroup;
  }

  get numeroControl() {
    return this.currentForm().get('numero');
  }

  get descripcionControl() {
    return this.currentForm().get('descripcion');
  }
} 