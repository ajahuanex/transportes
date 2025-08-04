import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  private mockDataService = inject(MockDataService);
  
  // Signals para el estado del componente
  estadisticas = signal({
    totalEmpresas: 0,
    totalVehiculos: 0,
    totalConductores: 0,
    totalRutas: 0
  });

  alertas = signal({
    documentosPorVencer: 0,
    documentosVencidos: 0,
    expedientesPendientes: 0
  });

  actividadesRecientes = signal([
    {
      icono: 'fas fa-building',
      descripcion: 'Nueva empresa "Transportes Puno SAC" registrada',
      fecha: new Date()
    },
    {
      icono: 'fas fa-bus',
      descripcion: 'Vehículo ABC-123 agregado a la flota',
      fecha: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
    },
    {
      icono: 'fas fa-user-tie',
      descripcion: 'Conductor Juan Pérez habilitado',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
    },
    {
      icono: 'fas fa-exclamation-triangle',
      descripcion: 'Documento de empresa próximo a vencer',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 horas atrás
    }
  ]);

  // Computed properties
  currentEstadisticas = computed(() => this.estadisticas());
  currentAlertas = computed(() => this.alertas());
  currentActividades = computed(() => this.actividadesRecientes());

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarAlertas();
  }

  cargarEstadisticas(): void {
    this.empresaService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas.set({
          totalEmpresas: data.totalEmpresas,
          totalVehiculos: data.totalVehiculos,
          totalConductores: data.totalConductores,
          totalRutas: data.totalRutas
        });
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        // Usar datos por defecto en caso de error
        this.estadisticas.set({
          totalEmpresas: 45,
          totalVehiculos: 128,
          totalConductores: 89,
          totalRutas: 23
        });
      }
    });
  }

  cargarAlertas(): void {
    this.mockDataService.getAlertas().subscribe({
      next: (data) => {
        this.alertas.set({
          documentosPorVencer: data.documentosPorVencer,
          documentosVencidos: data.documentosVencidos,
          expedientesPendientes: data.expedientesPendientes
        });
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
        // Usar datos por defecto en caso de error
        this.alertas.set({
          documentosPorVencer: 12,
          documentosVencidos: 3,
          expedientesPendientes: 7
        });
      }
    });
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  nuevaEmpresa(): void {
    this.router.navigate(['empresas', 'nueva']);
  }

  generarReporte(): void {
    // TODO: Implementar generación de reporte
    console.log('Generando reporte...');
  }

  // Método para probar la generación de números de serie
  probarGeneracionNumeros(): void {
    console.log('Probando generación de números de serie...');
    
    this.mockDataService.generarResolucion().subscribe(numero => {
      console.log('Número de Resolución:', numero);
    });
    
    this.mockDataService.generarExpediente().subscribe(numero => {
      console.log('Número de Expediente:', numero);
    });
    
    this.mockDataService.generarTUC().subscribe(numero => {
      console.log('Número de TUC:', numero);
    });
  }
}
