import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  Vehiculo as VehiculoModel,
  DeleteVehiculoRequest,
  RestoreVehiculoRequest,
  VehiculoAuditLog
} from '../models/vehiculo.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  
  private mockDataService = inject(MockDataService);

  // Obtener lista de vehículos con filtros y paginación
  getVehiculos(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ vehiculos: VehiculoModel[], total: number, totalPaginas: number }> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({
        vehiculos: [],
        total: 0,
        totalPaginas: 0
      });
      observer.complete();
    });
  }

  // Obtener vehículo por ID
  getVehiculo(id: string): Observable<VehiculoModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as VehiculoModel);
      observer.complete();
    });
  }

  // Crear nuevo vehículo
  createVehiculo(vehiculo: Partial<VehiculoModel>): Observable<VehiculoModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as VehiculoModel);
      observer.complete();
    });
  }

  // Actualizar vehículo
  updateVehiculo(id: string, vehiculo: Partial<VehiculoModel>): Observable<VehiculoModel> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({} as VehiculoModel);
      observer.complete();
    });
  }

  // Eliminar vehículo (soft delete)
  deleteVehiculo(request: DeleteVehiculoRequest): Observable<void> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Restaurar vehículo eliminado
  restoreVehiculo(request: RestoreVehiculoRequest): Observable<VehiculoModel> {
    // TODO: Implementar cuando se conecte con backend real
    return this.getVehiculo(request.vehiculoId);
  }

  // Obtener vehículos eliminados
  getVehiculosEliminados(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ vehiculos: VehiculoModel[], total: number, totalPaginas: number }> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next({
        vehiculos: [],
        total: 0,
        totalPaginas: 0
      });
      observer.complete();
    });
  }

  // Eliminar permanentemente (solo para administradores)
  deleteVehiculoPermanente(id: string): Observable<void> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Obtener log de auditoría de vehículo
  getAuditLogVehiculo(id: string): Observable<VehiculoAuditLog[]> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  // Obtener estadísticas de vehículos
  getEstadisticas(): Observable<any> {
    return this.mockDataService.getEstadisticas();
  }

  // Exportar vehículos a Excel
  exportarVehiculos(filters?: any): Observable<Blob> {
    // TODO: Implementar cuando se conecte con backend real
    return new Observable(observer => {
      const blob = new Blob(['Datos de vehículos'], { type: 'application/vnd.ms-excel' });
      observer.next(blob);
      observer.complete();
    });
  }
}
