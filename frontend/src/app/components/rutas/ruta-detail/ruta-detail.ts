import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '../../../services/ruta';
import { Ruta } from '../../../models/ruta.model';

@Component({
  selector: 'app-ruta-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ruta-detail-container">
      <div class="page-header">
        <h1>Detalles de Ruta</h1>
        <p>Componente en desarrollo</p>
      </div>
    </div>
  `,
  styles: [`
    .ruta-detail-container {
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
export class RutaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rutaService = inject(RutaService);

  ruta = signal<Ruta | null>(null);
  cargando = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarRuta(id);
    }
  }

  private cargarRuta(id: string): void {
    this.cargando.set(true);
    this.rutaService.getRuta(id).subscribe({
      next: (ruta) => {
        this.ruta.set(ruta);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ruta:', error);
        this.cargando.set(false);
      }
    });
  }
} 