import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IConfiguracionMTCInDB, IConfiguracionMTCCreate, IConfiguracionMTCUpdate, IReglaAntiguedadVehiculo } from '../../models/mtc-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MtcConfigsService } from '../../services/mtc-configs';

@Component({
  selector: 'app-mtc-config-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mtc-config-form.component.html',
  styleUrls: ['./mtc-config-form.component.scss']
})
export class MtcConfigFormComponent implements OnInit {
  @Input() mtcConfig: IConfiguracionMTCInDB | null = null;
  @Output() save = new EventEmitter<IConfiguracionMTCCreate | IConfiguracionMTCUpdate>();

  mtcConfigForm!: FormGroup;
  configId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mtcConfigsService: MtcConfigsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.configId = this.route.snapshot.paramMap.get('id');

    if (this.configId) {
      this.mtcConfigsService.getMtcConfig().subscribe(
        (config) => {
          this.mtcConfig = config;
          this.mtcConfigForm.patchValue({
            observaciones: config.observaciones,
          });
          // Populate FormArray
          this.setReglasAntiguedad(config.reglas_antiguedad);
        },
        (error) => {
          console.error('Error al cargar configuración MTC:', error);
          this.router.navigate(['/mtc-configs']);
        }
      );
    }
  }

  initForm(): void {
    this.mtcConfigForm = this.fb.group({
      reglas_antiguedad: this.fb.array([]),
      observaciones: [''],
    });
  }

  get reglasAntiguedad(): FormArray {
    return this.mtcConfigForm.get('reglas_antiguedad') as FormArray;
  }

  newReglaAntiguedad(): FormGroup {
    return this.fb.group({
      tipo_servicio: ['', Validators.required],
      categoria_vehicular: ['', Validators.required],
      edad_maxima_anios: [null, Validators.required],
      notas: [''],
    });
  }

  addReglaAntiguedad(): void {
    this.reglasAntiguedad.push(this.newReglaAntiguedad());
  }

  removeReglaAntiguedad(index: number): void {
    this.reglasAntiguedad.removeAt(index);
  }

  setReglasAntiguedad(reglas: IReglaAntiguedadVehiculo[]): void {
    reglas.forEach(regla => {
      this.reglasAntiguedad.push(this.fb.group({
        tipo_servicio: [regla.tipo_servicio, Validators.required],
        categoria_vehicular: [regla.categoria_vehicular, Validators.required],
        edad_maxima_anios: [regla.edad_maxima_anios, Validators.required],
        notas: [regla.notas],
      }));
    });
  }

  onSubmit(): void {
    if (this.mtcConfigForm.valid) {
      const formValue = this.mtcConfigForm.value;

      const configToSave: IConfiguracionMTCCreate | IConfiguracionMTCUpdate = {
        ...formValue,
      };

      if (this.configId) {
        this.mtcConfigsService.updateMtcConfig(configToSave as IConfiguracionMTCUpdate).subscribe(
          () => {
            console.log('Configuración MTC actualizada con éxito');
            this.router.navigate(['/mtc-configs']);
          },
          (error) => {
            console.error('Error al actualizar configuración MTC:', error);
          }
        );
      } else {
        this.mtcConfigsService.createMtcConfig(configToSave as IConfiguracionMTCCreate).subscribe(
          () => {
            console.log('Configuración MTC creada con éxito');
            this.router.navigate(['/mtc-configs']);
          },
          (error) => {
            console.error('Error al crear configuración MTC:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/mtc-configs']);
  }
}
