import { Component, OnInit, signal } from '@angular/core';
import { VehiclesService } from '../../services/vehicles';
import { IVehiculoInDB } from '../../models/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  vehicles = signal<IVehiculoInDB[]>([]);

  constructor(private vehiclesService: VehiclesService, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehiclesService.getAllActiveVehicles().subscribe(
      (data) => {
        this.vehicles.set(data);
      },
      (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    );
  }

  editVehicle(id: string): void {
    this.router.navigate(['/vehicles/edit', id]);
  }

  softDeleteVehicle(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      this.vehiclesService.softDeleteVehicle(id).subscribe(
        () => {
          console.log('Vehículo eliminado lógicamente con éxito');
          this.loadVehicles();
        },
        (error) => {
          console.error('Error al eliminar vehículo:', error);
        }
      );
    }
  }

  restoreVehicle(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar este vehículo?')) {
      this.vehiclesService.restoreVehicle(id).subscribe(
        () => {
          console.log('Vehículo restaurado con éxito');
          this.loadVehicles();
        },
        (error) => {
          console.error('Error al restaurar vehículo:', error);
        }
      );
    }
  }

  createVehicle(): void {
    this.router.navigate(['/vehicles/new']);
  }
}
