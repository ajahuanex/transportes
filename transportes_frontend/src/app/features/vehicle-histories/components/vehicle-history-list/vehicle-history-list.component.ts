import { Component, OnInit, signal } from '@angular/core';
import { VehicleHistoriesService } from '../../services/vehicle-histories';
import { IHistorialVehiculoInDB } from '../../models/vehicle-history.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-history-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-history-list.component.html',
  styleUrls: ['./vehicle-history-list.component.scss']
})
export class VehicleHistoryListComponent implements OnInit {
  vehicleHistories = signal<IHistorialVehiculoInDB[]>([]);

  constructor(private vehicleHistoriesService: VehicleHistoriesService, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicleHistories();
  }

  loadVehicleHistories(): void {
    this.vehicleHistoriesService.getAllVehicleHistories().subscribe(
      (data) => {
        this.vehicleHistories.set(data);
      },
      (error) => {
        console.error('Error al cargar historial de vehículos:', error);
      }
    );
  }

  editVehicleHistory(id: string): void {
    this.router.navigate(['/vehicle-histories/edit', id]);
  }

  deleteVehicleHistory(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este historial de vehículo?')) {
      this.vehicleHistoriesService.deleteVehicleHistory(id).subscribe(
        () => {
          console.log('Historial de vehículo eliminado con éxito');
          this.loadVehicleHistories();
        },
        (error) => {
          console.error('Error al eliminar historial de vehículo:', error);
        }
      );
    }
  }

  createVehicleHistory(): void {
    this.router.navigate(['/vehicle-histories/new']);
  }
}
