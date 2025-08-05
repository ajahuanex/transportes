import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  TUC as TUCModel,
  CreateTUCRequest,
  UpdateTUCRequest,
  DeleteTUCRequest,
  RestoreTUCRequest,
  EstadoTUC,
  TUCStats
} from '../models/tuc.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class TUCService {
  
  private mockDataService = inject(MockDataService);

  // Obtener lista de TUCs con filtros y paginación
  getTUCs(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ tucs: TUCModel[], total: number, totalPaginas: number }> {
    return this.mockDataService.getTUCs().pipe(
      delay(500),
      map(response => {
        // Aplicar filtros
        let filteredTUCs = response.tucs.filter((tuc: TUCModel) => !tuc.eliminado);
        
        if (filters) {
          if (filters.nroTuc) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.nroTuc.toLowerCase().includes(filters.nroTuc.toLowerCase())
            );
          }
          if (filters.vehiculo) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.vehiculoPlaca?.toLowerCase().includes(filters.vehiculo.toLowerCase()) ||
              t.vehiculoMarca?.toLowerCase().includes(filters.vehiculo.toLowerCase()) ||
              t.vehiculoModelo?.toLowerCase().includes(filters.vehiculo.toLowerCase())
            );
          }
          if (filters.empresa) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.empresaNombre?.toLowerCase().includes(filters.empresa.toLowerCase()) ||
              t.empresaId?.toLowerCase().includes(filters.empresa.toLowerCase())
            );
          }
          if (filters.estado) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => t.estado === filters.estado);
          }
          if (filters.fechaDesde) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              new Date(t.fechaEmision) >= new Date(filters.fechaDesde)
            );
          }
          if (filters.fechaHasta) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              new Date(t.fechaEmision) <= new Date(filters.fechaHasta)
            );
          }
        }

        // Calcular paginación
        const total = filteredTUCs.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTUCs = filteredTUCs.slice(startIndex, endIndex);
        const totalPaginas = Math.ceil(total / limit);

        return {
          tucs: paginatedTUCs,
          total,
          totalPaginas
        };
      })
    );
  }

  // Obtener TUC por ID
  getTUC(id: string): Observable<TUCModel> {
    return this.mockDataService.getTUCs().pipe(
      delay(300),
      map(response => {
        const tuc = response.tucs.find((t: TUCModel) => t.id === id);
        if (!tuc) {
          throw new Error('TUC no encontrado');
        }
        return tuc;
      })
    );
  }

  // Crear nuevo TUC
  createTUC(request: CreateTUCRequest): Observable<TUCModel> {
    return this.mockDataService.getTUCs().pipe(
      delay(800),
      map(() => {
        const newTUC: TUCModel = {
          id: `T${Date.now()}`,
          nroTuc: `T-${Date.now()}-2025`,
          vehiculoId: request.vehiculoId,
          vehiculoPlaca: 'V1B-123',
          vehiculoMarca: 'Toyota',
          vehiculoModelo: 'Hiace',
          empresaId: request.empresaId,
          empresaNombre: 'Empresa Ejemplo',
          resolucionPadreId: request.resolucionPadreId,
          resolucionNumero: 'R-1234-2025-DRTC-PUNO',
          fechaEmision: request.fechaEmision,
          fechaVencimiento: request.fechaVencimiento,
          estado: EstadoTUC.VIGENTE,
          estaActivo: true,
          eliminado: false,
          fechaCreacion: new Date(),
          usuarioCreacion: 'admin',
          fechaModificacion: new Date(),
          usuarioModificacion: 'admin',
          version: 1,
          qrVerificationUrl: `https://drtc-puno.gob.pe/verificar/tuc/${Date.now()}`,
          auditoria: {
            fechaCreacion: new Date(),
            usuarioCreacion: 'admin',
            fechaModificacion: new Date(),
            usuarioModificacion: 'admin',
            version: 1
          }
        } as TUCModel;

        return newTUC;
      })
    );
  }

  // Actualizar TUC
  updateTUC(id: string, request: UpdateTUCRequest): Observable<TUCModel> {
    return this.mockDataService.getTUCs().pipe(
      delay(600),
      map(response => {
        const existingTUC = response.tucs.find((t: TUCModel) => t.id === id);
        if (!existingTUC) {
          throw new Error('TUC no encontrado');
        }

        const updatedTUC: TUCModel = {
          ...existingTUC,
          ...request,
          fechaModificacion: new Date(),
          usuarioModificacion: 'admin',
          version: existingTUC.version + 1,
          auditoria: {
            ...existingTUC.auditoria,
            fechaModificacion: new Date(),
            usuarioModificacion: 'admin',
            version: existingTUC.auditoria.version + 1
          }
        };

        return updatedTUC;
      })
    );
  }

  // Eliminar TUC (soft delete)
  deleteTUC(request: DeleteTUCRequest): Observable<void> {
    return this.mockDataService.getTUCs().pipe(
      delay(400),
      map(() => {
        console.log('TUC eliminado:', request);
        return;
      })
    );
  }

  // Restaurar TUC eliminado
  restoreTUC(request: RestoreTUCRequest): Observable<TUCModel> {
    return this.mockDataService.getTUCs().pipe(
      delay(400),
      map(response => {
        const tuc = response.tucs.find((t: TUCModel) => t.id === request.tucId);
        if (!tuc) {
          throw new Error('TUC no encontrado');
        }

        const restoredTUC: TUCModel = {
          ...tuc,
          eliminado: false,
          fechaEliminacion: undefined,
          usuarioEliminacion: undefined,
          motivoEliminacion: undefined,
          fechaModificacion: new Date(),
          usuarioModificacion: request.usuarioRestauracion,
          version: tuc.version + 1,
          auditoria: {
            ...tuc.auditoria,
            fechaModificacion: new Date(),
            usuarioModificacion: request.usuarioRestauracion,
            version: tuc.auditoria.version + 1
          }
        };

        return restoredTUC;
      })
    );
  }

  // Obtener TUCs eliminados
  getTUCsEliminados(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ tucs: TUCModel[], total: number, totalPaginas: number }> {
    return this.mockDataService.getTUCs().pipe(
      delay(500),
      map(response => {
        // Filtrar solo eliminados
        let filteredTUCs = response.tucs.filter((tuc: TUCModel) => tuc.eliminado);
        
        if (filters) {
          if (filters.nroTuc) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.nroTuc.toLowerCase().includes(filters.nroTuc.toLowerCase())
            );
          }
          if (filters.vehiculo) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.vehiculoPlaca?.toLowerCase().includes(filters.vehiculo.toLowerCase()) ||
              t.vehiculoMarca?.toLowerCase().includes(filters.vehiculo.toLowerCase()) ||
              t.vehiculoModelo?.toLowerCase().includes(filters.vehiculo.toLowerCase())
            );
          }
          if (filters.empresa) {
            filteredTUCs = filteredTUCs.filter((t: TUCModel) => 
              t.empresaNombre?.toLowerCase().includes(filters.empresa.toLowerCase()) ||
              t.empresaId?.toLowerCase().includes(filters.empresa.toLowerCase())
            );
          }
        }

        // Calcular paginación
        const total = filteredTUCs.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTUCs = filteredTUCs.slice(startIndex, endIndex);
        const totalPaginas = Math.ceil(total / limit);

        return {
          tucs: paginatedTUCs,
          total,
          totalPaginas
        };
      })
    );
  }

  // Eliminar permanentemente (solo para administradores)
  deleteTUCPermanente(id: string): Observable<void> {
    return this.mockDataService.getTUCs().pipe(
      delay(400),
      map(() => {
        console.log('TUC eliminado permanentemente:', id);
        return;
      })
    );
  }

  // Obtener estadísticas de TUCs
  getEstadisticasTUCs(): Observable<TUCStats> {
    return this.mockDataService.getTUCs().pipe(
      delay(300),
      map(response => {
        const tucs = response.tucs.filter((t: TUCModel) => !t.eliminado);
        return {
          total: tucs.length,
          vigentes: tucs.filter(t => t.estado === EstadoTUC.VIGENTE).length,
          vencidos: tucs.filter(t => t.estado === EstadoTUC.VENCIDA).length,
          dadosDeBaja: tucs.filter(t => t.estado === EstadoTUC.DADA_DE_BAJA).length,
          desechados: tucs.filter(t => t.estado === EstadoTUC.DESECHADA).length,
          suspendidos: tucs.filter(t => t.estado === EstadoTUC.SUSPENDIDA).length
        };
      })
    );
  }

  // Exportar TUCs a Excel
  exportarTUCs(filters?: any): Observable<Blob> {
    return this.mockDataService.getTUCs().pipe(
      delay(1000),
      map(() => {
        const csvContent = 'Nro TUC,Vehículo,Empresa,Estado,Fecha Emisión,Fecha Vencimiento\nT-123456-2025,V1B-123,Empresa Ejemplo,VIGENTE,2025-01-15,2026-01-15';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        return blob;
      })
    );
  }

  // Verificar TUC por QR
  verificarTUC(qrCode: string): Observable<TUCModel> {
    return this.mockDataService.getTUCs().pipe(
      delay(200),
      map(response => {
        const tuc = response.tucs.find((t: TUCModel) => t.qrVerificationUrl?.includes(qrCode));
        if (!tuc) {
          throw new Error('TUC no encontrado');
        }
        return tuc;
      })
    );
  }
} 