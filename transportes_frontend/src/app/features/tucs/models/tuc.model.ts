export interface IRutaDesignadaTUC {
  ruta_id: string; // PydanticObjectId como string
  codigo_ruta: string;
  origen_ciudad: string;
  destino_ciudad: string;
}

export interface IHistorialEstadoTUC {
  estado: string;
  fecha?: Date | string | null;
  motivo?: string;
  usuario_id?: string; // PydanticObjectId como string
}

export interface ITUCBase {
  numero_tuc: string;
  numero_tuc_primigenia?: string;
  tipo_generacion: string;
  empresa_id: string; // PydanticObjectId como string
  ruc_empresa: string;
  razon_social_empresa: string;
  nombre_representante_legal?: string;
  vehiculo_id: string; // PydanticObjectId como string
  placa_vehiculo: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  anio_fabricacion_vehiculo: number;
  color_vehiculo?: string;
  categoria_vehiculo: string;
  carroceria_vehiculo?: string;
  clase_vehiculo?: string;
  combustible_vehiculo?: string;
  numero_motor_vehiculo?: string;
  numero_serie_vin_vehiculo?: string;
  num_asientos_vehiculo?: number;
  num_pasajeros_vehiculo?: number;
  cilindros_vehiculo?: number;
  ejes_vehiculo?: number;
  ruedas_vehiculo?: number;
  peso_bruto_vehiculo?: number;
  peso_neto_vehiculo?: number;
  carga_util_vehiculo?: number;
  largo_vehiculo?: number;
  ancho_vehiculo?: number;
  alto_vehiculo?: number;
  resolucion_origen_id: string; // PydanticObjectId como string
  numero_resolucion: string;
  fecha_resolucion: Date | string | null;
  tipo_resolucion: string;
  expediente_id: string; // PydanticObjectId como string
  numero_expediente: string;
  rutas_designadas: IRutaDesignadaTUC[];
  fecha_emision?: Date | string | null;
  fecha_vencimiento: Date | string | null;
  estado: string;
  motivo_estado?: string;
  observaciones_tuc?: string;
  historial_estados: IHistorialEstadoTUC[];
  origen_dato: string;
}

export interface ITUCCreate extends ITUCBase {}

export interface ITUCUpdate {
  numero_tuc?: string;
  numero_tuc_primigenia?: string;
  tipo_generacion?: string;
  empresa_id?: string;
  ruc_empresa?: string;
  razon_social_empresa?: string;
  nombre_representante_legal?: string;
  vehiculo_id?: string;
  placa_vehiculo?: string;
  marca_vehiculo?: string;
  modelo_vehiculo?: string;
  anio_fabricacion_vehiculo?: number;
  color_vehiculo?: string;
  categoria_vehiculo?: string;
  carroceria_vehiculo?: string;
  clase_vehiculo?: string;
  combustible_vehiculo?: string;
  numero_motor_vehiculo?: string;
  numero_serie_vin_vehiculo?: string;
  num_asientos_vehiculo?: number;
  num_pasajeros_vehiculo?: number;
  cilindros_vehiculo?: number;
  ejes_vehiculo?: number;
  ruedas_vehiculo?: number;
  peso_bruto_vehiculo?: number;
  peso_neto_vehiculo?: number;
  carga_util_vehiculo?: number;
  largo_vehiculo?: number;
  ancho_vehiculo?: number;
  alto_vehiculo?: number;
  resolucion_origen_id?: string;
  numero_resolucion?: string;
  fecha_resolucion?: Date;
  tipo_resolucion?: string;
  expediente_id?: string;
  numero_expediente?: string;
  rutas_designadas?: IRutaDesignadaTUC[];
  fecha_emision?: Date | string | null;
  fecha_vencimiento?: Date;
  estado?: string;
  motivo_estado?: string;
  observaciones_tuc?: string;
  historial_estados?: IHistorialEstadoTUC[];
  estado_logico?: string;
  origen_dato?: string;
}

export interface ITUCInDB extends ITUCBase {
  _id: string;
  creado_por_usuario_id?: string;
  fecha_creacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  estado_logico: string;
  origen_dato: string;
}
