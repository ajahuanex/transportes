import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { IConfiguracionMTCInDB, IConfiguracionMTCCreate, IConfiguracionMTCUpdate } from '../models/mtc-config.model';

@Injectable({
  providedIn: 'root'
})
export class MtcConfigsService {
  private configPath = '/configuracion-mtc';
  private configId = 'permanencia_vehiculos'; // ID fijo para la configuración MTC

  constructor(private apiService: ApiService) { }

  // Obtener la configuración MTC (siempre por su ID fijo)
  getMtcConfig(): Observable<IConfiguracionMTCInDB> {
    return this.apiService.get<IConfiguracionMTCInDB>(`${this.configPath}/${this.configId}`);
  }

  // Crear configuración MTC (solo si no existe, el backend lo manejará)
  createMtcConfig(config: IConfiguracionMTCCreate): Observable<IConfiguracionMTCInDB> {
    return this.apiService.post<IConfiguracionMTCInDB>(this.configPath, config);
  }

  // Actualizar configuración MTC (siempre por su ID fijo)
  updateMtcConfig(config: IConfiguracionMTCUpdate): Observable<IConfiguracionMTCInDB> {
    return this.apiService.put<IConfiguracionMTCInDB>(`${this.configPath}/${this.configId}`, config);
  }

  // No hay soft delete ni restore para esta entidad, ya que es una configuración única.
}
