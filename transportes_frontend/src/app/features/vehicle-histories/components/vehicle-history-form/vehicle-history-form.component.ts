import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IHistorialVehiculoInDB, IHistorialVehiculoCreate, IHistorialVehiculoUpdate } from '../../models/vehicle-history.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleHistoriesService } from '../../services/vehicle-histories';

@Component({
  selector: 'app-vehicle-history-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-history-form.component.html',
  styleUrls: ['./vehicle-history-form.component.scss']
})
export class VehicleHistoryFormComponent implements OnInit {
  @Input() vehicleHistory: IHistorialVehiculoInDB | null = null;
  @Output() save = new EventEmitter<IHistorialVehiculoCreate | IHistorialVehiculoUpdate>();

  vehicleHistoryForm!: FormGroup;
  vehicleHistoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleHistoriesService: VehicleHistoriesService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.vehicleHistoryId = this.route.snapshot.paramMap.get('id');

    if (this.vehicleHistoryId) {
      this.vehicleHistoriesService.getVehicleHistoryById(this.vehicleHistoryId).subscribe(
        (history) => {
          this.vehicleHistory = history;
          this.vehicleHistoryForm.patchValue({
            vehiculo_id: history.vehiculo_id,
            placa_vehiculo: history.placa_vehiculo,
            tipo_evento: history.tipo_evento,
            fecha_evento: history.fecha_evento ? new Date(history.fecha_evento).toISOString().substring(0, 10) : '',
            resolucion_id: history.resolucion_id,
            campo_modificado: history.campo_modificado,
            valor_anterior: history.valor_anterior,
            valor_nuevo: history.valor_nuevo,
            observaciones: history.observaciones,
            usuario_id: history.usuario_id,
            // Campos anidados como detalle_accidente no incluidos en el formulario inicial
          });
        },
        (error) => {
          console.error('Error al cargar historial de vehículo:', error);
          this.router.navigate(['/vehicle-histories']);
        }
      );
    }
  }

  initForm(): void {
    this.vehicleHistoryForm = this.fb.group({
      vehiculo_id: ['', Validators.required],
      placa_vehiculo: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      fecha_evento: [''],
      resolucion_id: [''],
      campo_modificado: [''],
      valor_anterior: [''],
      valor_nuevo: [''],
      observaciones: [''],
      usuario_id: [''],
    });
  }

  onSubmit(): void {
    if (this.vehicleHistoryForm.valid) {
      const formValue = this.vehicleHistoryForm.value;

      const historyToSave: IHistorialVehiculoCreate | IHistorialVehiculoUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (historyToSave.fecha_evento === '') {
        historyToSave.fecha_evento = null;
      }

      // Manejar fechas en esquemas anidados (ej. detalle_accidente)
      if (historyToSave.detalle_accidente) {
        if (historyToSave.detalle_accidente.fecha_accidente === '') {
          historyToSave.detalle_accidente.fecha_accidente = null;
        }
      }

      if (this.vehicleHistoryId) {
        this.vehicleHistoriesService.updateVehicleHistory(this.vehicleHistoryId, historyToSave as IHistorialVehiculoUpdate).subscribe(
          () => {
            console.log('Historial de vehículo actualizado con éxito');
            this.router.navigate(['/vehicle-histories']);
          },
          (error) => {
            console.error('Error al actualizar historial de vehículo:', error);
          }
        );
      } else {
        this.vehicleHistoriesService.createVehicleHistory(historyToSave as IHistorialVehiculoCreate).subscribe(
          () => {
            console.log('Historial de vehículo creado con éxito');
            this.router.navigate(['/vehicle-histories']);
          },
          (error) => {
            console.error('Error al crear historial de vehículo:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicle-histories']);
  }
}
