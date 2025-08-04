import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../services/empresa';
import { EmpresaTransporte, CreateEmpresaRequest, UpdateEmpresaRequest } from '../../../models/empresa.model';
import { EstadoGeneral } from '../../../models/base.model';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa-form.html',
  styleUrls: ['./empresa-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpresaFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private empresaService = inject(EmpresaService);
  
  // Signals para el estado del componente
  empresaForm = signal<FormGroup>(this.fb.group({}));
  empresa = signal<EmpresaTransporte | null>(null);
  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  empresaId = signal<string | null>(null);

  // Computed properties
  currentForm = computed(() => this.empresaForm());
  currentEmpresa = computed(() => this.empresa());
  currentIsEditMode = computed(() => this.isEditMode());
  currentIsLoading = computed(() => this.isLoading());
  currentIsSaving = computed(() => this.isSaving());
  currentEmpresaId = computed(() => this.empresaId());

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    const form = this.fb.group({
      // Información básica
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      razonSocial: ['', [Validators.required, Validators.minLength(3)]],
      razonSocialInterno: [''],
      nombreComercial: [''],
      nombreCorto: [''],
      
      // Representante legal
      representanteLegal: this.fb.group({
        nombres: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        cargo: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      }),
      
      // Representante legal secundario (opcional)
      representanteLegalSecundario: this.fb.group({
        nombres: [''],
        apellidos: [''],
        dni: ['', [Validators.pattern(/^\d{8}$/)]],
        cargo: [''],
        telefono: [''],
        email: ['', [Validators.email]]
      }),
      
      // Dirección
      direccion: this.fb.group({
        departamento: ['Puno', [Validators.required]],
        provincia: ['Puno', [Validators.required]],
        distrito: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        referencia: ['']
      }),
      
      // Información de contacto
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      sitioWeb: [''],
      
      // Información adicional
      fechaConstitucion: ['', [Validators.required]],
      tipoEmpresa: ['TRANSPORTE', [Validators.required]],
      estado: [EstadoGeneral.PENDIENTE, [Validators.required]],
      
      // Información del expediente
      expediente: this.fb.group({
        numero: ['', [Validators.required, Validators.pattern(/^E-\d{4}-\d{4}$/)]],
        fecha: ['', [Validators.required]],
        estado: ['ABIERTO', [Validators.required]],
        observaciones: ['']
      }),
      
      // Documentos
      documentos: this.fb.group({
        ruc: [false],
        partidaRegistral: [false],
        poderRepresentante: [false],
        declaracionJurada: [false],
        otros: ['']
      })
    });

    this.empresaForm.set(form);
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empresaId.set(id);
      this.isEditMode.set(true);
      this.loadEmpresa(id);
    }
  }

  private loadEmpresa(id: string): void {
    this.isLoading.set(true);
    this.empresaService.getEmpresa(id).subscribe({
      next: (empresa) => {
        this.empresa.set(empresa);
        this.patchFormWithEmpresa(empresa);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar empresa:', error);
        this.isLoading.set(false);
        // TODO: Mostrar mensaje de error
      }
    });
  }

  private patchFormWithEmpresa(empresa: EmpresaTransporte): void {
    const form = this.currentForm();
    form.patchValue({
      ruc: empresa.ruc,
      razonSocial: empresa.razonSocial,
      razonSocialInterno: empresa.razonSocialInterno,
      nombreComercial: empresa.nombreComercial,
      nombreCorto: empresa.nombreCorto,
      representanteLegal: empresa.representanteLegal,
      representanteLegalSecundario: empresa.representanteLegalSecundario,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      sitioWeb: empresa.sitioWeb,
      fechaConstitucion: empresa.fechaConstitucion,
      tipoEmpresa: empresa.tipoEmpresa,
      estado: empresa.estado,
      expediente: empresa.expediente
    });
  }

  onSubmit(): void {
    if (this.currentForm().valid) {
      this.isSaving.set(true);
      
      const formValue = this.currentForm().value;
      
      if (this.currentIsEditMode()) {
        this.updateEmpresa(formValue);
      } else {
        this.createEmpresa(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createEmpresa(data: any): void {
    const empresaData: CreateEmpresaRequest = {
      ...data,
      fechaRegistro: new Date().toISOString()
    };

    this.empresaService.createEmpresa(empresaData).subscribe({
      next: (empresa) => {
        this.isSaving.set(false);
        alert('Empresa creada exitosamente');
        this.router.navigate(['/empresas', empresa.id]);
      },
      error: (error) => {
        console.error('Error al crear empresa:', error);
        this.isSaving.set(false);
        alert('Error al crear la empresa');
      }
    });
  }

  private updateEmpresa(data: any): void {
    const empresaData: UpdateEmpresaRequest = {
      ...data,
      fechaActualizacion: new Date().toISOString()
    };

    this.empresaService.updateEmpresa(this.currentEmpresaId()!, empresaData).subscribe({
      next: (empresa) => {
        this.isSaving.set(false);
        alert('Empresa actualizada exitosamente');
        this.router.navigate(['/empresas', empresa.id]);
      },
      error: (error) => {
        console.error('Error al actualizar empresa:', error);
        this.isSaving.set(false);
        alert('Error al actualizar la empresa');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/empresas']);
  }

  verificarRUC(): void {
    const ruc = this.currentForm().get('ruc')?.value;
    if (ruc && ruc.length === 11) {
      this.empresaService.verificarRUC(ruc).subscribe({
        next: (data) => {
          console.log('Datos SUNAT:', data);
          // Pre-llenar campos con datos de SUNAT
          this.currentForm().patchValue({
            razonSocial: data.razonSocial,
            direccion: {
              ...this.currentForm().get('direccion')?.value,
              direccion: data.direccion
            }
          });
        },
        error: (error) => {
          console.error('Error al verificar RUC:', error);
          alert('Error al verificar el RUC en SUNAT');
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

  // Getters para facilitar el acceso en el template
  get rucControl() {
    return this.currentForm().get('ruc');
  }

  get razonSocialControl() {
    return this.currentForm().get('razonSocial');
  }

  get representanteLegalGroup() {
    return this.currentForm().get('representanteLegal') as FormGroup;
  }

  get direccionGroup() {
    return this.currentForm().get('direccion') as FormGroup;
  }

  get razonSocialInternoControl() {
    return this.currentForm().get('razonSocialInterno');
  }

  get nombreCortoControl() {
    return this.currentForm().get('nombreCorto');
  }

  get representanteLegalSecundarioGroup() {
    return this.currentForm().get('representanteLegalSecundario') as FormGroup;
  }

  get expedienteGroup() {
    return this.currentForm().get('expediente') as FormGroup;
  }
} 