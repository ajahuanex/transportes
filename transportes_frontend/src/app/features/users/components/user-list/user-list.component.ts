import { Component, OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/users';
import { IUsuarioInDB } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule], // Asegúrate de que CommonModule esté aquí
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users = signal<IUsuarioInDB[]>([]);

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllActiveUsers().subscribe(
      (data) => {
        this.users.set(data);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  editUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  softDeleteUser(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usersService.softDeleteUser(id).subscribe(
        () => {
          console.log('Usuario eliminado lógicamente con éxito');
          this.loadUsers(); // Recargar la lista después de eliminar
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }

  restoreUser(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar este usuario?')) {
      this.usersService.restoreUser(id).subscribe(
        () => {
          console.log('Usuario restaurado con éxito');
          this.loadUsers(); // Recargar la lista después de restaurar
        },
        (error) => {
          console.error('Error al restaurar usuario:', error);
        }
      );
    }
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }
}
