export interface IVehiculoAfectado {
  vehiculo_id: string; // PydanticObjectId como string
  placa: string;
  accion: string;
}

export interface IRutaAfectada {
  ruta_id: string; // PydanticObjectId como string
  codigo_ruta: string;
  accion: string;
}

export interface IResolucionBase {
  numero_resolucion: string;
  expediente_origen_id: string; // PydanticObjectId como string
  resolucion_asociada_anterior_id?: string; // PydanticObjectId como string
  resolucion_primigenia_id?: string; // PydanticObjectId como string
  tipo_tramite: string;
  fecha_emision?: Date | string | null;
  fecha_inicio_vigencia?: Date | string | null;
  anios_vigencia?: number;
  fecha_fin_vigencia?: Date | string | null;
  empresa_afectada_id: string; // PydanticObjectId como string
  ruc_empresa_afectada: string;
  vehiculos_afectados: IVehiculoAfectado[];
  rutas_afectadas: IRutaAfectada[];
  observaciones?: string;
  estado_resolucion: string;
  origen_dato: string;
}

export interface IResolucionCreate extends IResolucionBase {}

export interface IResolucionUpdate {
  numero_resolucion?: string;
  expediente_origen_id?: string;
  resolucion_asociada_anterior_id?: string;
  resolucion_primigenia_id?: string;
  tipo_tramite?: string;
  fecha_emision?: Date | string | null;
  fecha_inicio_vigencia?: Date | string | null;
  anios_vigencia?: number;
  fecha_fin_vigencia?: Date | string | null;
  empresa_afectada_id?: string;
  ruc_empresa_afectada?: string;
  vehiculos_afectados?: IVehiculoAfectado[];
  rutas_afectadas?: IRutaAfectada[];
  observaciones?: string;
  estado_resolucion?: string;
  estado_logico?: string; // Añadido para soft delete
  origen_dato?: string;
}

export interface IResolucionInDB extends IResolucionBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
