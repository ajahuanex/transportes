import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
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
    return this.mockDataService.getConductores(page, limit).pipe(
      delay(500) // Simular delay de red
    );
  }

  // Obtener conductor por ID
  getConductor(id: string): Observable<ConductorModel> {
    return new Observable<ConductorModel>(observer => {
      this.mockDataService.getConductores().subscribe({
        next: (response) => {
          const found = response.conductores.find(c => c.id === id);
          if (found) {
            observer.next(found);
          } else {
            observer.error('Conductor no encontrado');
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    }).pipe(delay(300));
  }

  // Crear nuevo conductor
  createConductor(conductor: Partial<ConductorModel>): Observable<ConductorModel> {
    return new Observable<ConductorModel>(observer => {
      const nuevoConductor: ConductorModel = {
        id: Date.now().toString(),
        ...conductor,
        fechaCreacion: new Date(),
        usuarioCreacion: 'admin',
        fechaModificacion: new Date(),
        usuarioModificacion: 'admin',
        version: 1,
        eliminado: false
      } as ConductorModel;
      
      observer.next(nuevoConductor);
      observer.complete();
    }).pipe(delay(800));
  }

  // Actualizar conductor
  updateConductor(id: string, conductor: Partial<ConductorModel>): Observable<ConductorModel> {
    return new Observable<ConductorModel>(observer => {
      const conductorActualizado: ConductorModel = {
        ...conductor,
        id,
        fechaModificacion: new Date(),
        usuarioModificacion: 'admin'
      } as ConductorModel;
      
      observer.next(conductorActualizado);
      observer.complete();
    }).pipe(delay(600));
  }

  // Eliminar conductor (soft delete)
  deleteConductor(request: DeleteConductorRequest): Observable<void> {
    return new Observable<void>(observer => {
      // Simular eliminación soft
      observer.next(undefined);
      observer.complete();
    }).pipe(delay(500));
  }

  // Restaurar conductor eliminado
  restoreConductor(request: RestoreConductorRequest): Observable<ConductorModel> {
    return new Observable<ConductorModel>(observer => {
      // Simular restauración
      this.getConductor(request.conductorId).subscribe({
        next: (conductor) => {
          observer.next(conductor);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    }).pipe(delay(500));
  }

  // Obtener conductores eliminados
  getConductoresEliminados(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ conductores: ConductorModel[], total: number, totalPaginas: number }> {
    return new Observable<{ conductores: ConductorModel[], total: number, totalPaginas: number }>(observer => {
      // Simular conductores eliminados
      observer.next({
        conductores: [],
        total: 0,
        totalPaginas: 0
      });
      observer.complete();
    }).pipe(delay(400));
  }

  // Eliminar permanentemente (solo para administradores)
  deleteConductorPermanente(id: string): Observable<void> {
    return new Observable<void>(observer => {
      // Simular eliminación permanente
      observer.next(undefined);
      observer.complete();
    }).pipe(delay(700));
  }

  // Obtener log de auditoría de conductor
  getAuditLogConductor(id: string): Observable<ConductorAuditLog[]> {
    return new Observable<ConductorAuditLog[]>(observer => {
      // Simular log de auditoría
      const auditLog: ConductorAuditLog[] = [
        {
          id: '1',
          conductorId: id,
          accion: 'CREAR',
          fecha: new Date(),
          usuario: 'admin',
          detalles: 'Conductor creado'
        }
      ];
      observer.next(auditLog);
      observer.complete();
    }).pipe(delay(300));
  }

  // Obtener estadísticas de conductores
  getEstadisticas(): Observable<any> {
    return new Observable<any>(observer => {
      // Simular estadísticas
      observer.next({
        totalConductores: 25,
        conductoresHabilitados: 20,
        conductoresInhabilitados: 5,
        licenciasVencidas: 3,
        licenciasPorVencer: 2
      });
      observer.complete();
    }).pipe(delay(400));
  }

  // Exportar conductores a Excel
  exportarConductores(filters?: any): Observable<Blob> {
    return new Observable<Blob>(observer => {
      // Simular exportación
      const csvContent = 'DNI,Nombres,Apellidos,Licencia,Estado\n12345678,Juan,Pérez,A1B2C3D4E,HABILITADO';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      observer.next(blob);
      observer.complete();
    }).pipe(delay(1000));
  }
}
