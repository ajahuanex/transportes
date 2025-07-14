export interface IVehiculoBase {
  placa: string;
  empresa_id: string; // PydanticObjectId como string
  resoluciones_asociadas: string[]; // Lista de PydanticObjectId como string
  resolucion_primigenia_id?: string; // PydanticObjectId como string
  tucs_asociadas: string[]; // Lista de PydanticObjectId como string
  rutas_autorizadas: string[]; // Lista de PydanticObjectId como string
  tipo_servicio_principal: string;
  estado_vehiculo_mtc: string;
  documento_baja_url?: string;
  partida_registral_vehicular?: string;
  marca: string;
  modelo: string;
  anio_fabricacion: number;
  color?: string;
  categoria: string;
  carroceria?: string;
  clase?: string;
  combustible?: string;
  numero_motor?: string;
  numero_serie_chasis?: string;
  num_asientos?: number;
  capacidad_pasajeros?: number;
  cilindros?: number;
  ejes?: number;
  ruedas?: number;
  peso_bruto_vehicular?: number;
  peso_neto?: number;
  carga_util?: number;
  largo?: number;
  ancho?: number;
  alto?: number;
  observaciones?: string;
  fecha_ultima_revision_tecnica?: Date | string | null;
  fecha_vencimiento_revision_tecnica?: Date | string | null;
  estado_logico: string;
  origen_dato: string;
}

export interface IVehiculoCreate extends IVehiculoBase {}

export interface IVehiculoUpdate {
  placa?: string;
  empresa_id?: string;
  resoluciones_asociadas?: string[];
  resolucion_primigenia_id?: string;
  tucs_asociadas?: string[];
  rutas_autorizadas?: string[];
  tipo_servicio_principal?: string;
  estado_vehiculo_mtc?: string;
  documento_baja_url?: string;
  partida_registral_vehicular?: string;
  marca?: string;
  modelo?: string;
  anio_fabricacion?: number;
  color?: string;
  categoria?: string;
  carroceria?: string;
  clase?: string;
  combustible?: string;
  numero_motor?: string;
  numero_serie_chasis?: string;
  num_asientos?: number;
  capacidad_pasajeros?: number;
  cilindros?: number;
  ejes?: number;
  ruedas?: number;
  peso_bruto_vehicular?: number;
  peso_neto?: number;
  carga_util?: number;
  largo?: number;
  ancho?: number;
  alto?: number;
  observaciones?: string;
  fecha_ultima_revision_tecnica?: Date | string | null;
  fecha_vencimiento_revision_tecnica?: Date | string | null;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IVehiculoInDB extends IVehiculoBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
