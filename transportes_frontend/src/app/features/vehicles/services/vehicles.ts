import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IVehiculoInDB, IVehiculoCreate, IVehiculoUpdate } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private vehiclePath = '/vehiculos';

  constructor(private apiService: ApiService) { }

  getAllVehicles(): Observable<IVehiculoInDB[]> {
    return this.apiService.get<IVehiculoInDB[]>(this.vehiclePath);
  }

  getAllActiveVehicles(): Observable<IVehiculoInDB[]> {
    return this.apiService.get<IVehiculoInDB[]>(`${this.vehiclePath}/active`);
  }

  getVehicleById(id: string): Observable<IVehiculoInDB> {
    return this.apiService.get<IVehiculoInDB>(`${this.vehiclePath}/${id}`);
  }

  createVehicle(vehicle: IVehiculoCreate): Observable<IVehiculoInDB> {
    return this.apiService.post<IVehiculoInDB>(this.vehiclePath, vehicle);
  }

  updateVehicle(id: string, vehicle: IVehiculoUpdate): Observable<IVehiculoInDB> {
    return this.apiService.put<IVehiculoInDB>(`${this.vehiclePath}/${id}`, vehicle);
  }

  softDeleteVehicle(id: string): Observable<IVehiculoInDB> {
    return this.apiService.put<IVehiculoInDB>(`${this.vehiclePath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreVehicle(id: string): Observable<IVehiculoInDB> {
    return this.apiService.put<IVehiculoInDB>(`${this.vehiclePath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
