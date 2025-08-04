import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RutaService } from '../../../services/ruta';
import { Ruta, RutaFilter } from '../../../models/ruta.model';

@Component({
  selector: 'app-rutas-eliminadas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rutas-eliminadas-container">
      <div class="page-header">
        <h1>Rutas Eliminadas</h1>
        <p>Componente en desarrollo</p>
      </div>
    </div>
  `,
  styles: [`
    .rutas-eliminadas-container {
      padding: 20px;
    }
    .page-header {
      text-align: center;
      padding: 40px;
      background: #f8f9fa;
      border-radius: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RutasEliminadasComponent implements OnInit {
  private router = inject(Router);
  private rutaService = inject(RutaService);

  rutas = signal<Ruta[]>([]);
  cargando = signal(false);

  ngOnInit(): void {
    this.cargarRutasEliminadas();
  }

  private cargarRutasEliminadas(): void {
    this.cargando.set(true);
    this.rutaService.getRutasEliminadas().subscribe({
      next: (rutas) => {
        this.rutas.set(rutas);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar rutas eliminadas:', error);
        this.cargando.set(false);
      }
    });
  }
} 