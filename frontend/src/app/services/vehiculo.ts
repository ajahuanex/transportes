import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
    return this.mockDataService.getVehiculos().pipe(
      delay(500), // Simular delay de red
      map(response => {
        // Aplicar filtros
        let filteredVehiculos = response.vehiculos.filter((vehiculo: VehiculoModel) => !vehiculo.eliminado);
        
        if (filters) {
          if (filters.placa) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.placa.toLowerCase().includes(filters.placa.toLowerCase())
            );
          }
          if (filters.marca) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.marca.toLowerCase().includes(filters.marca.toLowerCase())
            );
          }
          if (filters.modelo) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.modelo?.toLowerCase().includes(filters.modelo.toLowerCase())
            );
          }
          if (filters.empresa) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.empresaNombre?.toLowerCase().includes(filters.empresa.toLowerCase()) ||
              v.empresaId?.toLowerCase().includes(filters.empresa.toLowerCase())
            );
          }
          if (filters.tipo) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => v.tipo === filters.tipo);
          }
          if (filters.estado) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => v.estado === filters.estado);
          }
        }

        // Calcular paginación
        const total = filteredVehiculos.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVehiculos = filteredVehiculos.slice(startIndex, endIndex);
        const totalPaginas = Math.ceil(total / limit);

        return {
          vehiculos: paginatedVehiculos,
          total,
          totalPaginas
        };
      })
    );
  }

  // Obtener vehículo por ID
  getVehiculo(id: string): Observable<VehiculoModel> {
    return this.mockDataService.getVehiculos().pipe(
      delay(300),
      map(response => {
        const vehiculo = response.vehiculos.find((v: VehiculoModel) => v.id === id);
        if (!vehiculo) {
          throw new Error('Vehículo no encontrado');
        }
        return vehiculo;
      })
    );
  }

  // Crear nuevo vehículo
  createVehiculo(vehiculo: Partial<VehiculoModel>): Observable<VehiculoModel> {
    return this.mockDataService.getVehiculos().pipe(
      delay(800),
      map(() => {
        // Validaciones básicas
        if (!vehiculo.placa || !vehiculo.marca || !vehiculo.modelo) {
          throw new Error('Datos requeridos incompletos');
        }

        // Verificar si la placa ya existe
        const placaExistente = this.mockDataService.getVehiculos().pipe(
          map(response => response.vehiculos.find((v: VehiculoModel) => 
            v.placa.toLowerCase() === vehiculo.placa?.toLowerCase() && !v.eliminado
          ))
        );

        const newVehiculo: VehiculoModel = {
          id: `V${Date.now()}`,
          placa: vehiculo.placa || '',
          marca: vehiculo.marca || '',
          modelo: vehiculo.modelo || '',
          anioFabricacion: vehiculo.anioFabricacion || 2020,
          color: vehiculo.color || '',
          categoria: vehiculo.categoria || 'M2',
          tipo: vehiculo.tipo || 'BUS',
          empresaId: vehiculo.empresaId || '',
          empresaActualId: vehiculo.empresaId || '',
          empresaNombre: vehiculo.empresaNombre || '',
          estado: vehiculo.estado || 'ACTIVO',
          estaActivo: true,
          eliminado: false,
          fechaCreacion: new Date(),
          usuarioCreacion: 'admin',
          fechaModificacion: new Date(),
          usuarioModificacion: 'admin',
          version: 1,
          tuc: {
            nroTuc: `T-${Math.floor(Math.random() * 999999)}-${new Date().getFullYear()}`,
            fechaEmision: new Date()
          },
          datosTecnicos: {
            motor: 'Gasolina',
            chasis: `CH${Math.floor(Math.random() * 999999999)}`,
            ejes: 2,
            asientos: 20,
            pesoNeto: 5000,
            pesoBruto: 8000,
            medidas: { largo: 8, ancho: 2.5, alto: 3 }
          }
        } as VehiculoModel;

        // Simular guardado
        return newVehiculo;
      })
    );
  }

  // Actualizar vehículo
  updateVehiculo(id: string, vehiculo: Partial<VehiculoModel>): Observable<VehiculoModel> {
    return this.mockDataService.getVehiculos().pipe(
      delay(600),
      map(response => {
        const existingVehiculo = response.vehiculos.find((v: VehiculoModel) => v.id === id);
        if (!existingVehiculo) {
          throw new Error('Vehículo no encontrado');
        }

        // Validaciones básicas
        if (!vehiculo.placa || !vehiculo.marca || !vehiculo.modelo) {
          throw new Error('Datos requeridos incompletos');
        }

        // Verificar si la placa ya existe en otro vehículo
        const placaExistente = response.vehiculos.find((v: VehiculoModel) => 
          v.id !== id && 
          v.placa.toLowerCase() === vehiculo.placa?.toLowerCase() && 
          !v.eliminado
        );

        if (placaExistente) {
          throw new Error('La placa ya está registrada en otro vehículo');
        }

        const updatedVehiculo: VehiculoModel = {
          ...existingVehiculo,
          ...vehiculo,
          fechaModificacion: new Date(),
          usuarioModificacion: 'admin',
          version: existingVehiculo.version + 1
        };

        return updatedVehiculo;
      })
    );
  }

  // Eliminar vehículo (soft delete)
  deleteVehiculo(request: DeleteVehiculoRequest): Observable<void> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(() => {
        // Simular eliminación soft
        console.log('Vehículo eliminado:', request);
        return;
      })
    );
  }

  // Restaurar vehículo eliminado
  restoreVehiculo(request: RestoreVehiculoRequest): Observable<VehiculoModel> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(response => {
        const vehiculo = response.vehiculos.find((v: VehiculoModel) => v.id === request.vehiculoId);
        if (!vehiculo) {
          throw new Error('Vehículo no encontrado');
        }

        const restoredVehiculo: VehiculoModel = {
          ...vehiculo,
          eliminado: false,
          fechaEliminacion: undefined,
          usuarioEliminacion: undefined,
          motivoEliminacion: undefined,
          fechaModificacion: new Date(),
          usuarioModificacion: 'admin',
          version: vehiculo.version + 1
        };

        return restoredVehiculo;
      })
    );
  }

  // Obtener vehículos eliminados
  getVehiculosEliminados(
    page: number = 1, 
    limit: number = 10, 
    filters?: any
  ): Observable<{ vehiculos: VehiculoModel[], total: number, totalPaginas: number }> {
    return this.mockDataService.getVehiculos().pipe(
      delay(500),
      map(response => {
        // Filtrar solo eliminados
        let filteredVehiculos = response.vehiculos.filter((vehiculo: VehiculoModel) => vehiculo.eliminado);
        
        if (filters) {
          if (filters.placa) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.placa.toLowerCase().includes(filters.placa.toLowerCase())
            );
          }
          if (filters.marca) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.marca.toLowerCase().includes(filters.marca.toLowerCase())
            );
          }
          if (filters.modelo) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.modelo?.toLowerCase().includes(filters.modelo.toLowerCase())
            );
          }
          if (filters.empresa) {
            filteredVehiculos = filteredVehiculos.filter((v: VehiculoModel) => 
              v.empresaNombre?.toLowerCase().includes(filters.empresa.toLowerCase()) ||
              v.empresaId?.toLowerCase().includes(filters.empresa.toLowerCase())
            );
          }
        }

        // Calcular paginación
        const total = filteredVehiculos.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVehiculos = filteredVehiculos.slice(startIndex, endIndex);
        const totalPaginas = Math.ceil(total / limit);

        return {
          vehiculos: paginatedVehiculos,
          total,
          totalPaginas
        };
      })
    );
  }

  // Eliminar permanentemente (solo para administradores)
  deleteVehiculoPermanente(id: string): Observable<void> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(() => {
        // Simular eliminación permanente
        console.log('Vehículo eliminado permanentemente:', id);
        return;
      })
    );
  }

  // Obtener log de auditoría de vehículo
  getAuditLogVehiculo(id: string): Observable<VehiculoAuditLog[]> {
    return this.mockDataService.getVehiculos().pipe(
      delay(300),
      map(() => {
        // Simular log de auditoría
        return [
          {
            id: '1',
            vehiculoId: id,
            fecha: new Date(),
            accion: 'CREAR',
            usuario: 'admin',
            detalles: 'Vehículo creado',
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0'
          }
        ];
      })
    );
  }

  // Obtener estadísticas de vehículos
  getEstadisticas(): Observable<any> {
    return this.mockDataService.getEstadisticas();
  }

  // Exportar vehículos a Excel
  exportarVehiculos(filters?: any): Observable<Blob> {
    return this.mockDataService.getVehiculos().pipe(
      delay(1000),
      map(() => {
        // Simular archivo Excel
        const csvContent = 'Placa,Marca,Modelo,Año,Tipo,Estado\nV1B-123,Toyota,Hiace,2020,BUS,ACTIVO';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        return blob;
      })
    );
  }

  // Verificar disponibilidad de placa
  verificarDisponibilidadPlaca(placa: string, excludeId?: string): Observable<boolean> {
    return this.mockDataService.getVehiculos().pipe(
      delay(300),
      map(response => {
        const vehiculoExistente = response.vehiculos.find((v: VehiculoModel) => 
          v.placa.toLowerCase() === placa.toLowerCase() && 
          v.id !== excludeId && 
          !v.eliminado
        );
        return !vehiculoExistente;
      })
    );
  }

  // Obtener vehículos por empresa
  getVehiculosPorEmpresa(empresaId: string): Observable<VehiculoModel[]> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(response => {
        return response.vehiculos.filter((v: VehiculoModel) => 
          (v.empresaId === empresaId || v.empresaActualId === empresaId) && 
          !v.eliminado
        );
      })
    );
  }

  // Obtener vehículos por tipo
  getVehiculosPorTipo(tipo: string): Observable<VehiculoModel[]> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(response => {
        return response.vehiculos.filter((v: VehiculoModel) => 
          v.tipo === tipo && !v.eliminado
        );
      })
    );
  }

  // Obtener vehículos por estado
  getVehiculosPorEstado(estado: string): Observable<VehiculoModel[]> {
    return this.mockDataService.getVehiculos().pipe(
      delay(400),
      map(response => {
        return response.vehiculos.filter((v: VehiculoModel) => 
          v.estado === estado && !v.eliminado
        );
      })
    );
  }

  // Buscar vehículos por texto
  buscarVehiculos(texto: string): Observable<VehiculoModel[]> {
    return this.mockDataService.getVehiculos().pipe(
      delay(300),
      map(response => {
        const textoLower = texto.toLowerCase();
        return response.vehiculos.filter((v: VehiculoModel) => 
          !v.eliminado && (
            v.placa.toLowerCase().includes(textoLower) ||
            v.marca.toLowerCase().includes(textoLower) ||
            v.modelo?.toLowerCase().includes(textoLower) ||
            v.empresaNombre?.toLowerCase().includes(textoLower)
          )
        );
      })
    );
  }

  // Obtener estadísticas avanzadas
  getEstadisticasAvanzadas(): Observable<any> {
    return this.mockDataService.getVehiculos().pipe(
      delay(500),
      map(response => {
        const vehiculos = response.vehiculos.filter((v: VehiculoModel) => !v.eliminado);
        
        const estadisticas = {
          total: vehiculos.length,
          porTipo: {} as any,
          porEstado: {} as any,
          porEmpresa: {} as any,
          porAnio: {} as any,
          promedioEdad: 0
        };

        // Calcular estadísticas por tipo
        vehiculos.forEach(v => {
          const tipo = v.tipo || 'OTRO';
          const estado = v.estado || 'ACTIVO';
          const empresa = v.empresaNombre || 'Sin empresa';
          const anio = v.anioFabricacion || 2020;
          
          estadisticas.porTipo[tipo] = (estadisticas.porTipo[tipo] || 0) + 1;
          estadisticas.porEstado[estado] = (estadisticas.porEstado[estado] || 0) + 1;
          estadisticas.porEmpresa[empresa] = (estadisticas.porEmpresa[empresa] || 0) + 1;
          estadisticas.porAnio[anio] = (estadisticas.porAnio[anio] || 0) + 1;
        });

        // Calcular promedio de edad
        const anioActual = new Date().getFullYear();
        const edades = vehiculos.map(v => anioActual - v.anioFabricacion);
        estadisticas.promedioEdad = edades.length > 0 ? edades.reduce((a, b) => a + b, 0) / edades.length : 0;

        return estadisticas;
      })
    );
  }
}
