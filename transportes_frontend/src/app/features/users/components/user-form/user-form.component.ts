import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUsuarioInDB, IUsuarioCreate, IUsuarioUpdate } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: IUsuarioInDB | null = null;
  @Output() save = new EventEmitter<IUsuarioCreate | IUsuarioUpdate>();

  userForm!: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.initForm(); // Inicializar el formulario primero

    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      // Modo edición: cargar datos del usuario
      this.usersService.getUserById(this.userId).subscribe(
        (user) => {
          this.user = user;
          // Usar patchValue para actualizar el formulario con los datos del usuario
          this.userForm.patchValue({
            username: user.username,
            nombres: user.nombres,
            apellidos: user.apellidos,
            dni: user.dni,
            email: user.email,
            roles: user.roles.join(', ') // Convertir array a string para el input
          });
          // Si estamos editando, el campo password no es requerido
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        },
        (error) => {
          console.error('Error al cargar usuario:', error);
          // Manejar error, quizás redirigir a la lista
          this.router.navigate(['/users']);
        }
      );
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [''],
      password: ['', Validators.required] // Requerido solo en creación
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const rolesArray = formValue.roles ? formValue.roles.split(',').map((role: string) => role.trim()) : [];

      const userToSave: IUsuarioCreate | IUsuarioUpdate = {
        ...formValue,
        roles: rolesArray
      };

      // Eliminar password si está vacío y no es requerido (en edición)
      if (this.user && !formValue.password) {
        delete userToSave.password;
      }

      // Convertir cadenas vacías de fechas a null en licencia_conducir
      if (userToSave.licencia_conducir) {
        if (userToSave.licencia_conducir.fecha_emision === '') {
          userToSave.licencia_conducir.fecha_emision = null;
        }
        if (userToSave.licencia_conducir.fecha_vencimiento === '') {
          userToSave.licencia_conducir.fecha_vencimiento = null;
        }
      }

      if (this.userId) {
        // Modo edición
        this.usersService.updateUser(this.userId, userToSave as IUsuarioUpdate).subscribe(
          () => {
            console.log('Usuario actualizado con éxito');
            this.router.navigate(['/users']);
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
          }
        );
      } else {
        // Modo creación
        this.usersService.createUser(userToSave as IUsuarioCreate).subscribe(
          () => {
            console.log('Usuario creado con éxito');
            this.router.navigate(['/users']);
          },
          (error) => {
            console.error('Error al crear usuario:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
