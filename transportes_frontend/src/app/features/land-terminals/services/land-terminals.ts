import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ITerminalTerrestreInDB, ITerminalTerrestreCreate, ITerminalTerrestreUpdate } from '../models/land-terminal.model';

@Injectable({
  providedIn: 'root'
})
export class LandTerminalsService {
  private terminalPath = '/terminales-terrestres';

  constructor(private apiService: ApiService) { }

  getAllLandTerminals(): Observable<ITerminalTerrestreInDB[]> {
    return this.apiService.get<ITerminalTerrestreInDB[]>(this.terminalPath);
  }

  getAllActiveLandTerminals(): Observable<ITerminalTerrestreInDB[]> {
    return this.apiService.get<ITerminalTerrestreInDB[]>(`${this.terminalPath}/active`);
  }

  getLandTerminalById(id: string): Observable<ITerminalTerrestreInDB> {
    return this.apiService.get<ITerminalTerrestreInDB>(`${this.terminalPath}/${id}`);
  }

  createLandTerminal(terminal: ITerminalTerrestreCreate): Observable<ITerminalTerrestreInDB> {
    return this.apiService.post<ITerminalTerrestreInDB>(this.terminalPath, terminal);
  }

  updateLandTerminal(id: string, terminal: ITerminalTerrestreUpdate): Observable<ITerminalTerrestreInDB> {
    return this.apiService.put<ITerminalTerrestreInDB>(`${this.terminalPath}/${id}`, terminal);
  }

  softDeleteLandTerminal(id: string): Observable<ITerminalTerrestreInDB> {
    return this.apiService.put<ITerminalTerrestreInDB>(`${this.terminalPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreLandTerminal(id: string): Observable<ITerminalTerrestreInDB> {
    return this.apiService.put<ITerminalTerrestreInDB>(`${this.terminalPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
