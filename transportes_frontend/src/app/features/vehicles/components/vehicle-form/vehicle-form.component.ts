import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IVehiculoInDB, IVehiculoCreate, IVehiculoUpdate } from '../../models/vehicle.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../services/vehicles';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit {
  @Input() vehicle: IVehiculoInDB | null = null;
  @Output() save = new EventEmitter<IVehiculoCreate | IVehiculoUpdate>();

  vehicleForm!: FormGroup;
  vehicleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesService: VehiclesService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.vehicleId = this.route.snapshot.paramMap.get('id');

    if (this.vehicleId) {
      this.vehiclesService.getVehicleById(this.vehicleId).subscribe(
        (vehicle) => {
          this.vehicle = vehicle;
          this.vehicleForm.patchValue({
            placa: vehicle.placa,
            empresa_id: vehicle.empresa_id,
            tipo_servicio_principal: vehicle.tipo_servicio_principal,
            estado_vehiculo_mtc: vehicle.estado_vehiculo_mtc,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            anio_fabricacion: vehicle.anio_fabricacion,
            color: vehicle.color,
            categoria: vehicle.categoria,
            carroceria: vehicle.carroceria,
            clase: vehicle.clase,
            combustible: vehicle.combustible,
            numero_motor: vehicle.numero_motor,
            numero_serie_chasis: vehicle.numero_serie_chasis,
            num_asientos: vehicle.num_asientos,
            capacidad_pasajeros: vehicle.capacidad_pasajeros,
            cilindros: vehicle.cilindros,
            ejes: vehicle.ejes,
            ruedas: vehicle.ruedas,
            peso_bruto_vehicular: vehicle.peso_bruto_vehicular,
            peso_neto: vehicle.peso_neto,
            carga_util: vehicle.carga_util,
            largo: vehicle.largo,
            ancho: vehicle.ancho,
            alto: vehicle.alto,
            observaciones: vehicle.observaciones,
            fecha_ultima_revision_tecnica: vehicle.fecha_ultima_revision_tecnica ? new Date(vehicle.fecha_ultima_revision_tecnica).toISOString().substring(0, 10) : '',
            fecha_vencimiento_revision_tecnica: vehicle.fecha_vencimiento_revision_tecnica ? new Date(vehicle.fecha_vencimiento_revision_tecnica).toISOString().substring(0, 10) : '',
          });
        },
        (error) => {
          console.error('Error al cargar vehículo:', error);
          this.router.navigate(['/vehicles']);
        }
      );
    }
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      placa: ['', Validators.required],
      empresa_id: ['', Validators.required],
      tipo_servicio_principal: ['', Validators.required],
      estado_vehiculo_mtc: ['Operativo', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_fabricacion: [null, Validators.required],
      color: [''],
      categoria: ['', Validators.required],
      carroceria: [''],
      clase: [''],
      combustible: [''],
      numero_motor: [''],
      numero_serie_chasis: [''],
      num_asientos: [null],
      capacidad_pasajeros: [null],
      cilindros: [null],
      ejes: [null],
      ruedas: [null],
      peso_bruto_vehicular: [null],
      peso_neto: [null],
      carga_util: [null],
      largo: [null],
      ancho: [null],
      alto: [null],
      observaciones: [''],
      fecha_ultima_revision_tecnica: [''],
      fecha_vencimiento_revision_tecnica: [''],
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const formValue = this.vehicleForm.value;

      const vehicleToSave: IVehiculoCreate | IVehiculoUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (vehicleToSave.fecha_ultima_revision_tecnica === '') {
        vehicleToSave.fecha_ultima_revision_tecnica = null;
      }
      if (vehicleToSave.fecha_vencimiento_revision_tecnica === '') {
        vehicleToSave.fecha_vencimiento_revision_tecnica = null;
      }

      if (this.vehicleId) {
        this.vehiclesService.updateVehicle(this.vehicleId, vehicleToSave as IVehiculoUpdate).subscribe(
          () => {
            console.log('Vehículo actualizado con éxito');
            this.router.navigate(['/vehicles']);
          },
          (error) => {
            console.error('Error al actualizar vehículo:', error);
          }
        );
      } else {
        this.vehiclesService.createVehicle(vehicleToSave as IVehiculoCreate).subscribe(
          () => {
            console.log('Vehículo creado con éxito');
            this.router.navigate(['/vehicles']);
          },
          (error) => {
            console.error('Error al crear vehículo:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}
