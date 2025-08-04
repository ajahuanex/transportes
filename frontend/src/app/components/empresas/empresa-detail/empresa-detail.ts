import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../services/empresa';
import { EmpresaTransporte } from '../../../models/empresa.model';
import { EstadoGeneral } from '../../../models/base.model';

@Component({
  selector: 'app-empresa-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empresa-detail.html',
  styleUrls: ['./empresa-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpresaDetailComponent implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private empresaService = inject(EmpresaService);
  
  // Signals para el estado del componente
  empresa = signal<EmpresaTransporte | null>(null);
  isLoading = signal(false);
  empresaId = signal<string | null>(null);

  // Computed properties
  currentEmpresa = computed(() => this.empresa());
  currentIsLoading = computed(() => this.isLoading());
  currentEmpresaId = computed(() => this.empresaId());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empresaId.set(id);
      this.loadEmpresa(id);
    }
  }

  private loadEmpresa(id: string): void {
    this.isLoading.set(true);
    this.empresaService.getEmpresa(id).subscribe({
      next: (empresa) => {
        this.empresa.set(empresa);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar empresa:', error);
        this.isLoading.set(false);
        // TODO: Mostrar mensaje de error
      }
    });
  }

  editarEmpresa(): void {
    this.router.navigate(['/empresas', this.currentEmpresaId(), 'editar']);
  }

  volverALista(): void {
    this.router.navigate(['/empresas']);
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
} 