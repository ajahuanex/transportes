export interface IDomicilio {
  calle?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  codigo_postal?: string;
}

export interface IRepresentanteLegal {
  dni?: string;
  nombres?: string;
  apellidos?: string;
}

export interface IInfoSunat {
  razon_social_sunat?: string;
  tipo_contribuyente?: string;
  fecha_inscripcion_sunat?: Date | string | null;
  estado_contribuyente_sunat?: string;
  condicion_contribuyente_sunat?: string;
  domicilio_fiscal_sunat?: IDomicilio;
  sistema_emision_comprobante?: string;
  sistema_contabilidad?: string;
  actividades_economicas: string[];
  comprobantes_pago_impresion: string[];
  sistema_emision_electronica?: string;
  emisor_electronico_desde?: Date | string | null;
  comprobantes_electronicos: string[];
  afiliado_ple_desde?: Date;
  padrones: string[];
  fecha_actualizacion_sunat?: Date | string | null;
}

export interface IEmpresaBase {
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  domicilio_legal?: IDomicilio;
  telefono?: string;
  email?: string;
  representante_legal?: IRepresentanteLegal;
  partida_registral?: string;
  estado_habilitacion_mtc: string;
  info_sunat?: IInfoSunat;
  origen_dato: string;
}

export interface IEmpresaCreate extends IEmpresaBase {}

export interface IEmpresaUpdate {
  ruc?: string;
  razon_social?: string;
  nombre_comercial?: string;
  domicilio_legal?: IDomicilio;
  telefono?: string;
  email?: string;
  representante_legal?: IRepresentanteLegal;
  partida_registral?: string;
  estado_habilitacion_mtc?: string;
  info_sunat?: IInfoSunat;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IEmpresaInDB extends IEmpresaBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
