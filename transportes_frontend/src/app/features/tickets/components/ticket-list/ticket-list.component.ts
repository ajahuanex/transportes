import { Component, OnInit, signal } from '@angular/core';
import { TicketsService } from '../../services/tickets';
import { IPapeletaInDB } from '../../models/ticket.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets = signal<IPapeletaInDB[]>([]);

  constructor(private ticketsService: TicketsService, private router: Router) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketsService.getAllActiveTickets().subscribe(
      (data) => {
        this.tickets.set(data);
      },
      (error) => {
        console.error('Error al cargar papeletas:', error);
      }
    );
  }

  editTicket(id: string): void {
    this.router.navigate(['/tickets/edit', id]);
  }

  softDeleteTicket(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta papeleta?')) {
      this.ticketsService.softDeleteTicket(id).subscribe(
        () => {
          console.log('Papeleta eliminada lógicamente con éxito');
          this.loadTickets();
        },
        (error) => {
          console.error('Error al eliminar papeleta:', error);
        }
      );
    }
  }

  restoreTicket(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta papeleta?')) {
      this.ticketsService.restoreTicket(id).subscribe(
        () => {
          console.log('Papeleta restaurada con éxito');
          this.loadTickets();
        },
        (error) => {
          console.error('Error al restaurar papeleta:', error);
        }
      );
    }
  }

  createTicket(): void {
    this.router.navigate(['/tickets/new']);
  }
}