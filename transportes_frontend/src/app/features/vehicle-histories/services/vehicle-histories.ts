import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IHistorialVehiculoInDB, IHistorialVehiculoCreate, IHistorialVehiculoUpdate } from '../models/vehicle-history.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleHistoriesService {
  private historyPath = '/historial-vehiculos';

  constructor(private apiService: ApiService) { }

  getAllVehicleHistories(): Observable<IHistorialVehiculoInDB[]> {
    return this.apiService.get<IHistorialVehiculoInDB[]>(this.historyPath);
  }

  getVehicleHistoryById(id: string): Observable<IHistorialVehiculoInDB> {
    return this.apiService.get<IHistorialVehiculoInDB>(`${this.historyPath}/${id}`);
  }

  createVehicleHistory(history: IHistorialVehiculoCreate): Observable<IHistorialVehiculoInDB> {
    return this.apiService.post<IHistorialVehiculoInDB>(this.historyPath, history);
  }

  updateVehicleHistory(id: string, history: IHistorialVehiculoUpdate): Observable<IHistorialVehiculoInDB> {
    return this.apiService.put<IHistorialVehiculoInDB>(`${this.historyPath}/${id}`, history);
  }

  deleteVehicleHistory(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.historyPath}/${id}`);
  }
}
