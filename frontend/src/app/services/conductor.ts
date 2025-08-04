import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  Conductor as ConductorModel,
  DeleteConductorRequest,
  RestoreConductorRequest,
  ConductorAuditLog
} from '../models/conductor.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  
  private mockDataService = inject(MockDataService);

  // Obtener lista de conductores con filtros y paginación
  getConductores(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ conductores: ConductorModel[], total: number, totalPaginas: number }> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({
        conductores: [],
        total: 0,
        totalPaginas: 0
      });
      observer.complete();
    });
  }

  // Obtener conductor por ID
  getConductor(id: string): Observable<ConductorModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as ConductorModel);
      observer.complete();
    });
  }

  // Crear nuevo conductor
  createConductor(conductor: Partial<ConductorModel>): Observable<ConductorModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as ConductorModel);
      observer.complete();
    });
  }

  // Actualizar conductor
  updateConductor(id: string, conductor: Partial<ConductorModel>): Observable<ConductorModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as ConductorModel);
      observer.complete();
    });
  }

  // Eliminar conductor (soft delete)
  deleteConductor(request: DeleteConductorRequest): Observable<void> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Restaurar conductor eliminado
  restoreConductor(request: RestoreConductorRequest): Observable<ConductorModel> {
    // TODO: Implementar cuando se conecte con backend real
    return this.getConductor(request.conductorId);
  }

  // Obtener conductores eliminados
  getConductoresEliminados(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ conductores: ConductorModel[], total: number, totalPaginas: number }> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({
        conductores: [],
        total: 0,
        totalPaginas: 0
      });
      observer.complete();
    });
  }

  // Eliminar permanentemente (solo para administradores)
  deleteConductorPermanente(id: string): Observable<void> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Obtener log de auditoría de conductor
  getAuditLogConductor(id: string): Observable<ConductorAuditLog[]> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  // Obtener estadísticas de conductores
  getEstadisticas(): Observable<any> {
    return this.mockDataService.getEstadisticas();
  }

  // Exportar conductores a Excel
  exportarConductores(filters?: any): Observable<Blob> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      const blob = new Blob(['Datos de conductores'], { type: 'application/vnd.ms-excel' });
      observer.next(blob);
      observer.complete();
    });
  }
}
