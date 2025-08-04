import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '../../../services/ruta';
import { Ruta, CreateRutaRequest, UpdateRutaRequest, TipoRuta, CategoriaRuta } from '../../../models/ruta.model';

@Component({
  selector: 'app-ruta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ruta-form.html',
  styleUrls: ['./ruta-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RutaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rutaService = inject(RutaService);

  // Signals
  ruta = signal<Ruta | null>(null);
  cargando = signal(false);
  guardando = signal(false);
  esEdicion = signal(false);

  // Form
  rutaForm!: FormGroup;

  // Enums para el template
  TipoRuta = TipoRuta;
  CategoriaRuta = CategoriaRuta;

  // Computed
  currentRuta = computed(() => this.ruta());
  isLoading = computed(() => this.cargando());
  isSaving = computed(() => this.guardando());
  isEditing = computed(() => this.esEdicion());

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarRuta();
  }

  private inicializarFormulario(): void {
    this.rutaForm = this.fb.group({
      codigoRuta: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[A-Z]{3}-\d{2}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      estado: ['ACTIVA', [Validators.required]],
      descripcion: [''],
      distancia: [null, [Validators.min(0)]],
      tiempoEstimado: [null, [Validators.min(0)]],
      tipoRuta: [TipoRuta.URBANA, [Validators.required]],
      categoria: [CategoriaRuta.PASAJEROS, [Validators.required]]
    });
  }

  private cargarRuta(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion.set(true);
      this.cargando.set(true);
      
      this.rutaService.getRuta(id).subscribe({
        next: (ruta) => {
          if (ruta) {
            this.ruta.set(ruta);
            this.cargarDatosEnFormulario(ruta);
          }
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar ruta:', error);
          this.cargando.set(false);
        }
      });
    }
  }

  private cargarDatosEnFormulario(ruta: Ruta): void {
    this.rutaForm.patchValue({
      codigoRuta: ruta.codigoRuta,
      nombre: ruta.nombre,
      origen: ruta.origen,
      destino: ruta.destino,
      estado: ruta.estado,
      descripcion: ruta.descripcion || '',
      distancia: ruta.distancia || null,
      tiempoEstimado: ruta.tiempoEstimado || null,
      tipoRuta: ruta.tipoRuta,
      categoria: ruta.categoria
    });
  }

  generarCodigoRuta(): void {
    this.rutaService.generarCodigoRuta().subscribe({
      next: (codigo) => {
        this.rutaForm.patchValue({ codigoRuta: codigo });
      },
      error: (error) => {
        console.error('Error al generar código:', error);
      }
    });
  }

  validarCodigoRuta(): void {
    const codigo = this.rutaForm.get('codigoRuta')?.value;
    if (codigo) {
      this.rutaService.validarCodigoRuta(codigo).subscribe({
        next: (esValido) => {
          if (!esValido) {
            this.rutaForm.get('codigoRuta')?.setErrors({ codigoDuplicado: true });
          }
        },
        error: (error) => {
          console.error('Error al validar código:', error);
        }
      });
    }
  }

  guardar(): void {
    if (this.rutaForm.valid) {
      this.guardando.set(true);
      
      const datos = this.rutaForm.value;
      
      if (this.isEditing()) {
        const rutaId = this.route.snapshot.paramMap.get('id')!;
        const updateRequest: UpdateRutaRequest = {
          nombre: datos.nombre,
          origen: datos.origen,
          destino: datos.destino,
          estado: datos.estado,
          descripcion: datos.descripcion,
          distancia: datos.distancia,
          tiempoEstimado: datos.tiempoEstimado,
          tipoRuta: datos.tipoRuta,
          categoria: datos.categoria
        };

        this.rutaService.updateRuta(rutaId, updateRequest).subscribe({
          next: (ruta) => {
            console.log('Ruta actualizada:', ruta);
            this.router.navigate(['/rutas', ruta.id]);
          },
          error: (error) => {
            console.error('Error al actualizar ruta:', error);
            this.guardando.set(false);
          }
        });
      } else {
        const createRequest: CreateRutaRequest = {
          codigoRuta: datos.codigoRuta,
          nombre: datos.nombre,
          origen: datos.origen,
          destino: datos.destino,
          estado: datos.estado,
          descripcion: datos.descripcion,
          distancia: datos.distancia,
          tiempoEstimado: datos.tiempoEstimado,
          tipoRuta: datos.tipoRuta,
          categoria: datos.categoria
        };

        this.rutaService.createRuta(createRequest).subscribe({
          next: (ruta) => {
            console.log('Ruta creada:', ruta);
            this.router.navigate(['/rutas', ruta.id]);
          },
          error: (error) => {
            console.error('Error al crear ruta:', error);
            this.guardando.set(false);
          }
        });
      }
    } else {
      this.marcarCamposInvalidos();
    }
  }

  cancelar(): void {
    this.router.navigate(['/rutas']);
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.rutaForm.controls).forEach(key => {
      const control = this.rutaForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  getTipoRutaOptions(): { value: TipoRuta; label: string }[] {
    return [
      { value: TipoRuta.URBANA, label: 'Urbana' },
      { value: TipoRuta.INTERURBANA, label: 'Interurbana' },
      { value: TipoRuta.INTERPROVINCIAL, label: 'Interprovincial' },
      { value: TipoRuta.INTERREGIONAL, label: 'Interregional' },
      { value: TipoRuta.NACIONAL, label: 'Nacional' }
    ];
  }

  getCategoriaOptions(): { value: CategoriaRuta; label: string }[] {
    return [
      { value: CategoriaRuta.PASAJEROS, label: 'Pasajeros' },
      { value: CategoriaRuta.CARGA, label: 'Carga' },
      { value: CategoriaRuta.MIXTA, label: 'Mixta' },
      { value: CategoriaRuta.ESPECIAL, label: 'Especial' }
    ];
  }

  getEstadoOptions(): { value: string; label: string }[] {
    return [
      { value: 'ACTIVA', label: 'Activa' },
      { value: 'INACTIVA', label: 'Inactiva' },
      { value: 'SUSPENDIDA', label: 'Suspendida' },
      { value: 'CANCELADA', label: 'Cancelada' }
    ];
  }
} 