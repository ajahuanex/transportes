import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IPapeletaInDB, IPapeletaCreate, IPapeletaUpdate } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private ticketPath = '/papeletas';

  constructor(private apiService: ApiService) { }

  getAllTickets(): Observable<IPapeletaInDB[]> {
    return this.apiService.get<IPapeletaInDB[]>(this.ticketPath);
  }

  getAllActiveTickets(): Observable<IPapeletaInDB[]> {
    return this.apiService.get<IPapeletaInDB[]>(`${this.ticketPath}/active`);
  }

  getTicketById(id: string): Observable<IPapeletaInDB> {
    return this.apiService.get<IPapeletaInDB>(`${this.ticketPath}/${id}`);
  }

  createTicket(ticket: IPapeletaCreate): Observable<IPapeletaInDB> {
    return this.apiService.post<IPapeletaInDB>(this.ticketPath, ticket);
  }

  updateTicket(id: string, ticket: IPapeletaUpdate): Observable<IPapeletaInDB> {
    return this.apiService.put<IPapeletaInDB>(`${this.ticketPath}/${id}`, ticket);
  }

  softDeleteTicket(id: string): Observable<IPapeletaInDB> {
    return this.apiService.put<IPapeletaInDB>(`${this.ticketPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreTicket(id: string): Observable<IPapeletaInDB> {
    return this.apiService.put<IPapeletaInDB>(`${this.ticketPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
