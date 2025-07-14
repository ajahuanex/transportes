import { Component, OnInit, signal } from '@angular/core';
import { MtcConfigsService } from '../../services/mtc-configs';
import { IConfiguracionMTCInDB } from '../../models/mtc-config.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mtc-config-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mtc-config-list.component.html',
  styleUrls: ['./mtc-config-list.component.scss']
})
export class MtcConfigListComponent implements OnInit {
  mtcConfig = signal<IConfiguracionMTCInDB | null>(null);

  constructor(private mtcConfigsService: MtcConfigsService, private router: Router) { }

  ngOnInit(): void {
    this.loadMtcConfig();
  }

  loadMtcConfig(): void {
    this.mtcConfigsService.getMtcConfig().subscribe(
      (data) => {
        this.mtcConfig.set(data);
      },
      (error) => {
        console.error('Error al cargar configuración MTC:', error);
        // Si no existe, podemos ofrecer crearla
        this.mtcConfig.set(null);
      }
    );
  }

  editMtcConfig(): void {
    // Como es una entidad única, siempre editamos la misma
    this.router.navigate(['/mtc-configs/edit', 'permanencia_vehiculos']);
  }

  createMtcConfig(): void {
    this.router.navigate(['/mtc-configs/new']);
  }
}
