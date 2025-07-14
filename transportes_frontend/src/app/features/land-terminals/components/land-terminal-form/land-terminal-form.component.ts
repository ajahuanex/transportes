import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITerminalTerrestreInDB, ITerminalTerrestreCreate, ITerminalTerrestreUpdate } from '../../models/land-terminal.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LandTerminalsService } from '../../services/land-terminals';

@Component({
  selector: 'app-land-terminal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './land-terminal-form.component.html',
  styleUrls: ['./land-terminal-form.component.scss']
})
export class LandTerminalFormComponent implements OnInit {
  @Input() landTerminal: ITerminalTerrestreInDB | null = null;
  @Output() save = new EventEmitter<ITerminalTerrestreCreate | ITerminalTerrestreUpdate>();

  landTerminalForm!: FormGroup;
  landTerminalId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private landTerminalsService: LandTerminalsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.landTerminalId = this.route.snapshot.paramMap.get('id');

    if (this.landTerminalId) {
      this.landTerminalsService.getLandTerminalById(this.landTerminalId).subscribe(
        (terminal) => {
          this.landTerminal = terminal;
          this.landTerminalForm.patchValue({
            nombre: terminal.nombre,
            // ubicacion: terminal.ubicacion, // Manejo especial
            capacidad_andenes: terminal.capacidad_andenes,
            administrador: terminal.administrador,
            telefono: terminal.telefono,
            email: terminal.email,
          });
          // Patch values for nested ubicacion
          if (terminal.ubicacion) {
            this.landTerminalForm.get('ubicacion')?.patchValue({
              latitud: terminal.ubicacion.latitud,
              longitud: terminal.ubicacion.longitud,
              direccion: terminal.ubicacion.direccion,
              ciudad: terminal.ubicacion.ciudad,
              departamento: terminal.ubicacion.departamento,
            });
          }
        },
        (error) => {
          console.error('Error al cargar terminal terrestre:', error);
          this.router.navigate(['/land-terminals']);
        }
      );
    }
  }

  initForm(): void {
    this.landTerminalForm = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: this.fb.group({
        latitud: [null],
        longitud: [null],
        direccion: [''],
        ciudad: [''],
        departamento: [''],
      }),
      // tipo_infraestructura_complementaria: this.fb.array([]), // Manejo especial
      // empresas_usuarios: this.fb.array([]), // Manejo especial
      capacidad_andenes: [null],
      administrador: [''],
      telefono: [''],
      email: ['', Validators.email],
    });
  }

  onSubmit(): void {
    if (this.landTerminalForm.valid) {
      const formValue = this.landTerminalForm.value;

      const terminalToSave: ITerminalTerrestreCreate | ITerminalTerrestreUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      if (this.landTerminalId) {
        this.landTerminalsService.updateLandTerminal(this.landTerminalId, terminalToSave as ITerminalTerrestreUpdate).subscribe(
          () => {
            console.log('Terminal terrestre actualizada con éxito');
            this.router.navigate(['/land-terminals']);
          },
          (error) => {
            console.error('Error al actualizar terminal terrestre:', error);
          }
        );
      } else {
        this.landTerminalsService.createLandTerminal(terminalToSave as ITerminalTerrestreCreate).subscribe(
          () => {
            console.log('Terminal terrestre creada con éxito');
            this.router.navigate(['/land-terminals']);
          },
          (error) => {
            console.error('Error al crear terminal terrestre:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/land-terminals']);
  }
}
