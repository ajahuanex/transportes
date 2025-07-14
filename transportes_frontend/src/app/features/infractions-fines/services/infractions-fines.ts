import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IInfraccionMultaInDB, IInfraccionMultaCreate, IInfraccionMultaUpdate } from '../models/infraction-fine.model';

@Injectable({
  providedIn: 'root'
})
export class InfractionsFinesService {
  private infractionFinePath = '/infracciones-multas';

  constructor(private apiService: ApiService) { }

  getAllInfractionsFines(): Observable<IInfraccionMultaInDB[]> {
    return this.apiService.get<IInfraccionMultaInDB[]>(this.infractionFinePath);
  }

  getAllActiveInfractionsFines(): Observable<IInfraccionMultaInDB[]> {
    return this.apiService.get<IInfraccionMultaInDB[]>(`${this.infractionFinePath}/active`);
  }

  getInfractionFineById(id: string): Observable<IInfraccionMultaInDB> {
    return this.apiService.get<IInfraccionMultaInDB>(`${this.infractionFinePath}/${id}`);
  }

  createInfractionFine(infractionFine: IInfraccionMultaCreate): Observable<IInfraccionMultaInDB> {
    return this.apiService.post<IInfraccionMultaInDB>(this.infractionFinePath, infractionFine);
  }

  updateInfractionFine(id: string, infractionFine: IInfraccionMultaUpdate): Observable<IInfraccionMultaInDB> {
    return this.apiService.put<IInfraccionMultaInDB>(`${this.infractionFinePath}/${id}`, infractionFine);
  }

  softDeleteInfractionFine(id: string): Observable<IInfraccionMultaInDB> {
    return this.apiService.put<IInfraccionMultaInDB>(`${this.infractionFinePath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreInfractionFine(id: string): Observable<IInfraccionMultaInDB> {
    return this.apiService.put<IInfraccionMultaInDB>(`${this.infractionFinePath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
