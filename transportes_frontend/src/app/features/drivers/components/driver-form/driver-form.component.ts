import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IConductorInDB, IConductorCreate, IConductorUpdate } from '../../models/driver.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DriversService } from '../../services/drivers';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss']
})
export class DriverFormComponent implements OnInit {
  @Input() driver: IConductorInDB | null = null;
  @Output() save = new EventEmitter<IConductorCreate | IConductorUpdate>();

  driverForm!: FormGroup;
  driverId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private driversService: DriversService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.driverId = this.route.snapshot.paramMap.get('id');

    if (this.driverId) {
      this.driversService.getDriverById(this.driverId).subscribe(
        (driver) => {
          this.driver = driver;
          this.driverForm.patchValue({
            dni: driver.dni,
            nombres: driver.nombres,
            apellidos: driver.apellidos,
            // licencia_conducir: driver.licencia_conducir, // Manejo especial
            fecha_nacimiento: driver.fecha_nacimiento ? new Date(driver.fecha_nacimiento).toISOString().substring(0, 10) : '',
            telefono: driver.telefono,
            email: driver.email,
            // empresas_asociadas: driver.empresas_asociadas, // Manejo especial
            estado_habilitacion_mtc: driver.estado_habilitacion_mtc,
          });
          // Patch values for nested licencia_conducir
          if (driver.licencia_conducir) {
            this.driverForm.get('licencia_conducir')?.patchValue({
              numero: driver.licencia_conducir.numero,
              clase_categoria: driver.licencia_conducir.clase_categoria,
              fecha_emision: driver.licencia_conducir.fecha_emision ? new Date(driver.licencia_conducir.fecha_emision).toISOString().substring(0, 10) : '',
              fecha_vencimiento: driver.licencia_conducir.fecha_vencimiento ? new Date(driver.licencia_conducir.fecha_vencimiento).toISOString().substring(0, 10) : '',
              puntos: driver.licencia_conducir.puntos,
            });
          }
        },
        (error) => {
          console.error('Error al cargar conductor:', error);
          this.router.navigate(['/drivers']);
        }
      );
    }
  }

  initForm(): void {
    this.driverForm = this.fb.group({
      dni: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      licencia_conducir: this.fb.group({
        numero: ['', Validators.required],
        clase_categoria: ['', Validators.required],
        fecha_emision: ['', Validators.required],
        fecha_vencimiento: ['', Validators.required],
        puntos: [null],
      }),
      fecha_nacimiento: [''],
      telefono: [''],
      email: ['', Validators.email],
      // empresas_asociadas: this.fb.array([]), // Manejo especial
      estado_habilitacion_mtc: ['Habilitado', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.driverForm.valid) {
      const formValue = this.driverForm.value;

      const driverToSave: IConductorCreate | IConductorUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (driverToSave.fecha_nacimiento === '') {
        driverToSave.fecha_nacimiento = null;
      }
      if (driverToSave.licencia_conducir) {
        if (driverToSave.licencia_conducir.fecha_emision === '') {
          driverToSave.licencia_conducir.fecha_emision = null;
        }
        if (driverToSave.licencia_conducir.fecha_vencimiento === '') {
          driverToSave.licencia_conducir.fecha_vencimiento = null;
        }
      }

      if (this.driverId) {
        this.driversService.updateDriver(this.driverId, driverToSave as IConductorUpdate).subscribe(
          () => {
            console.log('Conductor actualizado con éxito');
            this.router.navigate(['/drivers']);
          },
          (error) => {
            console.error('Error al actualizar conductor:', error);
          }
        );
      } else {
        this.driversService.createDriver(driverToSave as IConductorCreate).subscribe(
          () => {
            console.log('Conductor creado con éxito');
            this.router.navigate(['/drivers']);
          },
          (error) => {
            console.error('Error al crear conductor:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/drivers']);
  }
}
