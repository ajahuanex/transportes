export interface IDetalleAccidente {
  tipo_accidente: string;
  fecha_accidente: Date | string | null;
  ruta_accidente_id?: string; // PydanticObjectId como string
  codigo_ruta_accidente?: string;
  descripcion_detallada?: string;
  informe_policial_url?: string;
  afecta_operatividad: boolean;
}

export interface IHistorialVehiculoBase {
  vehiculo_id: string; // PydanticObjectId como string
  placa_vehiculo: string;
  tipo_evento: string;
  fecha_evento?: Date | string | null;
  resolucion_id?: string; // PydanticObjectId como string
  campo_modificado?: string;
  valor_anterior?: string;
  valor_nuevo?: string;
  detalle_accidente?: IDetalleAccidente;
  observaciones?: string;
  usuario_id?: string; // PydanticObjectId como string
  origen_dato: string;
}

export interface IHistorialVehiculoCreate extends IHistorialVehiculoBase {}

export interface IHistorialVehiculoUpdate {
  vehiculo_id?: string;
  placa_vehiculo?: string;
  tipo_evento?: string;
  fecha_evento?: Date | string | null;
  resolucion_id?: string;
  campo_modificado?: string;
  valor_anterior?: string;
  valor_nuevo?: string;
  detalle_accidente?: IDetalleAccidente;
  observaciones?: string;
  usuario_id?: string;
  origen_dato?: string;
}

export interface IHistorialVehiculoInDB extends IHistorialVehiculoBase {
  _id: string;
  origen_dato: string;
}
