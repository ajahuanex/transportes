import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  ConfiguracionSistema, 
  ConfiguracionItem,
  ModuloSistema,
  TipoConfiguracion,
  CreateConfiguracionRequest,
  UpdateConfiguracionRequest,
  ConfiguracionFilter,
  ConfiguracionResponse,
  ConfiguracionesResponse,
  EstadoEmpresa,
  EstadoVehiculo,
  EstadoConductor,
  EstadoTUC,
  EstadoExpediente,
  TipoResolucion,
  TipoTramite,
  CategoriaVehiculo,
  TipoVehiculo,
  ClasificacionEmpresa,
  TipoDocumento,
  TipoLicencia,
  ConfiguracionHelper
} from '../models/configuracion.model';
import { BaseEntity } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor() { }

  /**
   * Obtener configuraciones con filtros
   */
  getConfiguraciones(
    pagina: number = 1, 
    porPagina: number = 10, 
    filtros: ConfiguracionFilter = {}
  ): Observable<ConfiguracionesResponse> {
    return new Observable<ConfiguracionesResponse>(observer => {
      // Simular delay de red
      setTimeout(() => {
        const configuraciones = this.getMockConfiguraciones();
        let filtered = configuraciones;

        // Aplicar filtros
        if (filtros.modulo) {
          filtered = filtered.filter(c => c.modulo === filtros.modulo);
        }
        if (filtros.tipo) {
          filtered = filtered.filter(c => c.tipo === filtros.tipo);
        }
        if (filtros.activo !== undefined) {
          filtered = filtered.filter(c => c.activo === filtros.activo);
        }
        if (filtros.nombre) {
          filtered = filtered.filter(c => 
            c.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
          );
        }

        // Paginación
        const start = (pagina - 1) * porPagina;
        const end = start + porPagina;
        const paginated = filtered.slice(start, end);

        observer.next({
          configuraciones: paginated,
          total: filtered.length,
          pagina,
          porPagina
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * Obtener configuración por ID
   */
  getConfiguracion(id: string): Observable<ConfiguracionSistema> {
    return new Observable<ConfiguracionSistema>(observer => {
      setTimeout(() => {
        const configuraciones = this.getMockConfiguraciones();
        const configuracion = configuraciones.find(c => c.id === id);
        
        if (configuracion) {
          observer.next(configuracion);
        } else {
          observer.error(new Error('Configuración no encontrada'));
        }
        observer.complete();
      }, 200);
    });
  }

  /**
   * Crear nueva configuración
   */
  createConfiguracion(request: CreateConfiguracionRequest): Observable<ConfiguracionSistema> {
    return new Observable<ConfiguracionSistema>(observer => {
      setTimeout(() => {
        const nuevaConfiguracion: ConfiguracionSistema = {
          id: Date.now().toString(),
          modulo: request.modulo,
          tipo: request.tipo,
          nombre: request.nombre,
          descripcion: request.descripcion,
          items: request.items.map((item, index) => ({
            ...item,
            activo: true,
            orden: index + 1
          })),
          activo: true,
          editable: request.editable ?? true
        };

        observer.next(nuevaConfiguracion);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Actualizar configuración
   */
  updateConfiguracion(id: string, request: UpdateConfiguracionRequest): Observable<ConfiguracionSistema> {
    return new Observable<ConfiguracionSistema>(observer => {
      setTimeout(() => {
               const configuraciones = this.getMockConfiguraciones();
       const configuracion = configuraciones.find(c => c.id === id);
        
       if (configuracion) {
         const actualizada: ConfiguracionSistema = {
           ...configuracion,
           ...request,
           updatedAt: new Date(),
           updatedBy: 'admin'
         };
         observer.next(actualizada);
       } else {
         observer.error(new Error('Configuración no encontrada'));
       }
        observer.complete();
      }, 500);
    });
  }

  /**
   * Eliminar configuración (soft delete)
   */
  deleteConfiguracion(id: string): Observable<void> {
    return new Observable<void>(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 300);
    });
  }

  /**
   * Restaurar configuración eliminada
   */
  restoreConfiguracion(id: string): Observable<ConfiguracionSistema> {
    return new Observable<ConfiguracionSistema>(observer => {
      setTimeout(() => {
                 const configuraciones = this.getMockConfiguraciones();
         const configuracion = configuraciones.find(c => c.id === id);
        
         if (configuracion) {
           const restaurada: ConfiguracionSistema = {
             ...configuracion,
             activo: true,
             updatedAt: new Date(),
             updatedBy: 'admin'
           };
           observer.next(restaurada);
         } else {
           observer.error(new Error('Configuración no encontrada'));
         }
        observer.complete();
      }, 300);
    });
  }

  /**
   * Obtener configuraciones por módulo
   */
  getConfiguracionesByModulo(modulo: ModuloSistema): Observable<ConfiguracionSistema[]> {
    return new Observable<ConfiguracionSistema[]>(observer => {
      setTimeout(() => {
        const configuraciones = this.getMockConfiguraciones();
        const filtered = configuraciones.filter(c => c.modulo === modulo && c.activo);
        observer.next(filtered);
        observer.complete();
      }, 200);
    });
  }

  /**
   * Obtener configuraciones por tipo
   */
  getConfiguracionesByTipo(tipo: TipoConfiguracion): Observable<ConfiguracionSistema[]> {
    return new Observable<ConfiguracionSistema[]>(observer => {
      setTimeout(() => {
        const configuraciones = this.getMockConfiguraciones();
        const filtered = configuraciones.filter(c => c.tipo === tipo && c.activo);
        observer.next(filtered);
        observer.complete();
      }, 200);
    });
  }

  /**
   * Obtener items de configuración por módulo y tipo
   */
  getItemsByModuloAndTipo(modulo: ModuloSistema, tipo: TipoConfiguracion): Observable<ConfiguracionItem[]> {
    return new Observable<ConfiguracionItem[]>(observer => {
      setTimeout(() => {
        const configuraciones = this.getMockConfiguraciones();
        const configuracion = configuraciones.find(c => 
          c.modulo === modulo && c.tipo === tipo && c.activo
        );
        
        if (configuracion) {
          observer.next(configuracion.items.filter(item => item.activo));
        } else {
          observer.next([]);
        }
        observer.complete();
      }, 200);
    });
  }

  /**
   * Obtener estados por módulo
   */
  getEstadosByModulo(modulo: ModuloSistema): Observable<string[]> {
    return new Observable<string[]>(observer => {
      setTimeout(() => {
        const estados = ConfiguracionHelper.getEstadosByModulo(modulo);
        observer.next(estados);
        observer.complete();
      }, 100);
    });
  }

  /**
   * Obtener categorías por módulo
   */
  getCategoriasByModulo(modulo: ModuloSistema): Observable<string[]> {
    return new Observable<string[]>(observer => {
      setTimeout(() => {
        const categorias = ConfiguracionHelper.getCategoriasByModulo(modulo);
        observer.next(categorias);
        observer.complete();
      }, 100);
    });
  }

  /**
   * Obtener tipos por módulo
   */
  getTiposByModulo(modulo: ModuloSistema): Observable<string[]> {
    return new Observable<string[]>(observer => {
      setTimeout(() => {
        const tipos = ConfiguracionHelper.getTiposByModulo(modulo);
        observer.next(tipos);
        observer.complete();
      }, 100);
    });
  }

  /**
   * Exportar configuraciones
   */
  exportarConfiguraciones(filtros: ConfiguracionFilter = {}): Observable<Blob> {
    return new Observable<Blob>(observer => {
      setTimeout(() => {
                 const configuraciones = this.getMockConfiguraciones();
         let filtered = configuraciones;

        // Aplicar filtros
        if (filtros.modulo) {
          filtered = filtered.filter(c => c.modulo === filtros.modulo);
        }
        if (filtros.tipo) {
          filtered = filtered.filter(c => c.tipo === filtros.tipo);
        }
        if (filtros.activo !== undefined) {
          filtered = filtered.filter(c => c.activo === filtros.activo);
        }

        // Crear CSV
        const csv = this.convertirACSV(filtered);
        const blob = new Blob([csv], { type: 'text/csv' });
        observer.next(blob);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Obtener log de auditoría
   */
  getAuditLogConfiguracion(id: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      setTimeout(() => {
        const auditLog = [
          {
            id: '1',
            configuracionId: id,
            accion: 'CREAR',
            usuario: 'admin',
            fecha: new Date('2024-01-15T10:30:00'),
            detalles: 'Configuración creada',
            valoresAnteriores: null,
            valoresNuevos: { nombre: 'Estados de Empresa' }
          },
          {
            id: '2',
            configuracionId: id,
            accion: 'ACTUALIZAR',
            usuario: 'admin',
            fecha: new Date('2024-01-20T14:15:00'),
            detalles: 'Agregado nuevo estado',
            valoresAnteriores: { items: 3 },
            valoresNuevos: { items: 4 }
          }
        ];
        observer.next(auditLog);
        observer.complete();
      }, 300);
    });
  }

  // ============================================================================
  // MÉTODOS PRIVADOS - MOCK DATA
  // ============================================================================

  private getMockConfiguraciones(): ConfiguracionSistema[] {
    return [
      // Estados de Empresa
      {
        id: '1',
        modulo: ModuloSistema.EMPRESAS,
        tipo: TipoConfiguracion.ESTADO,
        nombre: 'Estados de Empresa',
        descripcion: 'Estados disponibles para empresas de transporte',
        items: [
          { codigo: EstadoEmpresa.HABILITADA, nombre: 'Habilitada', descripcion: 'Empresa habilitada para operar', activo: true, orden: 1, color: '#28a745', icono: 'fas fa-check-circle' },
          { codigo: EstadoEmpresa.SUSPENDIDA, nombre: 'Suspendida', descripcion: 'Empresa suspendida temporalmente', activo: true, orden: 2, color: '#ffc107', icono: 'fas fa-exclamation-triangle' },
          { codigo: EstadoEmpresa.CANCELADA, nombre: 'Cancelada', descripcion: 'Empresa cancelada permanentemente', activo: true, orden: 3, color: '#dc3545', icono: 'fas fa-times-circle' }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Estados de Vehículo
      {
        id: '2',
        modulo: ModuloSistema.VEHICULOS,
        tipo: TipoConfiguracion.ESTADO,
        nombre: 'Estados de Vehículo',
        descripcion: 'Estados disponibles para vehículos',
        items: [
          { codigo: EstadoVehiculo.ACTIVO, nombre: 'Activo', descripcion: 'Vehículo activo y operativo', activo: true, orden: 1, color: '#28a745', icono: 'fas fa-check-circle' },
          { codigo: EstadoVehiculo.MANTENIMIENTO, nombre: 'En Mantenimiento', descripcion: 'Vehículo en mantenimiento', activo: true, orden: 2, color: '#17a2b8', icono: 'fas fa-tools' },
          { codigo: EstadoVehiculo.SUSPENDIDO, nombre: 'Suspendido', descripcion: 'Vehículo suspendido temporalmente', activo: true, orden: 3, color: '#ffc107', icono: 'fas fa-exclamation-triangle' },
          { codigo: EstadoVehiculo.BAJA, nombre: 'Dado de Baja', descripcion: 'Vehículo dado de baja', activo: true, orden: 4, color: '#dc3545', icono: 'fas fa-times-circle' }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Categorías de Vehículo
      {
        id: '3',
        modulo: ModuloSistema.VEHICULOS,
        tipo: TipoConfiguracion.CATEGORIA,
        nombre: 'Categorías de Vehículo',
        descripcion: 'Categorías de vehículos según normativa',
        items: [
          { codigo: CategoriaVehiculo.M1, nombre: 'M1 - Vehículos de pasajeros', descripcion: 'Vehículos de pasajeros con hasta 8 plazas', activo: true, orden: 1 },
          { codigo: CategoriaVehiculo.M2, nombre: 'M2 - Vehículos de pasajeros', descripcion: 'Vehículos de pasajeros con más de 8 plazas', activo: true, orden: 2 },
          { codigo: CategoriaVehiculo.M3, nombre: 'M3 - Vehículos de pasajeros', descripcion: 'Vehículos de pasajeros de gran capacidad', activo: true, orden: 3 },
          { codigo: CategoriaVehiculo.N1, nombre: 'N1 - Vehículos de carga', descripcion: 'Vehículos de carga hasta 3.5 toneladas', activo: true, orden: 4 },
          { codigo: CategoriaVehiculo.N2, nombre: 'N2 - Vehículos de carga', descripcion: 'Vehículos de carga entre 3.5 y 12 toneladas', activo: true, orden: 5 },
          { codigo: CategoriaVehiculo.N3, nombre: 'N3 - Vehículos de carga', descripcion: 'Vehículos de carga más de 12 toneladas', activo: true, orden: 6 }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Tipos de Vehículo
      {
        id: '4',
        modulo: ModuloSistema.VEHICULOS,
        tipo: TipoConfiguracion.TIPO,
        nombre: 'Tipos de Vehículo',
        descripcion: 'Tipos específicos de vehículos',
        items: [
          { codigo: TipoVehiculo.BUS, nombre: 'Bus', descripcion: 'Vehículo de transporte de pasajeros', activo: true, orden: 1 },
          { codigo: TipoVehiculo.MICROBUS, nombre: 'Microbús', descripcion: 'Vehículo pequeño de transporte', activo: true, orden: 2 },
          { codigo: TipoVehiculo.CAMION, nombre: 'Camión', descripcion: 'Vehículo de carga pesada', activo: true, orden: 3 },
          { codigo: TipoVehiculo.CAMIONETA, nombre: 'Camioneta', descripcion: 'Vehículo de carga ligera', activo: true, orden: 4 },
          { codigo: TipoVehiculo.FURGON, nombre: 'Furgón', descripcion: 'Vehículo de carga cerrado', activo: true, orden: 5 }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Estados de Conductor
      {
        id: '5',
        modulo: ModuloSistema.CONDUCTORES,
        tipo: TipoConfiguracion.ESTADO,
        nombre: 'Estados de Conductor',
        descripcion: 'Estados disponibles para conductores',
        items: [
          { codigo: EstadoConductor.HABILITADO, nombre: 'Habilitado', descripcion: 'Conductor habilitado para conducir', activo: true, orden: 1, color: '#28a745', icono: 'fas fa-check-circle' },
          { codigo: EstadoConductor.SUSPENDIDO, nombre: 'Suspendido', descripcion: 'Conductor suspendido temporalmente', activo: true, orden: 2, color: '#ffc107', icono: 'fas fa-exclamation-triangle' },
          { codigo: EstadoConductor.VENCIDO, nombre: 'Vencido', descripcion: 'Licencia de conductor vencida', activo: true, orden: 3, color: '#dc3545', icono: 'fas fa-times-circle' }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Tipos de Licencia
      {
        id: '6',
        modulo: ModuloSistema.CONDUCTORES,
        tipo: TipoConfiguracion.TIPO,
        nombre: 'Tipos de Licencia',
        descripcion: 'Tipos de licencia de conducir',
        items: [
          { codigo: TipoLicencia.A1, nombre: 'A1 - Motocicletas', descripcion: 'Licencia para motocicletas', activo: true, orden: 1 },
          { codigo: TipoLicencia.A2, nombre: 'A2 - Motocicletas', descripcion: 'Licencia para motocicletas medianas', activo: true, orden: 2 },
          { codigo: TipoLicencia.A3, nombre: 'A3 - Motocicletas', descripcion: 'Licencia para motocicletas grandes', activo: true, orden: 3 },
          { codigo: TipoLicencia.B1, nombre: 'B1 - Automóviles', descripcion: 'Licencia para automóviles', activo: true, orden: 4 },
          { codigo: TipoLicencia.B2, nombre: 'B2 - Automóviles', descripcion: 'Licencia para automóviles medianos', activo: true, orden: 5 },
          { codigo: TipoLicencia.B3, nombre: 'B3 - Automóviles', descripcion: 'Licencia para automóviles grandes', activo: true, orden: 6 },
          { codigo: TipoLicencia.C1, nombre: 'C1 - Camiones', descripcion: 'Licencia para camiones ligeros', activo: true, orden: 7 },
          { codigo: TipoLicencia.C2, nombre: 'C2 - Camiones', descripcion: 'Licencia para camiones medianos', activo: true, orden: 8 },
          { codigo: TipoLicencia.C3, nombre: 'C3 - Camiones', descripcion: 'Licencia para camiones pesados', activo: true, orden: 9 }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },

      // Clasificaciones de Empresa
      {
        id: '7',
        modulo: ModuloSistema.EMPRESAS,
        tipo: TipoConfiguracion.CLASIFICACION,
        nombre: 'Clasificaciones de Empresa',
        descripcion: 'Clasificaciones de empresas de transporte',
        items: [
          { codigo: ClasificacionEmpresa.TRANSPORTE_PASAJEROS, nombre: 'Transporte de Pasajeros', descripcion: 'Empresa de transporte de pasajeros', activo: true, orden: 1 },
          { codigo: ClasificacionEmpresa.TRANSPORTE_CARGA, nombre: 'Transporte de Carga', descripcion: 'Empresa de transporte de carga', activo: true, orden: 2 },
          { codigo: ClasificacionEmpresa.TRANSPORTE_ESCOLAR, nombre: 'Transporte Escolar', descripcion: 'Empresa de transporte escolar', activo: true, orden: 3 },
          { codigo: ClasificacionEmpresa.TRANSPORTE_TURISTICO, nombre: 'Transporte Turístico', descripcion: 'Empresa de transporte turístico', activo: true, orden: 4 },
          { codigo: ClasificacionEmpresa.TRANSPORTE_ESPECIALIZADO, nombre: 'Transporte Especializado', descripcion: 'Empresa de transporte especializado', activo: true, orden: 5 }
        ],
        activo: true,
        editable: true,
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    ];
  }

  private convertirACSV(configuraciones: ConfiguracionSistema[]): string {
    const headers = ['ID', 'Módulo', 'Tipo', 'Nombre', 'Descripción', 'Activo', 'Items'];
    const rows = configuraciones.map(c => [
      c.id,
      c.modulo,
      c.tipo,
      c.nombre,
      c.descripcion || '',
      c.activo ? 'Sí' : 'No',
      c.items.length
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
} 