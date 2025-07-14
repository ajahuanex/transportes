import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IExpedienteInDB, IExpedienteCreate, IExpedienteUpdate } from '../models/expedient.model';

@Injectable({
  providedIn: 'root'
})
export class ExpedientsService {
  private expedientPath = '/expedientes';

  constructor(private apiService: ApiService) { }

  getAllExpedients(): Observable<IExpedienteInDB[]> {
    return this.apiService.get<IExpedienteInDB[]>(this.expedientPath);
  }

  getAllActiveExpedients(): Observable<IExpedienteInDB[]> {
    return this.apiService.get<IExpedienteInDB[]>(`${this.expedientPath}/active`);
  }

  getExpedientById(id: string): Observable<IExpedienteInDB> {
    return this.apiService.get<IExpedienteInDB>(`${this.expedientPath}/${id}`);
  }

  createExpedient(expedient: IExpedienteCreate): Observable<IExpedienteInDB> {
    return this.apiService.post<IExpedienteInDB>(this.expedientPath, expedient);
  }

  updateExpedient(id: string, expedient: IExpedienteUpdate): Observable<IExpedienteInDB> {
    return this.apiService.put<IExpedienteInDB>(`${this.expedientPath}/${id}`, expedient);
  }

  softDeleteExpedient(id: string): Observable<IExpedienteInDB> {
    return this.apiService.put<IExpedienteInDB>(`${this.expedientPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreExpedient(id: string): Observable<IExpedienteInDB> {
    return this.apiService.put<IExpedienteInDB>(`${this.expedientPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
