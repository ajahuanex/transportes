import { Component, OnInit, signal } from '@angular/core';
import { TUCsService } from '../../services/tucs';
import { ITUCInDB } from '../../models/tuc.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tuc-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tuc-list.component.html',
  styleUrls: ['./tuc-list.component.scss']
})
export class TucListComponent implements OnInit {
  tucs = signal<ITUCInDB[]>([]);

  constructor(private tucsService: TUCsService, private router: Router) { }

  ngOnInit(): void {
    this.loadTUCs();
  }

  loadTUCs(): void {
    this.tucsService.getAllActiveTUCs().subscribe(
      (data) => {
        this.tucs.set(data);
      },
      (error) => {
        console.error('Error al cargar TUCs:', error);
      }
    );
  }

  editTUC(id: string): void {
    this.router.navigate(['/tucs/edit', id]);
  }

  softDeleteTUC(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta TUC?')) {
      this.tucsService.softDeleteTUC(id).subscribe(
        () => {
          console.log('TUC eliminada lógicamente con éxito');
          this.loadTUCs();
        },
        (error) => {
          console.error('Error al eliminar TUC:', error);
        }
      );
    }
  }

  restoreTUC(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta TUC?')) {
      this.tucsService.restoreTUC(id).subscribe(
        () => {
          console.log('TUC restaurada con éxito');
          this.loadTUCs();
        },
        (error) => {
          console.error('Error al restaurar TUC:', error);
        }
      );
    }
  }

  createTUC(): void {
    this.router.navigate(['/tucs/new']);
  }
}
