import { Component, OnInit, signal } from '@angular/core';
import { ResolutionsService } from '../../services/resolutions';
import { IResolucionInDB } from '../../models/resolution.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resolution-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolution-list.component.html',
  styleUrls: ['./resolution-list.component.scss']
})
export class ResolutionListComponent implements OnInit {
  resolutions = signal<IResolucionInDB[]>([]);

  constructor(private resolutionsService: ResolutionsService, private router: Router) { }

  ngOnInit(): void {
    this.loadResolutions();
  }

  loadResolutions(): void {
    this.resolutionsService.getAllResolutions().subscribe(
      (data) => {
        this.resolutions.set(data);
      },
      (error) => {
        console.error('Error al cargar resoluciones:', error);
      }
    );
  }

  editResolution(id: string): void {
    this.router.navigate(['/resolutions/edit', id]);
  }

  softDeleteResolution(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta resolución?')) {
      this.resolutionsService.softDeleteResolution(id).subscribe(
        () => {
          console.log('Resolución eliminada lógicamente con éxito');
          this.loadResolutions();
        },
        (error) => {
          console.error('Error al eliminar resolución:', error);
        }
      );
    }
  }

  restoreResolution(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta resolución?')) {
      this.resolutionsService.restoreResolution(id).subscribe(
        () => {
          console.log('Resolución restaurada con éxito');
          this.loadResolutions();
        },
        (error) => {
          console.error('Error al restaurar resolución:', error);
        }
      );
    }
  }

  createResolution(): void {
    this.router.navigate(['/resolutions/new']);
  }
}
