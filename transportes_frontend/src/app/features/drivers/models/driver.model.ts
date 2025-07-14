export interface ILicenciaConducirConductor {
  numero: string;
  clase_categoria: string;
  fecha_emision: Date | string | null;
  fecha_vencimiento: Date | string | null;
  puntos?: number;
}

export interface IEmpresaAsociadaConductor {
  empresa_id: string; // PydanticObjectId como string
  fecha_inicio: Date | string | null;
  fecha_fin?: Date | string | null;
  cargo?: string;
}

export interface IConductorBase {
  dni: string;
  nombres: string;
  apellidos: string;
  licencia_conducir: ILicenciaConducirConductor;
  fecha_nacimiento?: Date | string | null;
  telefono?: string;
  email?: string;
  empresas_asociadas: IEmpresaAsociadaConductor[];
  estado_habilitacion_mtc: string;
  origen_dato: string;
}

export interface IConductorCreate extends IConductorBase {}

export interface IConductorUpdate {
  dni?: string;
  nombres?: string;
  apellidos?: string;
  licencia_conducir?: ILicenciaConducirConductor;
  fecha_nacimiento?: Date | string | null;
  telefono?: string;
  email?: string;
  empresas_asociadas?: IEmpresaAsociadaConductor[];
  estado_habilitacion_mtc?: string;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IConductorInDB extends IConductorBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
