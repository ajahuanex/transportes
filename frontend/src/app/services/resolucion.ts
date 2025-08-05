import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Resolucion, ResolucionListResponse, CreateResolucionRequest, UpdateResolucionRequest, ResolucionFilter, DeleteResolucionRequest, RestoreResolucionRequest, ResolucionAuditLog } from '../models/resolucion.model';
import { MockDataService } from './mock-data.service';
import { TipoTramite } from '../models/resolucion.model';

@Injectable({
  providedIn: 'root'
})
export class ResolucionService {
  private mockDataService = inject(MockDataService);

  getResoluciones(pagina: number, porPagina: number, filtros: ResolucionFilter): Observable<ResolucionListResponse> {
    return new Observable<ResolucionListResponse>(observer => {
      this.mockDataService.getResoluciones().subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    }).pipe(delay(300));
  }

  getResolucion(id: string): Observable<Resolucion> {
    return new Observable<Resolucion>(observer => {
      this.mockDataService.getResoluciones().subscribe({
        next: (response) => {
          const found = response.resoluciones.find(r => r.id === id);
          if (found) {
            observer.next(found);
          } else {
            observer.error('Resolución no encontrada');
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    }).pipe(delay(300));
  }

  createResolucion(resolucion: CreateResolucionRequest): Observable<Resolucion> {
    return new Observable<Resolucion>(observer => {
      const nuevaResolucion: Resolucion = {
        id: Date.now().toString(),
        ...resolucion,
        eliminado: false,
        fechaCreacion: new Date(),
        usuarioCreacion: 'admin',
        fechaModificacion: new Date(),
        usuarioModificacion: 'admin',
        version: 1,
        estaActivo: true
      } as Resolucion;
      observer.next(nuevaResolucion);
      observer.complete();
    }).pipe(delay(800));
  }

  updateResolucion(id: string, resolucion: UpdateResolucionRequest): Observable<Resolucion> {
    return new Observable<Resolucion>(observer => {
      const resolucionActualizada: Resolucion = {
        id,
        ...resolucion,
        eliminado: false,
        fechaCreacion: new Date(),
        usuarioCreacion: 'admin',
        fechaModificacion: new Date(),
        usuarioModificacion: 'admin',
        version: 2,
        estaActivo: true
      } as Resolucion;
      observer.next(resolucionActualizada);
      observer.complete();
    }).pipe(delay(500));
  }

  deleteResolucion(request: DeleteResolucionRequest): Observable<void> {
    return new Observable<void>(observer => {
      observer.next(undefined);
      observer.complete();
    }).pipe(delay(500));
  }

  restoreResolucion(request: RestoreResolucionRequest): Observable<Resolucion> {
    return new Observable<Resolucion>(observer => {
      const resolucionRestaurada: Resolucion = {
        id: request.resolucionId,
        nroResolucion: 'R-1234-2025-DRTC-PUNO',
        empresaId: '1',
        fechaEmision: new Date(),
        fechaVigenciaInicio: new Date(),
        fechaVigenciaFin: new Date(),
        tipoResolucion: 'PADRE',
        tipoTramite: TipoTramite.HABILITACION_VEHICULAR,
        descripcion: 'Resolución restaurada',
        expedienteId: '1',
        estaActivo: true,
        eliminado: false,
        fechaCreacion: new Date(),
        usuarioCreacion: 'admin',
        fechaModificacion: new Date(),
        usuarioModificacion: 'admin',
        version: 3
      } as Resolucion;
      observer.next(resolucionRestaurada);
      observer.complete();
    }).pipe(delay(500));
  }

  getResolucionesEliminadas(pagina: number, porPagina: number, filtros: ResolucionFilter): Observable<ResolucionListResponse> {
    return new Observable<ResolucionListResponse>(observer => {
      this.mockDataService.getResolucionesEliminadas().subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    }).pipe(delay(300));
  }

  deleteResolucionPermanente(id: string): Observable<void> {
    return new Observable<void>(observer => {
      observer.next(undefined);
      observer.complete();
    }).pipe(delay(500));
  }

  getAuditLogResolucion(id: string): Observable<ResolucionAuditLog[]> {
    return new Observable<ResolucionAuditLog[]>(observer => {
      const auditLog: ResolucionAuditLog[] = [
        {
          id: '1',
          resolucionId: id,
          accion: 'CREAR',
          detalles: 'Resolución creada',
          fecha: new Date(),
          usuario: 'admin'
        }
      ];
      observer.next(auditLog);
      observer.complete();
    }).pipe(delay(300));
  }

  getEstadisticas(): Observable<any> {
    return new Observable<any>(observer => {
      const estadisticas = {
        totalResoluciones: 150,
        resolucionesActivas: 120,
        resolucionesVigentes: 100,
        resolucionesVencidas: 20,
        distribucionPorTipo: [
          { tipo: 'HABILITACION_VEHICULAR', cantidad: 80, porcentaje: 53.3 },
          { tipo: 'INCREMENTO', cantidad: 40, porcentaje: 26.7 },
          { tipo: 'SUSTITUCION', cantidad: 30, porcentaje: 20.0 }
        ]
      };
      observer.next(estadisticas);
      observer.complete();
    }).pipe(delay(300));
  }

  exportarResoluciones(filtros: ResolucionFilter): Observable<Blob> {
    return new Observable<Blob>(observer => {
      const csvContent = 'ID,Numero,Empresa,Tipo,FechaEmision,Estado\n';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      observer.next(blob);
      observer.complete();
    }).pipe(delay(500));
  }
} 