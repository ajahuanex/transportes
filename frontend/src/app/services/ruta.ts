import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, switchMap, map } from 'rxjs';
import { 
  Ruta, 
  RutaListResponse, 
  CreateRutaRequest,
  UpdateRutaRequest,
  RutaFilter,
  DeleteRutaRequest,
  RestoreRutaRequest,
  RutaAuditLog,
  RutaStats,
  TipoRuta,
  CategoriaRuta
} from '../models/ruta.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  
  private mockDataService = inject(MockDataService);

  // Obtener lista de rutas con filtros y paginación
  getRutas(filtros: RutaFilter = {}, pagina: number = 1, porPagina: number = 10): Observable<RutaListResponse> {
    return this.mockDataService.getRutas(filtros, pagina, porPagina);
  }

  // Obtener una ruta por ID
  getRuta(id: string): Observable<Ruta | null> {
    return this.mockDataService.getRuta(id);
  }

  // Crear nueva ruta
  createRuta(ruta: CreateRutaRequest): Observable<Ruta> {
    return this.mockDataService.createRuta(ruta);
  }

  // Actualizar ruta existente
  updateRuta(id: string, ruta: UpdateRutaRequest): Observable<Ruta> {
    return this.mockDataService.updateRuta(id, ruta);
  }

  // Eliminar ruta (soft delete)
  deleteRuta(request: DeleteRutaRequest): Observable<void> {
    return this.mockDataService.deleteRuta(request);
  }

  // Restaurar ruta eliminada
  restoreRuta(request: RestoreRutaRequest): Observable<Ruta> {
    return this.mockDataService.restoreRuta(request);
  }

  // Obtener rutas eliminadas
  getRutasEliminadas(filtros: RutaFilter = {}): Observable<Ruta[]> {
    return this.mockDataService.getRutasEliminadas(filtros);
  }

  // Eliminar ruta permanentemente
  deleteRutaPermanente(id: string): Observable<void> {
    return this.mockDataService.deleteRutaPermanente(id);
  }

  // Obtener historial de auditoría de una ruta
  getAuditLogRuta(id: string): Observable<RutaAuditLog[]> {
    return this.mockDataService.getAuditLogRuta(id);
  }

  // Obtener estadísticas de rutas
  getRutaStats(): Observable<RutaStats> {
    return this.mockDataService.getRutaStats();
  }

  // Cambiar estado de una ruta
  cambiarEstadoRuta(id: string, nuevoEstado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA', observaciones?: string): Observable<Ruta> {
    return this.mockDataService.cambiarEstadoRuta(id, nuevoEstado, observaciones);
  }

  // Asignar empresa operadora a una ruta
  asignarEmpresaOperadora(id: string, empresaId: string): Observable<Ruta> {
    return this.mockDataService.asignarEmpresaRuta(id, empresaId);
  }

  // Desasignar empresa operadora de una ruta
  desasignarEmpresaOperadora(id: string, empresaId: string): Observable<Ruta> {
    return this.mockDataService.removerEmpresaRuta(id, empresaId);
  }

  // Asignar vehículo a una ruta
  asignarVehiculo(id: string, vehiculoId: string): Observable<Ruta> {
    return this.mockDataService.asignarVehiculoRuta(id, vehiculoId);
  }

  // Desasignar vehículo de una ruta
  desasignarVehiculo(id: string, vehiculoId: string): Observable<Ruta> {
    return this.mockDataService.removerVehiculoRuta(id, vehiculoId);
  }

  // Agregar horario a una ruta
  agregarHorario(id: string, horario: {
    dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
    horaSalida: string;
    horaLlegada: string;
    frecuencia?: number;
    tipoServicio: 'REGULAR' | 'EXPRESS' | 'NOCTURNO';
  }): Observable<Ruta> {
    // Convertir el horario al formato esperado por el mock service
    const horarioFormateado = {
      dia: horario.dia,
      horaSalida: horario.horaSalida,
      horaLlegada: horario.horaLlegada,
      frecuencia: horario.frecuencia?.toString() || '60'
    };
    return this.mockDataService.agregarHorarioRuta(id, horarioFormateado);
  }

  // Actualizar horario de una ruta
  actualizarHorario(id: string, horarioId: string, horario: {
    dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
    horaSalida: string;
    horaLlegada: string;
    frecuencia?: number;
    tipoServicio: 'REGULAR' | 'EXPRESS' | 'NOCTURNO';
    activo: boolean;
  }): Observable<Ruta> {
    // Por ahora, simulamos la actualización
    return this.mockDataService.getRuta(id).pipe(
      switchMap(ruta => {
        if (!ruta) throw new Error('Ruta no encontrada');
        return of(ruta);
      })
    );
  }

  // Eliminar horario de una ruta
  eliminarHorario(id: string, horarioId: string): Observable<Ruta> {
    // Por ahora, simulamos la eliminación
    return this.mockDataService.getRuta(id).pipe(
      switchMap(ruta => {
        if (!ruta) throw new Error('Ruta no encontrada');
        return of(ruta);
      })
    );
  }

  // Agregar tarifa a una ruta
  agregarTarifa(id: string, tarifa: {
    tipoPasajero: 'ADULTO' | 'NINO' | 'ESTUDIANTE' | 'ADULTO_MAYOR' | 'DISCAPACITADO';
    precio: number;
    moneda: string;
    vigenteDesde: Date;
    vigenteHasta?: Date;
  }): Observable<Ruta> {
    // Convertir la tarifa al formato esperado por el mock service
    const tarifaFormateada = {
      tipoPasajero: tarifa.tipoPasajero,
      precio: tarifa.precio,
      descripcion: `Tarifa para ${tarifa.tipoPasajero}`
    };
    return this.mockDataService.agregarTarifaRuta(id, tarifaFormateada);
  }

  // Actualizar tarifa de una ruta
  actualizarTarifa(id: string, tarifaId: string, tarifa: {
    tipoPasajero: 'ADULTO' | 'NINO' | 'ESTUDIANTE' | 'ADULTO_MAYOR' | 'DISCAPACITADO';
    precio: number;
    moneda: string;
    vigenteDesde: Date;
    vigenteHasta?: Date;
    activo: boolean;
  }): Observable<Ruta> {
    // Por ahora, simulamos la actualización
    return this.mockDataService.getRuta(id).pipe(
      switchMap(ruta => {
        if (!ruta) throw new Error('Ruta no encontrada');
        return of(ruta);
      })
    );
  }

  // Eliminar tarifa de una ruta
  eliminarTarifa(id: string, tarifaId: string): Observable<Ruta> {
    // Por ahora, simulamos la eliminación
    return this.mockDataService.getRuta(id).pipe(
      switchMap(ruta => {
        if (!ruta) throw new Error('Ruta no encontrada');
        return of(ruta);
      })
    );
  }

  // Obtener rutas por empresa
  getRutasPorEmpresa(empresaId: string): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => 
        r.empresasOperadoras?.includes(empresaId)
      ))
    );
  }

  // Obtener rutas por vehículo
  getRutasPorVehiculo(vehiculoId: string): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => 
        r.vehiculosAsignados?.includes(vehiculoId)
      ))
    );
  }

  // Generar código de ruta
  generarCodigoRuta(): Observable<string> {
    return this.mockDataService.generarCodigoRuta();
  }

  // Validar código de ruta
  validarCodigoRuta(codigo: string): Observable<boolean> {
    return this.mockDataService.validarCodigoRuta(codigo);
  }

  // Obtener rutas por origen
  getRutasPorOrigen(origen: string): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => 
        r.origen.toLowerCase().includes(origen.toLowerCase())
      ))
    );
  }

  // Obtener rutas por destino
  getRutasPorDestino(destino: string): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => 
        r.destino.toLowerCase().includes(destino.toLowerCase())
      ))
    );
  }

  // Obtener rutas por tipo
  getRutasPorTipo(tipo: TipoRuta): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => r.tipoRuta === tipo))
    );
  }

  // Obtener rutas por categoría
  getRutasPorCategoria(categoria: CategoriaRuta): Observable<Ruta[]> {
    // Por ahora, simulamos la búsqueda
    return this.mockDataService.getRutas().pipe(
      map(response => response.rutas.filter(r => r.categoria === categoria))
    );
  }

  // Buscar rutas por texto
  buscarRutas(texto: string): Observable<Ruta[]> {
    return this.mockDataService.buscarRutas(texto);
  }

  // Exportar rutas
  exportarRutas(filtros: RutaFilter, formato: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    return this.mockDataService.exportarRutas(filtros, formato);
  }
} 