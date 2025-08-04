import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RutaService } from '../../services/ruta';
import { Ruta, RutaFilter, TipoRuta, CategoriaRuta } from '../../models/ruta.model';
import { ColumnSelectorComponent, ColumnOption } from '../shared/column-selector/column-selector';
import { ExportService, ColumnConfig } from '../../services/export.service';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnSelectorComponent],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RutasComponent implements OnInit {
  
  private router = inject(Router);
  private rutaService = inject(RutaService);
  private exportService = inject(ExportService);
  
  // Signals para el estado del componente
  rutas = signal<Ruta[]>([]);
  totalRutas = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);
  filtrosVisibles = signal(true);
  ordenamiento = signal<{campo: string, direccion: 'asc' | 'desc'}>({campo: 'fechaCreacion', direccion: 'desc'});

  filtros = signal<RutaFilter>({
    codigoRuta: '',
    nombre: '',
    origen: '',
    destino: '',
    estado: undefined,
    tipoRuta: undefined,
    categoria: undefined
  });

  // Configuración de columnas
  columnas = signal<ColumnOption[]>([
    { key: 'codigoRuta', label: 'Código', visible: true, sortable: true },
    { key: 'nombre', label: 'Nombre', visible: true, sortable: true },
    { key: 'origen', label: 'Origen', visible: true, sortable: true },
    { key: 'destino', label: 'Destino', visible: true, sortable: true },
    { key: 'tipoRuta', label: 'Tipo', visible: true, sortable: true },
    { key: 'categoria', label: 'Categoría', visible: true, sortable: true },
    { key: 'distancia', label: 'Distancia (km)', visible: true, sortable: true },
    { key: 'tiempoEstimado', label: 'Tiempo (min)', visible: true, sortable: true },
    { key: 'empresasOperadoras', label: 'Empresas', visible: true, sortable: false },
    { key: 'vehiculosAsignados', label: 'Vehículos', visible: true, sortable: false },
    { key: 'estado', label: 'Estado', visible: true, sortable: true },
    { key: 'fechaCreacion', label: 'Fecha Registro', visible: true, sortable: true }
  ]);

  // Computed properties
  currentRutas = computed(() => this.rutas());
  currentTotalRutas = computed(() => this.totalRutas());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  currentFiltros = computed(() => this.filtros());
  currentColumnas = computed(() => this.columnas());

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando.set(true);
    
    this.rutaService.getRutas(this.currentFiltros(), this.currentPaginaActual(), this.currentPorPagina())
      .subscribe({
        next: (response) => {
          this.rutas.set(response.rutas);
          this.totalRutas.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar rutas:', error);
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarRutas();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      codigoRuta: '',
      nombre: '',
      origen: '',
      destino: '',
      estado: undefined,
      tipoRuta: undefined,
      categoria: undefined
    });
    this.aplicarFiltros();
  }

  toggleFiltros(): void {
    this.filtrosVisibles.update(visible => !visible);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarRutas();
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const totalPaginas = this.currentTotalPaginas();
    const paginaActual = this.currentPaginaActual();
    
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  ordenarPor(campo: string): void {
    const ordenActual = this.ordenamiento();
    const nuevaDireccion = ordenActual.campo === campo && ordenActual.direccion === 'asc' ? 'desc' : 'asc';
    
    this.ordenamiento.set({ campo, direccion: nuevaDireccion });
    this.aplicarOrdenamiento();
  }

  private aplicarOrdenamiento(): void {
    const orden = this.ordenamiento();
    const rutas = [...this.currentRutas()];
    
    rutas.sort((a, b) => {
      const valorA = this.getNestedValue(a, orden.campo);
      const valorB = this.getNestedValue(b, orden.campo);
      
      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.rutas.set(rutas);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'ACTIVA':
        return 'badge-success';
      case 'INACTIVA':
        return 'badge-secondary';
      case 'SUSPENDIDA':
        return 'badge-warning';
      case 'CANCELADA':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'ACTIVA':
        return 'fas fa-check-circle';
      case 'INACTIVA':
        return 'fas fa-pause-circle';
      case 'SUSPENDIDA':
        return 'fas fa-exclamation-triangle';
      case 'CANCELADA':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'ACTIVA':
        return 'Activa';
      case 'INACTIVA':
        return 'Inactiva';
      case 'SUSPENDIDA':
        return 'Suspendida';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return estado;
    }
  }

  getTipoRutaText(tipo: TipoRuta): string {
    switch (tipo) {
      case TipoRuta.URBANA:
        return 'Urbana';
      case TipoRuta.INTERURBANA:
        return 'Interurbana';
      case TipoRuta.INTERPROVINCIAL:
        return 'Interprovincial';
      case TipoRuta.INTERREGIONAL:
        return 'Interregional';
      case TipoRuta.NACIONAL:
        return 'Nacional';
      default:
        return tipo;
    }
  }

  getCategoriaText(categoria: CategoriaRuta): string {
    switch (categoria) {
      case CategoriaRuta.PASAJEROS:
        return 'Pasajeros';
      case CategoriaRuta.CARGA:
        return 'Carga';
      case CategoriaRuta.MIXTA:
        return 'Mixta';
      case CategoriaRuta.ESPECIAL:
        return 'Especial';
      default:
        return categoria;
    }
  }

  getRowClass(ruta: Ruta): string {
    if (ruta.estado === 'SUSPENDIDA') {
      return 'row-suspended';
    }
    if (ruta.estado === 'CANCELADA') {
      return 'row-cancelled';
    }
    return '';
  }

  getTiempoRegistro(fecha: Date): string {
    const ahora = new Date();
    const diffTime = Math.abs(ahora.getTime() - fecha.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 30) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30);
      return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    } else {
      const años = Math.floor(diffDays / 365);
      return `Hace ${años} año${años > 1 ? 's' : ''}`;
    }
  }

  getRutasActivas(): number {
    return this.currentRutas().filter(r => r.estado === 'ACTIVA').length;
  }

  getRutasSuspendidas(): number {
    return this.currentRutas().filter(r => r.estado === 'SUSPENDIDA').length;
  }

  nuevaRuta(): void {
    this.router.navigate(['/rutas/nueva']);
  }

  verRuta(id: string): void {
    this.router.navigate(['/rutas', id]);
  }

  editarRuta(id: string): void {
    this.router.navigate(['/rutas', id, 'editar']);
  }

  toggleEstadoRuta(ruta: Ruta): void {
    if (ruta.estado === 'ACTIVA') {
      this.suspenderRuta(ruta.id);
    } else {
      this.activarRuta(ruta.id);
    }
  }

  suspenderRuta(id: string): void {
    if (confirm('¿Está seguro de que desea suspender esta ruta?')) {
      this.rutaService.cambiarEstadoRuta(id, 'SUSPENDIDA', 'Suspensión por usuario')
        .subscribe({
          next: () => {
            console.log('Ruta suspendida exitosamente');
            this.cargarRutas();
          },
          error: (error) => {
            console.error('Error al suspender ruta:', error);
          }
        });
    }
  }

  activarRuta(id: string): void {
    if (confirm('¿Está seguro de que desea activar esta ruta?')) {
      this.rutaService.cambiarEstadoRuta(id, 'ACTIVA', 'Activación por usuario')
        .subscribe({
          next: () => {
            console.log('Ruta activada exitosamente');
            this.cargarRutas();
          },
          error: (error) => {
            console.error('Error al activar ruta:', error);
          }
        });
    }
  }

  eliminarRuta(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta ruta? Esta acción no se puede deshacer.')) {
              this.rutaService.deleteRuta({ id: id, motivo: 'Eliminación por usuario', usuario: 'admin', motivoEliminacion: 'Eliminación por usuario', usuarioEliminacion: 'admin' })
        .subscribe({
          next: () => {
            console.log('Ruta eliminada exitosamente');
            this.cargarRutas();
          },
          error: (error) => {
            console.error('Error al eliminar ruta:', error);
          }
        });
    }
  }

  verHorarios(ruta: Ruta): void {
    console.log('Ver horarios de ruta:', ruta.id);
    // this.router.navigate(['/rutas', ruta.id, 'horarios']);
  }

  verTarifas(ruta: Ruta): void {
    console.log('Ver tarifas de ruta:', ruta.id);
    // this.router.navigate(['/rutas', ruta.id, 'tarifas']);
  }

  exportarDatos(): void {
    const columnas: ColumnConfig[] = this.currentColumnas()
      .filter(col => col.visible)
      .map(col => ({
        key: col.key,
        label: col.label,
        visible: col.visible,
        formatter: this.getColumnFormatter(col.key)
      }));

    const datos = this.currentRutas().map(ruta => {
      const fila: any = {};
      columnas.forEach(col => {
        fila[col.key] = this.getNestedValue(ruta, col.key);
      });
      return fila;
    });

    this.exportService.exportToExcel(datos, columnas, { 
      format: 'excel', 
      filename: `rutas_${new Date().toISOString().split('T')[0]}` 
    });
  }

  onColumnasChange(columnas: ColumnOption[]): void {
    this.columnas.set(columnas);
  }

  private getColumnFormatter(key: string): ((value: any) => string) | undefined {
    switch (key) {
      case 'estado':
        return (value: string) => this.getEstadoText(value);
      case 'tipoRuta':
        return (value: TipoRuta) => this.getTipoRutaText(value);
      case 'categoria':
        return (value: CategoriaRuta) => this.getCategoriaText(value);
      case 'fechaCreacion':
        return (value: Date) => value ? new Date(value).toLocaleDateString('es-ES') : '-';
      case 'distancia':
        return (value: number) => value ? `${value} km` : '-';
      case 'tiempoEstimado':
        return (value: number) => value ? `${value} min` : '-';
      default:
        return undefined;
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  actualizarFiltroCodigoRuta(codigoRuta: string): void {
    this.filtros.update(f => ({ ...f, codigoRuta }));
  }

  actualizarFiltroNombre(nombre: string): void {
    this.filtros.update(f => ({ ...f, nombre }));
  }

  actualizarFiltroOrigen(origen: string): void {
    this.filtros.update(f => ({ ...f, origen }));
  }

  actualizarFiltroDestino(destino: string): void {
    this.filtros.update(f => ({ ...f, destino }));
  }

  actualizarFiltroEstado(estado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA' | undefined): void {
    this.filtros.update(f => ({ ...f, estado }));
  }

  actualizarFiltroTipoRuta(tipoRuta: TipoRuta | undefined): void {
    this.filtros.update(f => ({ ...f, tipoRuta }));
  }

  actualizarFiltroCategoria(categoria: CategoriaRuta | undefined): void {
    this.filtros.update(f => ({ ...f, categoria }));
  }

  verRutasEliminadas(): void {
    this.router.navigate(['/rutas/eliminadas']);
  }
} 