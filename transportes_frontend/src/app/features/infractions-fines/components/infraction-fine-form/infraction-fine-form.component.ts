import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IInfraccionMultaInDB, IInfraccionMultaCreate, IInfraccionMultaUpdate } from '../../models/infraction-fine.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfractionsFinesService } from '../../services/infractions-fines';

@Component({
  selector: 'app-infraction-fine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './infraction-fine-form.component.html',
  styleUrls: ['./infraction-fine-form.component.scss']
})
export class InfractionFineFormComponent implements OnInit {
  @Input() infractionFine: IInfraccionMultaInDB | null = null;
  @Output() save = new EventEmitter<IInfraccionMultaCreate | IInfraccionMultaUpdate>();

  infractionFineForm!: FormGroup;
  infractionFineId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private infractionsFinesService: InfractionsFinesService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.infractionFineId = this.route.snapshot.paramMap.get('id');

    if (this.infractionFineId) {
      this.infractionsFinesService.getInfractionFineById(this.infractionFineId).subscribe(
        (infractionFine) => {
          this.infractionFine = infractionFine;
          this.infractionFineForm.patchValue({
            numero_infraccion: infractionFine.numero_infraccion,
            fecha_infraccion: infractionFine.fecha_infraccion ? new Date(infractionFine.fecha_infraccion).toISOString().substring(0, 10) : '',
            tipo_infraccion: infractionFine.tipo_infraccion,
            codigo_infraccion: infractionFine.codigo_infraccion,
            descripcion_infraccion: infractionFine.descripcion_infraccion,
            monto_multa: infractionFine.monto_multa,
            moneda: infractionFine.moneda,
            empresa_responsable_id: infractionFine.empresa_responsable_id,
            ruc_empresa_responsable: infractionFine.ruc_empresa_responsable,
            vehiculo_involucrado_id: infractionFine.vehiculo_involucrado_id,
            placa_vehiculo_involucrado: infractionFine.placa_vehiculo_involucrado,
            conductor_involucrado_id: infractionFine.conductor_involucrado_id,
            dni_conductor_involucrado: infractionFine.dni_conductor_involucrado,
            autoridad_emisora: infractionFine.autoridad_emisora,
            estado_multa: infractionFine.estado_multa,
            fecha_notificacion: infractionFine.fecha_notificacion ? new Date(infractionFine.fecha_notificacion).toISOString().substring(0, 10) : '',
            fecha_pago: infractionFine.fecha_pago ? new Date(infractionFine.fecha_pago).toISOString().substring(0, 10) : '',
            monto_pagado: infractionFine.monto_pagado,
            observaciones_multa: infractionFine.observaciones_multa,
          });
        },
        (error) => {
          console.error('Error al cargar infracción/multa:', error);
          this.router.navigate(['/infractions-fines']);
        }
      );
    }
  }

  initForm(): void {
    this.infractionFineForm = this.fb.group({
      numero_infraccion: ['', Validators.required],
      fecha_infraccion: [''],
      tipo_infraccion: ['', Validators.required],
      codigo_infraccion: ['', Validators.required],
      descripcion_infraccion: ['', Validators.required],
      monto_multa: [null, Validators.required],
      moneda: ['PEN', Validators.required],
      empresa_responsable_id: ['', Validators.required],
      ruc_empresa_responsable: ['', Validators.required],
      vehiculo_involucrado_id: [''],
      placa_vehiculo_involucrado: [''],
      conductor_involucrado_id: [''],
      dni_conductor_involucrado: [''],
      autoridad_emisora: ['', Validators.required],
      estado_multa: ['PENDIENTE', Validators.required],
      fecha_notificacion: [''],
      fecha_pago: [''],
      monto_pagado: [null],
      observaciones_multa: [''],
    });
  }

  onSubmit(): void {
    if (this.infractionFineForm.valid) {
      const formValue = this.infractionFineForm.value;

      const infractionFineToSave: IInfraccionMultaCreate | IInfraccionMultaUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (infractionFineToSave.fecha_infraccion === '') {
        infractionFineToSave.fecha_infraccion = null;
      }
      if (infractionFineToSave.fecha_notificacion === '') {
        infractionFineToSave.fecha_notificacion = null;
      }
      if (infractionFineToSave.fecha_pago === '') {
        infractionFineToSave.fecha_pago = null;
      }

      if (this.infractionFineId) {
        this.infractionsFinesService.updateInfractionFine(this.infractionFineId, infractionFineToSave as IInfraccionMultaUpdate).subscribe(
          () => {
            console.log('Infracción/Multa actualizada con éxito');
            this.router.navigate(['/infractions-fines']);
          },
          (error) => {
            console.error('Error al actualizar infracción/multa:', error);
          }
        );
      } else {
        this.infractionsFinesService.createInfractionFine(infractionFineToSave as IInfraccionMultaCreate).subscribe(
          () => {
            console.log('Infracción/Multa creada con éxito');
            this.router.navigate(['/infractions-fines']);
          },
          (error) => {
            console.error('Error al crear infracción/multa:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/infractions-fines']);
  }
}
