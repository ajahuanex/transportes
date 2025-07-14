import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITUCInDB, ITUCCreate, ITUCUpdate } from '../../models/tuc.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TUCsService } from '../../services/tucs';

@Component({
  selector: 'app-tuc-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tuc-form.component.html',
  styleUrls: ['./tuc-form.component.scss']
})
export class TucFormComponent implements OnInit {
  @Input() tuc: ITUCInDB | null = null;
  @Output() save = new EventEmitter<ITUCCreate | ITUCUpdate>();

  tucForm!: FormGroup;
  tucId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tucsService: TUCsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.tucId = this.route.snapshot.paramMap.get('id');

    if (this.tucId) {
      this.tucsService.getTUCById(this.tucId).subscribe(
        (tuc) => {
          this.tuc = tuc;
          this.tucForm.patchValue({
            numero_tuc: tuc.numero_tuc,
            numero_tuc_primigenia: tuc.numero_tuc_primigenia,
            tipo_generacion: tuc.tipo_generacion,
            empresa_id: tuc.empresa_id,
            ruc_empresa: tuc.ruc_empresa,
            razon_social_empresa: tuc.razon_social_empresa,
            nombre_representante_legal: tuc.nombre_representante_legal,
            vehiculo_id: tuc.vehiculo_id,
            placa_vehiculo: tuc.placa_vehiculo,
            marca_vehiculo: tuc.marca_vehiculo,
            modelo_vehiculo: tuc.modelo_vehiculo,
            anio_fabricacion_vehiculo: tuc.anio_fabricacion_vehiculo,
            color_vehiculo: tuc.color_vehiculo,
            categoria_vehiculo: tuc.categoria_vehiculo,
            carroceria_vehiculo: tuc.carroceria_vehiculo,
            clase_vehiculo: tuc.clase_vehiculo,
            combustible_vehiculo: tuc.combustible_vehiculo,
            numero_motor_vehiculo: tuc.numero_motor_vehiculo,
            numero_serie_vin_vehiculo: tuc.numero_serie_vin_vehiculo,
            num_asientos_vehiculo: tuc.num_asientos_vehiculo,
            num_pasajeros_vehiculo: tuc.num_pasajeros_vehiculo,
            cilindros_vehiculo: tuc.cilindros_vehiculo,
            ejes_vehiculo: tuc.ejes_vehiculo,
            ruedas_vehiculo: tuc.ruedas_vehiculo,
            peso_bruto_vehiculo: tuc.peso_bruto_vehiculo,
            peso_neto_vehiculo: tuc.peso_neto_vehiculo,
            carga_util_vehiculo: tuc.carga_util_vehiculo,
            largo_vehiculo: tuc.largo_vehiculo,
            ancho_vehiculo: tuc.ancho_vehiculo,
            alto_vehiculo: tuc.alto_vehiculo,
            resolucion_origen_id: tuc.resolucion_origen_id,
            numero_resolucion: tuc.numero_resolucion,
            fecha_resolucion: tuc.fecha_resolucion ? new Date(tuc.fecha_resolucion).toISOString().substring(0, 10) : '',
            tipo_resolucion: tuc.tipo_resolucion,
            expediente_id: tuc.expediente_id,
            numero_expediente: tuc.numero_expediente,
            fecha_emision: tuc.fecha_emision ? new Date(tuc.fecha_emision).toISOString().substring(0, 10) : '',
            fecha_vencimiento: tuc.fecha_vencimiento ? new Date(tuc.fecha_vencimiento).toISOString().substring(0, 10) : '',
            estado: tuc.estado,
            motivo_estado: tuc.motivo_estado,
            observaciones_tuc: tuc.observaciones_tuc,
            // Campos anidados no incluidos en el formulario inicial
          });
        },
        (error) => {
          console.error('Error al cargar TUC:', error);
          this.router.navigate(['/tucs']);
        }
      );
    }
  }

  initForm(): void {
    this.tucForm = this.fb.group({
      numero_tuc: ['', Validators.required],
      numero_tuc_primigenia: [''],
      tipo_generacion: ['EMISION_INICIAL', Validators.required],
      empresa_id: ['', Validators.required],
      ruc_empresa: ['', Validators.required],
      razon_social_empresa: ['', Validators.required],
      nombre_representante_legal: [''],
      vehiculo_id: ['', Validators.required],
      placa_vehiculo: ['', Validators.required],
      marca_vehiculo: ['', Validators.required],
      modelo_vehiculo: ['', Validators.required],
      anio_fabricacion_vehiculo: [null, Validators.required],
      color_vehiculo: [''],
      categoria_vehiculo: ['', Validators.required],
      carroceria_vehiculo: [''],
      clase_vehiculo: [''],
      combustible_vehiculo: [''],
      numero_motor_vehiculo: [''],
      numero_serie_vin_vehiculo: [''],
      num_asientos_vehiculo: [null],
      num_pasajeros_vehiculo: [null],
      cilindros_vehiculo: [null],
      ejes_vehiculo: [null],
      ruedas_vehiculo: [null],
      peso_bruto_vehiculo: [null],
      peso_neto_vehiculo: [null],
      carga_util_vehiculo: [null],
      largo_vehiculo: [null],
      ancho_vehiculo: [null],
      alto_vehiculo: [null],
      resolucion_origen_id: ['', Validators.required],
      numero_resolucion: ['', Validators.required],
      fecha_resolucion: ['', Validators.required],
      tipo_resolucion: ['', Validators.required],
      expediente_id: ['', Validators.required],
      numero_expediente: ['', Validators.required],
      fecha_emision: [''],
      fecha_vencimiento: ['', Validators.required],
      estado: ['HABILITADO', Validators.required],
      motivo_estado: [''],
      observaciones_tuc: [''],
      // Campos anidados no incluidos en el formulario inicial
    });
  }

  onSubmit(): void {
    if (this.tucForm.valid) {
      const formValue = this.tucForm.value;

      const tucToSave: ITUCCreate | ITUCUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (tucToSave.fecha_resolucion === '') {
        tucToSave.fecha_resolucion = null;
      }
      if (tucToSave.fecha_emision === '') {
        tucToSave.fecha_emision = null;
      }
      if (tucToSave.fecha_vencimiento === '') {
        tucToSave.fecha_vencimiento = null;
      }

      // Manejar fechas en esquemas anidados (ej. historial_estados)
      if (tucToSave.historial_estados) {
        tucToSave.historial_estados.forEach(hist => {
          if (hist.fecha === '') hist.fecha = null;
        });
      }

      if (this.tucId) {
        this.tucsService.updateTUC(this.tucId, tucToSave as ITUCUpdate).subscribe(
          () => {
            console.log('TUC actualizada con éxito');
            this.router.navigate(['/tucs']);
          },
          (error) => {
            console.error('Error al actualizar TUC:', error);
          }
        );
      } else {
        this.tucsService.createTUC(tucToSave as ITUCCreate).subscribe(
          () => {
            console.log('TUC creada con éxito');
            this.router.navigate(['/tucs']);
          },
          (error) => {
            console.error('Error al crear TUC:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/tucs']);
  }
}
