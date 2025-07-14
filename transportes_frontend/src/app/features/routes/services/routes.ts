import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IRutaInDB, IRutaCreate, IRutaUpdate } from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private routePath = '/rutas';

  constructor(private apiService: ApiService) { }

  getAllRoutes(): Observable<IRutaInDB[]> {
    return this.apiService.get<IRutaInDB[]>(this.routePath);
  }

  getAllActiveRoutes(): Observable<IRutaInDB[]> {
    return this.apiService.get<IRutaInDB[]>(`${this.routePath}/active`);
  }

  getRouteById(id: string): Observable<IRutaInDB> {
    return this.apiService.get<IRutaInDB>(`${this.routePath}/${id}`);
  }

  createRoute(route: IRutaCreate): Observable<IRutaInDB> {
    return this.apiService.post<IRutaInDB>(this.routePath, route);
  }

  updateRoute(id: string, route: IRutaUpdate): Observable<IRutaInDB> {
    return this.apiService.put<IRutaInDB>(`${this.routePath}/${id}`, route);
  }

  softDeleteRoute(id: string): Observable<IRutaInDB> {
    return this.apiService.put<IRutaInDB>(`${this.routePath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreRoute(id: string): Observable<IRutaInDB> {
    return this.apiService.put<IRutaInDB>(`${this.routePath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
