import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IEmpresaInDB, IEmpresaCreate, IEmpresaUpdate } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private companyPath = '/empresas';

  constructor(private apiService: ApiService) { }

  getAllCompanies(): Observable<IEmpresaInDB[]> {
    return this.apiService.get<IEmpresaInDB[]>(this.companyPath);
  }

  getAllActiveCompanies(): Observable<IEmpresaInDB[]> {
    return this.apiService.get<IEmpresaInDB[]>(`${this.companyPath}/active`);
  }

  getCompanyById(id: string): Observable<IEmpresaInDB> {
    return this.apiService.get<IEmpresaInDB>(`${this.companyPath}/${id}`);
  }

  createCompany(company: IEmpresaCreate): Observable<IEmpresaInDB> {
    return this.apiService.post<IEmpresaInDB>(this.companyPath, company);
  }

  updateCompany(id: string, company: IEmpresaUpdate): Observable<IEmpresaInDB> {
    return this.apiService.put<IEmpresaInDB>(`${this.companyPath}/${id}`, company);
  }

  softDeleteCompany(id: string): Observable<IEmpresaInDB> {
    return this.apiService.put<IEmpresaInDB>(`${this.companyPath}/${id}`, { estado_logico: 'ELIMINADO' });
  }

  restoreCompany(id: string): Observable<IEmpresaInDB> {
    return this.apiService.put<IEmpresaInDB>(`${this.companyPath}/${id}`, { estado_logico: 'ACTIVO' });
  }
}
