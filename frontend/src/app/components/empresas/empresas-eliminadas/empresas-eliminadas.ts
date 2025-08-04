import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresa';
import { EmpresaTransporte, EmpresaFilter, DeleteEmpresaRequest, RestoreEmpresaRequest } from '../../../models/empresa.model';
import { EstadoGeneral } from '../../../models/base.model';

@Component({
  selector: 'app-empresas-eliminadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas-eliminadas.html',
  styleUrls: ['./empresas-eliminadas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpresasEliminadasComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private router = inject(Router);

  // Signals para el estado
  empresas = signal<EmpresaTransporte[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalEmpresas = signal(0);
  paginaActual = signal(1);
  totalPaginas = signal(0);
  porPagina = signal(10);

  // Filtros
  filtros = signal<EmpresaFilter>({
    soloEliminados: true,
    incluirEliminados: false
  });

  ngOnInit(): void {
    this.cargarEmpresasEliminadas();
  }

  cargarEmpresasEliminadas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.empresaService.getEmpresasEliminadas(
      this.paginaActual(),
      this.porPagina(),
      this.filtros()
    ).subscribe({
      next: (response) => {
        this.empresas.set(response.empresas);
        this.totalEmpresas.set(response.total);
        this.totalPaginas.set(response.totalPaginas);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las empresas eliminadas');
        this.loading.set(false);
        console.error('Error cargando empresas eliminadas:', err);
      }
    });
  }

  restaurarEmpresa(empresa: EmpresaTransporte): void {
    if (!confirm(`¿Está seguro de que desea restaurar la empresa "${empresa.razonSocial}"?`)) {
      return;
    }

    const request: RestoreEmpresaRequest = {
      empresaId: empresa.id,
      usuario: 'admin', // TODO: Obtener del servicio de autenticación
      motivo: 'Restauración manual desde interfaz'
    };

    this.empresaService.restoreEmpresa(request).subscribe({
      next: () => {
        alert('Empresa restaurada exitosamente');
        this.cargarEmpresasEliminadas();
      },
      error: (err) => {
        alert('Error al restaurar la empresa');
        console.error('Error restaurando empresa:', err);
      }
    });
  }

  eliminarPermanentemente(empresa: EmpresaTransporte): void {
    if (!confirm(`¿Está seguro de que desea eliminar permanentemente la empresa "${empresa.razonSocial}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.empresaService.deleteEmpresaPermanente(empresa.id).subscribe({
      next: () => {
        alert('Empresa eliminada permanentemente');
        this.cargarEmpresasEliminadas();
      },
      error: (err) => {
        alert('Error al eliminar permanentemente la empresa');
        console.error('Error eliminando empresa permanentemente:', err);
      }
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarEmpresasEliminadas();
  }

  getEstadoClass(estado: EstadoGeneral): string {
    switch (estado) {
      case EstadoGeneral.ACTIVO:
        return 'estado-activo';
      case EstadoGeneral.SUSPENDIDO:
        return 'estado-suspendido';
      case EstadoGeneral.CANCELADO:
        return 'estado-cancelado';
      case EstadoGeneral.PENDIENTE:
        return 'estado-pendiente';
      case EstadoGeneral.ELIMINADO:
        return 'estado-eliminado';
      default:
        return 'estado-default';
    }
  }

  volverALista(): void {
    this.router.navigate(['/empresas']);
  }

  verDetalles(empresa: EmpresaTransporte): void {
    this.router.navigate(['/empresas', empresa.id]);
  }
} 