import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ITUCInDB, ITUCCreate, ITUCUpdate } from '../models/tuc.model';

@Injectable({
  providedIn: 'root'
})
export class TUCsService {
  private tucPath = '/tucs';

  constructor(private apiService: ApiService) { }

  getAllTUCs(): Observable<ITUCInDB[]> {
    return this.apiService.get<ITUCInDB[]>(this.tucPath);
  }

  getAllActiveTUCs(): Observable<ITUCInDB[]> {
    return this.apiService.get<ITUCInDB[]>(`${this.tucPath}/active`);
  }

  getTUCById(id: string): Observable<ITUCInDB> {
    return this.apiService.get<ITUCInDB>(`${this.tucPath}/${id}`);
  }

  createTUC(tuc: ITUCCreate): Observable<ITUCInDB> {
    return this.apiService.post<ITUCInDB>(this.tucPath, tuc);
  }

  updateTUC(id: string, tuc: ITUCUpdate): Observable<ITUCInDB> {
    return this.apiService.put<ITUCInDB>(`${this.tucPath}/${id}`, tuc);
  }

  softDeleteTUC(id: string): Observable<ITUCInDB> {
    return this.apiService.put<ITUCInDB>(`${this.tucPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreTUC(id: string): Observable<ITUCInDB> {
    return this.apiService.put<ITUCInDB>(`${this.tucPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
