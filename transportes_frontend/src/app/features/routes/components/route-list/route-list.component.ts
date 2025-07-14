import { Component, OnInit, signal } from '@angular/core';
import { RoutesService } from '../../services/routes';
import { IRutaInDB } from '../../models/route.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements OnInit {
  routes = signal<IRutaInDB[]>([]);

  constructor(private routesService: RoutesService, private router: Router) { }

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.routesService.getAllActiveRoutes().subscribe(
      (data) => {
        this.routes.set(data);
      },
      (error) => {
        console.error('Error al cargar rutas:', error);
      }
    );
  }

  editRoute(id: string): void {
    this.router.navigate(['/routes/edit', id]);
  }

  softDeleteRoute(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      this.routesService.softDeleteRoute(id).subscribe(
        () => {
          console.log('Ruta eliminada lógicamente con éxito');
          this.loadRoutes();
        },
        (error) => {
          console.error('Error al eliminar ruta:', error);
        }
      );
    }
  }

  restoreRoute(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta ruta?')) {
      this.routesService.restoreRoute(id).subscribe(
        () => {
          console.log('Ruta restaurada con éxito');
          this.loadRoutes();
        },
        (error) => {
          console.error('Error al restaurar ruta:', error);
        }
      );
    }
  }

  createRoute(): void {
    this.router.navigate(['/routes/new']);
  }
}
