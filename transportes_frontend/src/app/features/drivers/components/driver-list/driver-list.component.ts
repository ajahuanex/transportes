import { Component, OnInit, signal } from '@angular/core';
import { DriversService } from '../../services/drivers';
import { IConductorInDB } from '../../models/driver.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {
  drivers = signal<IConductorInDB[]>([]);

  constructor(private driversService: DriversService, private router: Router) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driversService.getAllActiveDrivers().subscribe(
      (data) => {
        this.drivers.set(data);
      },
      (error) => {
        console.error('Error al cargar conductores:', error);
      }
    );
  }

  editDriver(id: string): void {
    this.router.navigate(['/drivers/edit', id]);
  }

  softDeleteDriver(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este conductor?')) {
      this.driversService.softDeleteDriver(id).subscribe(
        () => {
          console.log('Conductor eliminado lógicamente con éxito');
          this.loadDrivers();
        },
        (error) => {
          console.error('Error al eliminar conductor:', error);
        }
      );
    }
  }

  restoreDriver(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar este conductor?')) {
      this.driversService.restoreDriver(id).subscribe(
        () => {
          console.log('Conductor restaurado con éxito');
          this.loadDrivers();
        },
        (error) => {
          console.error('Error al restaurar conductor:', error);
        }
      );
    }
  }

  createDriver(): void {
    this.router.navigate(['/drivers/new']);
  }
}
