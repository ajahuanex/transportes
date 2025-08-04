import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa';
import { EmpresaTransporte, EmpresaFilter } from '../../models/empresa.model';
import { EstadoGeneral } from '../../models/base.model';
import { ColumnSelectorComponent, ColumnOption } from '../shared/column-selector/column-selector';
import { ExportService, ColumnConfig } from '../../services/export.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnSelectorComponent],
  templateUrl: './empresas.html',
  styleUrls: ['./empresas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpresasComponent implements OnInit {
  
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  private exportService = inject(ExportService);
  
  // Signals para el estado del componente
  empresas = signal<EmpresaTransporte[]>([]);
  totalEmpresas = signal(0);
  paginaActual = signal(1);
  porPagina = signal(10);
  totalPaginas = signal(0);
  cargando = signal(false);
  filtrosVisibles = signal(true);
  ordenamiento = signal<{campo: string, direccion: 'asc' | 'desc'}>({campo: 'fechaCreacion', direccion: 'desc'});

  filtros = signal<EmpresaFilter>({
    ruc: '',
    razonSocial: '',
    estado: undefined,
    distrito: ''
  });

  // Configuración de columnas
  columnas = signal<ColumnOption[]>([
    { key: 'ruc', label: 'RUC', visible: true, sortable: true },
    { key: 'razonSocial', label: 'Razón Social', visible: true, sortable: true },
    { key: 'razonSocialInterno', label: 'Razón Social Interno', visible: false, sortable: true },
    { key: 'nombreCorto', label: 'Nombre Corto', visible: false, sortable: true },
    { key: 'nombreComercial', label: 'Nombre Comercial', visible: true, sortable: true },
    { key: 'representanteLegal.nombre', label: 'Representante Legal', visible: true, sortable: true },
    { key: 'contacto.telefono', label: 'Teléfono', visible: true, sortable: false },
    { key: 'contacto.email', label: 'Email', visible: true, sortable: false },
    { key: 'direccion.distrito', label: 'Distrito', visible: true, sortable: true },
    { key: 'expediente.numero', label: 'Expediente', visible: true, sortable: true },
    { key: 'expediente.fecha', label: 'Fecha Expediente', visible: false, sortable: true },
    { key: 'estado', label: 'Estado', visible: true, sortable: true },
    { key: 'fechaCreacion', label: 'Fecha Registro', visible: true, sortable: true }
  ]);

  // Computed properties
  currentEmpresas = computed(() => this.empresas());
  currentTotalEmpresas = computed(() => this.totalEmpresas());
  currentPaginaActual = computed(() => this.paginaActual());
  currentPorPagina = computed(() => this.porPagina());
  currentTotalPaginas = computed(() => this.totalPaginas());
  isLoading = computed(() => this.cargando());
  currentFiltros = computed(() => this.filtros());
  currentColumnas = computed(() => this.columnas());

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.cargando.set(true);
    
    this.empresaService.getEmpresas(this.currentPaginaActual(), this.currentPorPagina(), this.currentFiltros())
      .subscribe({
        next: (response) => {
          this.empresas.set(response.empresas);
          this.totalEmpresas.set(response.total);
          this.totalPaginas.set(response.totalPaginas);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar empresas:', error);
          this.cargando.set(false);
          // Mostrar mensaje de error al usuario
        }
      });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1); // Resetear a la primera página
    this.cargarEmpresas();
  }

  limpiarFiltros(): void {
    this.filtros.set({
      ruc: '',
      razonSocial: '',
      estado: undefined,
      distrito: ''
    });
    this.aplicarFiltros();
  }

  toggleFiltros(): void {
    this.filtrosVisibles.update(visible => !visible);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.currentTotalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarEmpresas();
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
    const empresas = [...this.currentEmpresas()];
    
    empresas.sort((a, b) => {
      const valorA = this.getNestedValue(a, orden.campo);
      const valorB = this.getNestedValue(b, orden.campo);
      
      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.empresas.set(empresas);
  }

  getEstadoClass(estado: EstadoGeneral): string {
    switch (estado) {
      case EstadoGeneral.ACTIVO:
        return 'badge-success';
      case EstadoGeneral.SUSPENDIDO:
        return 'badge-warning';
      case EstadoGeneral.CANCELADO:
        return 'badge-danger';
      case EstadoGeneral.PENDIENTE:
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  getEstadoIcon(estado: EstadoGeneral): string {
    switch (estado) {
      case EstadoGeneral.ACTIVO:
        return 'fas fa-check-circle';
      case EstadoGeneral.SUSPENDIDO:
        return 'fas fa-pause-circle';
      case EstadoGeneral.CANCELADO:
        return 'fas fa-times-circle';
      case EstadoGeneral.PENDIENTE:
        return 'fas fa-clock';
      default:
        return 'fas fa-question-circle';
    }
  }

  getEstadoText(estado: EstadoGeneral): string {
    switch (estado) {
      case EstadoGeneral.ACTIVO:
        return 'Activo';
      case EstadoGeneral.SUSPENDIDO:
        return 'Suspendido';
      case EstadoGeneral.CANCELADO:
        return 'Cancelado';
      case EstadoGeneral.PENDIENTE:
        return 'Pendiente';
      default:
        return estado;
    }
  }

  getExpedienteEstadoClass(estado: string): string {
    switch (estado) {
      case 'ABIERTO':
        return 'badge-info';
      case 'EN_TRAMITE':
        return 'badge-warning';
      case 'APROBADO':
        return 'badge-success';
      case 'RECHAZADO':
        return 'badge-danger';
      case 'CERRADO':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  }

  getRowClass(empresa: EmpresaTransporte): string {
    if (empresa.estado === EstadoGeneral.SUSPENDIDO) {
      return 'row-suspended';
    }
    if (empresa.estado === EstadoGeneral.CANCELADO) {
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

  getEmpresasActivas(): number {
    return this.currentEmpresas().filter(e => e.estado === EstadoGeneral.ACTIVO).length;
  }

  getEmpresasSuspendidas(): number {
    return this.currentEmpresas().filter(e => e.estado === EstadoGeneral.SUSPENDIDO).length;
  }

  nuevaEmpresa(): void {
    this.router.navigate(['/empresas/nueva']);
  }

  verEmpresa(id: string): void {
    this.router.navigate(['/empresas', id]);
  }

  editarEmpresa(id: string): void {
    this.router.navigate(['/empresas', id, 'editar']);
  }

  toggleEstadoEmpresa(empresa: EmpresaTransporte): void {
    if (empresa.estado === EstadoGeneral.ACTIVO) {
      this.suspenderEmpresa(empresa.id);
    } else {
      this.activarEmpresa(empresa.id);
    }
  }

  suspenderEmpresa(id: string): void {
    if (confirm('¿Está seguro de que desea suspender esta empresa?')) {
      // Implementar lógica de suspensión
      console.log('Suspender empresa:', id);
      // Actualizar estado en el servicio
      this.cargarEmpresas();
    }
  }

  activarEmpresa(id: string): void {
    if (confirm('¿Está seguro de que desea activar esta empresa?')) {
      // Implementar lógica de activación
      console.log('Activar empresa:', id);
      // Actualizar estado en el servicio
      this.cargarEmpresas();
    }
  }

  eliminarEmpresa(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta empresa? Esta acción no se puede deshacer.')) {
      this.empresaService.deleteEmpresa({ empresaId: id, motivo: 'Eliminación por usuario', usuario: 'admin' })
        .subscribe({
          next: () => {
            console.log('Empresa eliminada exitosamente');
            this.cargarEmpresas();
          },
          error: (error) => {
            console.error('Error al eliminar empresa:', error);
            // Mostrar mensaje de error al usuario
          }
        });
    }
  }

  verExpediente(empresa: EmpresaTransporte): void {
    // Navegar al expediente de la empresa
    console.log('Ver expediente de empresa:', empresa.id);
    // this.router.navigate(['/expedientes', empresa.expediente.numero]);
  }

  verDocumentos(empresa: EmpresaTransporte): void {
    // Navegar a los documentos de la empresa
    console.log('Ver documentos de empresa:', empresa.id);
    // this.router.navigate(['/empresas', empresa.id, 'documentos']);
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

    const datos = this.currentEmpresas().map(empresa => {
      const fila: any = {};
      columnas.forEach(col => {
        fila[col.key] = this.getNestedValue(empresa, col.key);
      });
      return fila;
    });

    this.exportService.exportToExcel(datos, columnas, { 
      format: 'excel', 
      filename: `empresas_${new Date().toISOString().split('T')[0]}` 
    });
  }

  onColumnasChange(columnas: ColumnOption[]): void {
    this.columnas.set(columnas);
  }

  private getColumnFormatter(key: string): ((value: any) => string) | undefined {
    switch (key) {
      case 'estado':
        return (value: EstadoGeneral) => this.getEstadoText(value);
      case 'fechaCreacion':
        return (value: Date) => value ? new Date(value).toLocaleDateString('es-ES') : '-';
      case 'expediente.fecha':
        return (value: Date) => value ? new Date(value).toLocaleDateString('es-ES') : '-';
      default:
        return undefined;
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  verificarRUC(ruc: string): void {
    if (ruc && ruc.length === 11) {
      // Implementar verificación de RUC con SUNAT
      console.log('Verificando RUC:', ruc);
      // Mostrar indicador de verificación
    }
  }

  actualizarFiltroRUC(ruc: string): void {
    this.filtros.update(f => ({ ...f, ruc }));
  }

  actualizarFiltroRazonSocial(razonSocial: string): void {
    this.filtros.update(f => ({ ...f, razonSocial }));
  }

  actualizarFiltroEstado(estado: EstadoGeneral | undefined): void {
    this.filtros.update(f => ({ ...f, estado }));
  }

  actualizarFiltroDistrito(distrito: string): void {
    this.filtros.update(f => ({ ...f, distrito }));
  }

  actualizarFiltroExpediente(numeroExpediente: string): void {
    this.filtros.update(f => ({ ...f, numeroExpediente }));
  }

  verEmpresasEliminadas(): void {
    this.router.navigate(['/empresas/eliminadas']);
  }
}
