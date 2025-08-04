import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  Expediente, 
  CreateExpedienteRequest, 
  UpdateExpedienteRequest, 
  ExpedienteFilter, 
  ExpedienteListResponse,
  DeleteExpedienteRequest,
  RestoreExpedienteRequest,
  ExpedienteAuditLog,
  ExpedienteStats,
  EstadoExpediente,
  TipoExpediente,
  TipoTramite
} from '../models/expediente.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  private mockDataService = inject(MockDataService);

  // Obtener lista de expedientes con filtros
  getExpedientes(filtros: ExpedienteFilter = {}, pagina: number = 1, porPagina: number = 10): Observable<ExpedienteListResponse> {
    return this.mockDataService.getExpedientes(filtros, pagina, porPagina);
  }

  // Obtener expediente por ID
  getExpediente(id: string): Observable<Expediente | null> {
    return this.mockDataService.getExpediente(id);
  }

  // Crear nuevo expediente
  createExpediente(expediente: CreateExpedienteRequest): Observable<Expediente> {
    return this.mockDataService.createExpediente(expediente);
  }

  // Actualizar expediente
  updateExpediente(id: string, expediente: UpdateExpedienteRequest): Observable<Expediente> {
    return this.mockDataService.updateExpediente(id, expediente);
  }

  // Eliminar expediente (soft delete)
  deleteExpediente(request: DeleteExpedienteRequest): Observable<void> {
    return this.mockDataService.deleteExpediente(request);
  }

  // Restaurar expediente eliminado
  restoreExpediente(request: RestoreExpedienteRequest): Observable<Expediente> {
    return this.mockDataService.restoreExpediente(request);
  }

  // Obtener expedientes eliminados
  getExpedientesEliminados(filtros: ExpedienteFilter = {}): Observable<Expediente[]> {
    return this.mockDataService.getExpedientesEliminados(filtros);
  }

  // Eliminar expediente permanentemente
  deleteExpedientePermanente(id: string): Observable<void> {
    return this.mockDataService.deleteExpedientePermanente(id);
  }

  // Obtener log de auditoría
  getAuditLogExpediente(id: string): Observable<ExpedienteAuditLog[]> {
    return this.mockDataService.getAuditLogExpediente(id);
  }

  // Obtener estadísticas
  getExpedienteStats(): Observable<ExpedienteStats> {
    return this.mockDataService.getExpedienteStats();
  }

  // Cambiar estado del expediente
  cambiarEstadoExpediente(id: string, nuevoEstado: string, observaciones?: string): Observable<Expediente> {
    return this.mockDataService.cambiarEstadoExpediente(id, nuevoEstado, observaciones);
  }

  // Añadir seguimiento al expediente
  agregarSeguimiento(id: string, seguimiento: {
    accion: string;
    descripcion: string;
    observaciones?: string;
  }): Observable<Expediente> {
    return this.mockDataService.agregarSeguimientoExpediente(id, seguimiento);
  }

  // Asignar responsable
  asignarResponsable(id: string, responsable: string): Observable<Expediente> {
    return this.mockDataService.asignarResponsableExpediente(id, responsable);
  }

  // Obtener expedientes por solicitante
  getExpedientesPorSolicitante(solicitanteId: string): Observable<Expediente[]> {
    return this.mockDataService.getExpedientesPorSolicitante(solicitanteId);
  }

  // Obtener expedientes relacionados
  getExpedientesRelacionados(id: string): Observable<Expediente[]> {
    return this.mockDataService.getExpedientesRelacionados(id);
  }

  // Generar número de expediente automático
  generarNumeroExpediente(): Observable<string> {
    return this.mockDataService.generarNumeroExpediente();
  }

  // Validar número de expediente
  validarNumeroExpediente(numero: string): Observable<boolean> {
    return this.mockDataService.validarNumeroExpediente(numero);
  }

  // Obtener expedientes vencidos
  getExpedientesVencidos(): Observable<Expediente[]> {
    return this.mockDataService.getExpedientesVencidos();
  }

  // Obtener expedientes urgentes
  getExpedientesUrgentes(): Observable<Expediente[]> {
    return this.mockDataService.getExpedientesUrgentes();
  }

  // Buscar expedientes por texto
  buscarExpedientes(texto: string): Observable<Expediente[]> {
    return this.mockDataService.buscarExpedientes(texto);
  }

  // Exportar expedientes
  exportarExpedientes(filtros: ExpedienteFilter, formato: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    return this.mockDataService.exportarExpedientes(filtros, formato);
  }
} 