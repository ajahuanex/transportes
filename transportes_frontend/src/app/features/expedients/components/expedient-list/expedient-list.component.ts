import { Component, OnInit, signal } from '@angular/core';
import { ExpedientsService } from '../../services/expedients';
import { IExpedienteInDB } from '../../models/expedient.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expedient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expedient-list.component.html',
  styleUrls: ['./expedient-list.component.scss']
})
export class ExpedientListComponent implements OnInit {
  expedients = signal<IExpedienteInDB[]>([]);

  constructor(private expedientsService: ExpedientsService, private router: Router) { }

  ngOnInit(): void {
    this.loadExpedients();
  }

  loadExpedients(): void {
    this.expedientsService.getAllActiveExpedients().subscribe(
      (data) => {
        this.expedients.set(data);
      },
      (error) => {
        console.error('Error al cargar expedientes:', error);
      }
    );
  }

  editExpedient(id: string): void {
    this.router.navigate(['/expedients/edit', id]);
  }

  softDeleteExpedient(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este expediente?')) {
      this.expedientsService.softDeleteExpedient(id).subscribe(
        () => {
          console.log('Expediente eliminado lógicamente con éxito');
          this.loadExpedients();
        },
        (error) => {
          console.error('Error al eliminar expediente:', error);
        }
      );
    }
  }

  restoreExpedient(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar este expediente?')) {
      this.expedientsService.restoreExpedient(id).subscribe(
        () => {
          console.log('Expediente restaurado con éxito');
          this.loadExpedients();
        },
        (error) => {
          console.error('Error al restaurar expediente:', error);
        }
      );
    }
  }

  createExpedient(): void {
    this.router.navigate(['/expedients/new']);
  }
}
