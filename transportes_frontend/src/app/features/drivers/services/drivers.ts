import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IConductorInDB, IConductorCreate, IConductorUpdate } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private driverPath = '/conductores';

  constructor(private apiService: ApiService) { }

  getAllDrivers(): Observable<IConductorInDB[]> {
    return this.apiService.get<IConductorInDB[]>(this.driverPath);
  }

  getAllActiveDrivers(): Observable<IConductorInDB[]> {
    return this.apiService.get<IConductorInDB[]>(`${this.driverPath}/active`);
  }

  getDriverById(id: string): Observable<IConductorInDB> {
    return this.apiService.get<IConductorInDB>(`${this.driverPath}/${id}`);
  }

  createDriver(driver: IConductorCreate): Observable<IConductorInDB> {
    return this.apiService.post<IConductorInDB>(this.driverPath, driver);
  }

  updateDriver(id: string, driver: IConductorUpdate): Observable<IConductorInDB> {
    return this.apiService.put<IConductorInDB>(`${this.driverPath}/${id}`, driver);
  }

  softDeleteDriver(id: string): Observable<IConductorInDB> {
    return this.apiService.put<IConductorInDB>(`${this.driverPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreDriver(id: string): Observable<IConductorInDB> {
    return this.apiService.put<IConductorInDB>(`${this.driverPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
