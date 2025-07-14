import { Component, OnInit, signal } from '@angular/core';
import { InfractionsFinesService } from '../../services/infractions-fines';
import { IInfraccionMultaInDB } from '../../models/infraction-fine.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infraction-fine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infraction-fine-list.component.html',
  styleUrls: ['./infraction-fine-list.component.scss']
})
export class InfractionFineListComponent implements OnInit {
  infractionsFines = signal<IInfraccionMultaInDB[]>([]);

  constructor(private infractionsFinesService: InfractionsFinesService, private router: Router) { }

  ngOnInit(): void {
    this.loadInfractionsFines();
  }

  loadInfractionsFines(): void {
    this.infractionsFinesService.getAllActiveInfractionsFines().subscribe(
      (data) => {
        this.infractionsFines.set(data);
      },
      (error) => {
        console.error('Error al cargar infracciones y multas:', error);
      }
    );
  }

  editInfractionFine(id: string): void {
    this.router.navigate(['/infractions-fines/edit', id]);
  }

  softDeleteInfractionFine(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta infracción/multa?')) {
      this.infractionsFinesService.softDeleteInfractionFine(id).subscribe(
        () => {
          console.log('Infracción/Multa eliminada lógicamente con éxito');
          this.loadInfractionsFines();
        },
        (error) => {
          console.error('Error al eliminar infracción/multa:', error);
        }
      );
    }
  }

  restoreInfractionFine(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta infracción/multa?')) {
      this.infractionsFinesService.restoreInfractionFine(id).subscribe(
        () => {
          console.log('Infracción/Multa restaurada con éxito');
          this.loadInfractionsFines();
        },
        (error) => {
          console.error('Error al restaurar infracción/multa:', error);
        }
      );
    }
  }

  createInfractionFine(): void {
    this.router.navigate(['/infractions-fines/new']);
  }
}
