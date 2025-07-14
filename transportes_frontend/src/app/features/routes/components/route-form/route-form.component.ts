import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IRutaInDB, IRutaCreate, IRutaUpdate } from '../../models/route.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesService } from '../../services/routes';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss']
})
export class RouteFormComponent implements OnInit {
  @Input() route: IRutaInDB | null = null;
  @Output() save = new EventEmitter<IRutaCreate | IRutaUpdate>();

  routeForm!: FormGroup;
  routeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routeActivated: ActivatedRoute,
    private router: Router,
    private routesService: RoutesService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.routeId = this.routeActivated.snapshot.paramMap.get('id');

    if (this.routeId) {
      this.routesService.getRouteById(this.routeId).subscribe(
        (route) => {
          this.route = route;
          this.routeForm.patchValue({
            codigo_ruta: route.codigo_ruta,
            origen: route.origen,
            destino: route.destino,
            distancia_km: route.distancia_km,
            tiempo_estimado_horas: route.tiempo_estimado_horas,
            tipo_servicio: route.tipo_servicio,
            empresa_autorizada_id: route.empresa_autorizada_id,
            ruc_empresa_autorizada: route.ruc_empresa_autorizada,
            resolucion_autorizacion_id: route.resolucion_autorizacion_id,
            numero_resolucion_autorizacion: route.numero_resolucion_autorizacion,
            estado_ruta_mtc: route.estado_ruta_mtc,
            observaciones: route.observaciones,
            // Campos anidados no incluidos en el formulario inicial
          });
        },
        (error) => {
          console.error('Error al cargar ruta:', error);
          this.router.navigate(['/routes']);
        }
      );
    }
  }

  initForm(): void {
    this.routeForm = this.fb.group({
      codigo_ruta: ['', Validators.required],
      origen: this.fb.group({
        ciudad: ['', Validators.required],
        departamento: ['', Validators.required],
        terminal_id: ['']
      }),
      destino: this.fb.group({
        ciudad: ['', Validators.required],
        departamento: ['', Validators.required],
        terminal_id: ['']
      }),
      distancia_km: [null],
      tiempo_estimado_horas: [null],
      tipo_servicio: ['', Validators.required],
      empresa_autorizada_id: ['', Validators.required],
      ruc_empresa_autorizada: ['', Validators.required],
      resolucion_autorizacion_id: [''],
      numero_resolucion_autorizacion: ['', Validators.required],
      estado_ruta_mtc: ['Autorizada', Validators.required],
      observaciones: [''],
      // Campos anidados no incluidos en el formulario inicial
    });
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      const formValue = this.routeForm.value;

      const routeToSave: IRutaCreate | IRutaUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      if (this.routeId) {
        this.routesService.updateRoute(this.routeId, routeToSave as IRutaUpdate).subscribe(
          () => {
            console.log('Ruta actualizada con éxito');
            this.router.navigate(['/routes']);
          },
          (error) => {
            console.error('Error al actualizar ruta:', error);
          }
        );
      } else {
        this.routesService.createRoute(routeToSave as IRutaCreate).subscribe(
          () => {
            console.log('Ruta creada con éxito');
            this.router.navigate(['/routes']);
          },
          (error) => {
            console.error('Error al crear ruta:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/routes']);
  }
}
