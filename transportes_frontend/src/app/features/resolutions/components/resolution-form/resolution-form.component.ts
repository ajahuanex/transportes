import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IResolucionInDB, IResolucionCreate, IResolucionUpdate } from '../../models/resolution.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ResolutionsService } from '../../services/resolutions';

@Component({
  selector: 'app-resolution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resolution-form.component.html',
  styleUrls: ['./resolution-form.component.scss']
})
export class ResolutionFormComponent implements OnInit {
  @Input() resolution: IResolucionInDB | null = null;
  @Output() save = new EventEmitter<IResolucionCreate | IResolucionUpdate>();

  resolutionForm!: FormGroup;
  resolutionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private resolutionsService: ResolutionsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.resolutionId = this.route.snapshot.paramMap.get('id');

    if (this.resolutionId) {
      this.resolutionsService.getResolutionById(this.resolutionId).subscribe(
        (resolution) => {
          this.resolution = resolution;
          this.resolutionForm.patchValue({
            numero_resolucion: resolution.numero_resolucion,
            expediente_origen_id: resolution.expediente_origen_id,
            resolucion_asociada_anterior_id: resolution.resolucion_asociada_anterior_id,
            resolucion_primigenia_id: resolution.resolucion_primigenia_id,
            tipo_tramite: resolution.tipo_tramite,
            fecha_emision: resolution.fecha_emision ? new Date(resolution.fecha_emision).toISOString().substring(0, 10) : '',
            fecha_inicio_vigencia: resolution.fecha_inicio_vigencia ? new Date(resolution.fecha_inicio_vigencia).toISOString().substring(0, 10) : '',
            anios_vigencia: resolution.anios_vigencia,
            fecha_fin_vigencia: resolution.fecha_fin_vigencia ? new Date(resolution.fecha_fin_vigencia).toISOString().substring(0, 10) : '',
            empresa_afectada_id: resolution.empresa_afectada_id,
            ruc_empresa_afectada: resolution.ruc_empresa_afectada,
            observaciones: resolution.observaciones,
            estado_resolucion: resolution.estado_resolucion,
            // Campos anidados no incluidos en el formulario inicial
          });
        },
        (error) => {
          console.error('Error al cargar resolución:', error);
          this.router.navigate(['/resolutions']);
        }
      );
    }
  }

  initForm(): void {
    this.resolutionForm = this.fb.group({
      numero_resolucion: ['', Validators.required],
      expediente_origen_id: ['', Validators.required],
      resolucion_asociada_anterior_id: [''],
      resolucion_primigenia_id: [''],
      tipo_tramite: ['', Validators.required],
      fecha_emision: [''],
      fecha_inicio_vigencia: [''],
      anios_vigencia: [null],
      fecha_fin_vigencia: [''],
      empresa_afectada_id: ['', Validators.required],
      ruc_empresa_afectada: ['', Validators.required],
      observaciones: [''],
      estado_resolucion: ['Vigente', Validators.required],
      // Campos anidados no incluidos en el formulario inicial
    });
  }

  onSubmit(): void {
    if (this.resolutionForm.valid) {
      const formValue = this.resolutionForm.value;

      const resolutionToSave: IResolucionCreate | IResolucionUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION',
        estado_logico: this.resolution?.estado_logico || 'ACTIVO' // Mantener el estado lógico existente o ACTIVO por defecto
      };

      // Convertir cadenas vacías de fechas a null
      if (resolutionToSave.fecha_emision === '') {
        resolutionToSave.fecha_emision = null;
      }
      if (resolutionToSave.fecha_inicio_vigencia === '') {
        resolutionToSave.fecha_inicio_vigencia = null;
      }
      if (resolutionToSave.fecha_fin_vigencia === '') {
        resolutionToSave.fecha_fin_vigencia = null;
      }

      if (this.resolutionId) {
        this.resolutionsService.updateResolution(this.resolutionId, resolutionToSave as IResolucionUpdate).subscribe(
          () => {
            console.log('Resolución actualizada con éxito');
            this.router.navigate(['/resolutions']);
          },
          (error) => {
            console.error('Error al actualizar resolución:', error);
          }
        );
      } else {
        this.resolutionsService.createResolution(resolutionToSave as IResolucionCreate).subscribe(
          () => {
            console.log('Resolución creada con éxito');
            this.router.navigate(['/resolutions']);
          },
          (error) => {
            console.error('Error al crear resolución:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/resolutions']);
  }
}
