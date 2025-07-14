export interface IReglaAntiguedadVehiculo {
  tipo_servicio: string;
  categoria_vehicular: string;
  edad_maxima_anios: number;
  notas?: string;
}

export interface IConfiguracionMTCBase {
  reglas_antiguedad: IReglaAntiguedadVehiculo[];
  observaciones?: string;
}

export interface IConfiguracionMTCCreate extends IConfiguracionMTCBase {}

export interface IConfiguracionMTCUpdate {
  reglas_antiguedad?: IReglaAntiguedadVehiculo[];
  observaciones?: string;
}

export interface IConfiguracionMTCInDB extends IConfiguracionMTCBase {
  _id: string; // El ID es un string fijo "permanencia_vehiculos"
  fecha_ultima_actualizacion: Date;
  actualizado_por_usuario_id?: string; // PydanticObjectId como string
}
