import { Component, OnInit, signal } from '@angular/core';
import { LandTerminalsService } from '../../services/land-terminals';
import { ITerminalTerrestreInDB } from '../../models/land-terminal.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-land-terminal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './land-terminal-list.component.html',
  styleUrls: ['./land-terminal-list.component.scss']
})
export class LandTerminalListComponent implements OnInit {
  landTerminals = signal<ITerminalTerrestreInDB[]>([]);

  constructor(private landTerminalsService: LandTerminalsService, private router: Router) { }

  ngOnInit(): void {
    this.loadLandTerminals();
  }

  loadLandTerminals(): void {
    this.landTerminalsService.getAllActiveLandTerminals().subscribe(
      (data) => {
        this.landTerminals.set(data);
      },
      (error) => {
        console.error('Error al cargar terminales terrestres:', error);
      }
    );
  }

  editLandTerminal(id: string): void {
    this.router.navigate(['/land-terminals/edit', id]);
  }

  softDeleteLandTerminal(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta terminal terrestre?')) {
      this.landTerminalsService.softDeleteLandTerminal(id).subscribe(
        () => {
          console.log('Terminal terrestre eliminada lógicamente con éxito');
          this.loadLandTerminals();
        },
        (error) => {
          console.error('Error al eliminar terminal terrestre:', error);
        }
      );
    }
  }

  restoreLandTerminal(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta terminal terrestre?')) {
      this.landTerminalsService.restoreLandTerminal(id).subscribe(
        () => {
          console.log('Terminal terrestre restaurada con éxito');
          this.loadLandTerminals();
        },
        (error) => {
          console.error('Error al restaurar terminal terrestre:', error);
        }
      );
    }
  }

  createLandTerminal(): void {
    this.router.navigate(['/land-terminals/new']);
  }
}
