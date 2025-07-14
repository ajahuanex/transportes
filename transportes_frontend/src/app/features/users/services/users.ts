import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IUsuarioInDB, IUsuarioCreate, IUsuarioUpdate } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userPath = '/usuarios';

  constructor(private apiService: ApiService) { }

  getAllUsers(): Observable<IUsuarioInDB[]> {
    return this.apiService.get<IUsuarioInDB[]>(this.userPath);
  }

  getAllActiveUsers(): Observable<IUsuarioInDB[]> {
    return this.apiService.get<IUsuarioInDB[]>(`${this.userPath}/active`);
  }

  getUserById(id: string): Observable<IUsuarioInDB> {
    return this.apiService.get<IUsuarioInDB>(`${this.userPath}/${id}`);
  }

  createUser(user: IUsuarioCreate): Observable<IUsuarioInDB> {
    return this.apiService.post<IUsuarioInDB>(this.userPath, user);
  }

  updateUser(id: string, user: IUsuarioUpdate): Observable<IUsuarioInDB> {
    return this.apiService.put<IUsuarioInDB>(`${this.userPath}/${id}`, user);
  }

  softDeleteUser(id: string): Observable<IUsuarioInDB> {
    return this.apiService.put<IUsuarioInDB>(`${this.userPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreUser(id: string): Observable<IUsuarioInDB> {
    return this.apiService.put<IUsuarioInDB>(`${this.userPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
