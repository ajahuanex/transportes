import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IResolucionInDB, IResolucionCreate, IResolucionUpdate } from '../models/resolution.model';

@Injectable({
  providedIn: 'root'
})
export class ResolutionsService {
  private resolutionPath = '/resoluciones';

  constructor(private apiService: ApiService) { }

  getAllResolutions(): Observable<IResolucionInDB[]> {
    return this.apiService.get<IResolucionInDB[]>(this.resolutionPath);
  }

  

  getResolutionById(id: string): Observable<IResolucionInDB> {
    return this.apiService.get<IResolucionInDB>(`${this.resolutionPath}/${id}`);
  }

  createResolution(resolution: IResolucionCreate): Observable<IResolucionInDB> {
    return this.apiService.post<IResolucionInDB>(this.resolutionPath, resolution);
  }

  updateResolution(id: string, resolution: IResolucionUpdate): Observable<IResolucionInDB> {
    return this.apiService.put<IResolucionInDB>(`${this.resolutionPath}/${id}`, resolution);
  }

  softDeleteResolution(id: string): Observable<IResolucionInDB> {
    return this.apiService.put<IResolucionInDB>(`${this.resolutionPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreResolution(id: string): Observable<IResolucionInDB> {
    return this.apiService.put<IResolucionInDB>(`${this.resolutionPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
