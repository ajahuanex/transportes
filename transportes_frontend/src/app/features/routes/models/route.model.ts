export interface IPuntoRuta {
  ciudad: string;
  departamento: string;
  terminal_id?: string; // PydanticObjectId como string
}

export interface IFrecuenciaRuta {
  dia_semana: string;
  hora_salida: string;
  hora_llegada_estimada?: string;
}

export interface IRutaBase {
  codigo_ruta: string;
  origen: IPuntoRuta;
  destino: IPuntoRuta;
  puntos_intermedios: string[];
  distancia_km?: number;
  tiempo_estimado_horas?: number;
  frecuencias: IFrecuenciaRuta[];
  tipo_servicio: string;
  empresa_autorizada_id: string; // PydanticObjectId como string
  ruc_empresa_autorizada: string;
  resolucion_autorizacion_id?: string; // PydanticObjectId como string
  numero_resolucion_autorizacion: string;
  estado_ruta_mtc: string;
  observaciones?: string;
  origen_dato: string;
}

export interface IRutaCreate extends IRutaBase {}

export interface IRutaUpdate {
  codigo_ruta?: string;
  origen?: IPuntoRuta;
  destino?: IPuntoRuta;
  puntos_intermedios?: string[];
  distancia_km?: number;
  tiempo_estimado_horas?: number;
  frecuencias?: IFrecuenciaRuta[];
  tipo_servicio?: string;
  empresa_autorizada_id?: string;
  ruc_empresa_autorizada?: string;
  resolucion_autorizacion_id?: string;
  numero_resolucion_autorizacion?: string;
  estado_ruta_mtc?: string;
  observaciones?: string;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IRutaInDB extends IRutaBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
