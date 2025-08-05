import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfiguracionService } from '../../services/configuracion.service';
import { NotificationService } from '../../services/notification.service';
import { 
  ConfiguracionSistema, 
  ModuloSistema, 
  TipoConfiguracion,
  ConfiguracionFilter,
  ConfiguracionHelper
} from '../../models/configuracion.model';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuraciones.html',
  styleUrls: ['./configuraciones.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguracionesComponent implements OnInit {
  
  private router = inject(Router);
  private configuracionService = inject(ConfiguracionService);
  private notificationService = inject(NotificationService);
  
  // Signals para el estado del componente
  configuraciones = signal<ConfiguracionSistema[]>([]);
  cargando = signal(false);
  paginaActual = signal(1);
  porPagina = signal(10);
  total = signal(0);
  
  // Filtros
  filtros = signal<ConfiguracionFilter>({
    modulo: undefined,
    tipo: undefined,
    activo: undefined,
    nombre: ''
  });

  // Computed properties
  currentConfiguraciones = computed(() => this.configuraciones());
  isLoading = computed(() => this.cargando());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotal = computed(() => this.total());
  currentFiltros = computed(() => this.filtros());

  // Opciones para filtros
  modulos = Object.values(ModuloSistema);
  tipos = Object.values(TipoConfiguracion);
  
  // Utilidades
  Math = Math;

  ngOnInit(): void {
    this.cargarConfiguraciones();
  }

  cargarConfiguraciones(): void {
    this.cargando.set(true);
    
    this.configuracionService.getConfiguraciones(
      this.currentPaginaActual(),
      this.currentPorPagina(),
      this.currentFiltros()
    ).subscribe({
      next: (response) => {
        this.configuraciones.set(response.configuraciones);
        this.total.set(response.total);
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar configuraciones:', error);
        this.notificationService.error('Error', 'No se pudieron cargar las configuraciones');
        this.cargando.set(false);
      }
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarConfiguraciones();
  }

  cambiarElementosPorPagina(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevoValor = parseInt(select.value);
    this.porPagina.set(nuevoValor);
    this.paginaActual.set(1);
    this.cargarConfiguraciones();
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarConfiguraciones();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      modulo: undefined,
      tipo: undefined,
      activo: undefined,
      nombre: ''
    });
    this.paginaActual.set(1);
    this.cargarConfiguraciones();
  }

  actualizarFiltro(campo: keyof ConfiguracionFilter, valor: any): void {
    this.filtros.update(filtros => ({
      ...filtros,
      [campo]: valor
    }));
  }

  editarConfiguracion(id: string): void {
    this.router.navigate(['/configuraciones', id, 'editar']);
  }

  verConfiguracion(id: string): void {
    this.router.navigate(['/configuraciones', id]);
  }

  eliminarConfiguracion(id: string): void {
    this.notificationService.confirm(
      'Eliminar Configuración',
      '¿Está seguro de que desea eliminar esta configuración?'
    ).then(confirmado => {
      if (confirmado) {
        this.configuracionService.deleteConfiguracion(id).subscribe({
          next: () => {
            this.notificationService.success('Configuración Eliminada', 'La configuración ha sido eliminada exitosamente');
            this.cargarConfiguraciones();
          },
          error: (error: any) => {
            console.error('Error al eliminar configuración:', error);
            this.notificationService.error('Error', 'No se pudo eliminar la configuración');
          }
        });
      }
    });
  }

  exportarConfiguraciones(): void {
    this.configuracionService.exportarConfiguraciones(this.currentFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `configuraciones_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.notificationService.success('Exportación Completada', 'Las configuraciones han sido exportadas exitosamente');
      },
      error: (error: any) => {
        console.error('Error al exportar configuraciones:', error);
        this.notificationService.error('Error', 'No se pudieron exportar las configuraciones');
      }
    });
  }

  nuevaConfiguracion(): void {
    this.router.navigate(['/configuraciones', 'nueva']);
  }

  // Métodos de utilidad
  obtenerTextoModulo(modulo: ModuloSistema): string {
    const textos: { [key in ModuloSistema]: string } = {
      [ModuloSistema.EMPRESAS]: 'Empresas',
      [ModuloSistema.VEHICULOS]: 'Vehículos',
      [ModuloSistema.CONDUCTORES]: 'Conductores',
      [ModuloSistema.RUTAS]: 'Rutas',
      [ModuloSistema.EXPEDIENTES]: 'Expedientes',
      [ModuloSistema.RESOLUCIONES]: 'Resoluciones',
      [ModuloSistema.TUCS]: 'TUCs',
      [ModuloSistema.REPORTES]: 'Reportes',
      [ModuloSistema.SISTEMA]: 'Sistema'
    };
    return textos[modulo] || modulo;
  }

  obtenerTextoTipo(tipo: TipoConfiguracion): string {
    const textos: { [key in TipoConfiguracion]: string } = {
      [TipoConfiguracion.ESTADO]: 'Estado',
      [TipoConfiguracion.CATEGORIA]: 'Categoría',
      [TipoConfiguracion.TIPO]: 'Tipo',
      [TipoConfiguracion.CLASIFICACION]: 'Clasificación',
      [TipoConfiguracion.PARAMETRO]: 'Parámetro'
    };
    return textos[tipo] || tipo;
  }

  obtenerClaseEstado(activo: boolean): string {
    return activo ? 'badge-success' : 'badge-danger';
  }

  obtenerTextoEstado(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  obtenerCantidadItems(configuracion: ConfiguracionSistema): number {
    return configuracion.items.filter(item => item.activo).length;
  }

  obtenerEstadisticas(): any {
    const configuraciones = this.currentConfiguraciones();
    const total = configuraciones.length;
    const activas = configuraciones.filter(c => c.activo).length;
    const inactivas = total - activas;
    
    const porModulo = this.modulos.reduce((acc, modulo) => {
      acc[modulo] = configuraciones.filter(c => c.modulo === modulo).length;
      return acc;
    }, {} as { [key: string]: number });

    const porTipo = this.tipos.reduce((acc, tipo) => {
      acc[tipo] = configuraciones.filter(c => c.tipo === tipo).length;
      return acc;
    }, {} as { [key: string]: number });

    return {
      total,
      activas,
      inactivas,
      porModulo,
      porTipo
    };
  }

  generarArrayPaginas(): number[] {
    const totalPaginas = Math.ceil(this.currentTotal() / this.currentPorPagina());
    const paginaActual = this.currentPaginaActual();
    const paginas: number[] = [];

    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }
} 