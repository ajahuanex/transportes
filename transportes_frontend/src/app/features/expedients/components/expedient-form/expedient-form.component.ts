import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IExpedienteInDB, IExpedienteCreate, IExpedienteUpdate } from '../../models/expedient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpedientsService } from '../../services/expedients';

@Component({
  selector: 'app-expedient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expedient-form.component.html',
  styleUrls: ['./expedient-form.component.scss']
})
export class ExpedientFormComponent implements OnInit {
  @Input() expedient: IExpedienteInDB | null = null;
  @Output() save = new EventEmitter<IExpedienteCreate | IExpedienteUpdate>();

  expedientForm!: FormGroup;
  expedientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expedientsService: ExpedientsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.expedientId = this.route.snapshot.paramMap.get('id');

    if (this.expedientId) {
      this.expedientsService.getExpedientById(this.expedientId).subscribe(
        (expedient) => {
          this.expedient = expedient;
          this.expedientForm.patchValue({
            numero_expediente: expedient.numero_expediente,
            empresa_solicitante_id: expedient.empresa_solicitante_id,
            tipo_tramite: expedient.tipo_tramite,
            fecha_inicio_tramite: expedient.fecha_inicio_tramite ? new Date(expedient.fecha_inicio_tramite).toISOString().substring(0, 10) : '',
            estado_expediente: expedient.estado_expediente,
            resumen_solicitud: expedient.resumen_solicitud,
            numero_folios: expedient.numero_folios,
            // Campos anidados no incluidos en el formulario inicial
          });
        },
        (error) => {
          console.error('Error al cargar expediente:', error);
          this.router.navigate(['/expedients']);
        }
      );
    }
  }

  initForm(): void {
    this.expedientForm = this.fb.group({
      numero_expediente: ['', Validators.required],
      empresa_solicitante_id: ['', Validators.required],
      tipo_tramite: ['', Validators.required],
      fecha_inicio_tramite: [''],
      estado_expediente: ['En Proceso', Validators.required],
      resumen_solicitud: [''],
      numero_folios: [null],
      // Campos anidados no incluidos en el formulario inicial
    });
  }

  onSubmit(): void {
    if (this.expedientForm.valid) {
      const formValue = this.expedientForm.value;

      const expedientToSave: IExpedienteCreate | IExpedienteUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (expedientToSave.fecha_inicio_tramite === '') {
        expedientToSave.fecha_inicio_tramite = null;
      }
      if (expedientToSave.fecha_cierre_expediente === '') {
        expedientToSave.fecha_cierre_expediente = null;
      }

      // Manejar fechas en esquemas anidados (ej. documentos_adjuntos, informes_tecnicos, opiniones_legales, observaciones_historial)
      if (expedientToSave.documentos_adjuntos) {
        expedientToSave.documentos_adjuntos.forEach(doc => {
          if (doc.fecha_carga === '') doc.fecha_carga = null;
        });
      }
      if (expedientToSave.informes_tecnicos) {
        expedientToSave.informes_tecnicos.forEach(informe => {
          if (informe.fecha_emision === '') informe.fecha_emision = null;
        });
      }
      if (expedientToSave.opiniones_legales) {
        expedientToSave.opiniones_legales.forEach(opinion => {
          if (opinion.fecha_emision === '') opinion.fecha_emision = null;
        });
      }
      if (expedientToSave.observaciones_historial) {
        expedientToSave.observaciones_historial.forEach(obs => {
          if (obs.fecha === '') obs.fecha = null;
        });
      }

      if (this.expedientId) {
        this.expedientsService.updateExpedient(this.expedientId, expedientToSave as IExpedienteUpdate).subscribe(
          () => {
            console.log('Expediente actualizado con éxito');
            this.router.navigate(['/expedients']);
          },
          (error) => {
            console.error('Error al actualizar expediente:', error);
          }
        );
      } else {
        this.expedientsService.createExpedient(expedientToSave as IExpedienteCreate).subscribe(
          () => {
            console.log('Expediente creado con éxito');
            this.router.navigate(['/expedients']);
          },
          (error) => {
            console.error('Error al crear expediente:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/expedients']);
  }
}
