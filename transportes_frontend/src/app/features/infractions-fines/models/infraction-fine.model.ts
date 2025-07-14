export interface IInfraccionMultaBase {
  numero_infraccion: string;
  fecha_infraccion?: Date | string | null;
  tipo_infraccion: string;
  codigo_infraccion: string;
  descripcion_infraccion: string;
  monto_multa: number;
  moneda: string;
  empresa_responsable_id: string; // PydanticObjectId como string
  ruc_empresa_responsable: string;
  vehiculo_involucrado_id?: string; // PydanticObjectId como string
  placa_vehiculo_involucrado?: string;
  conductor_involucrado_id?: string; // PydanticObjectId como string
  dni_conductor_involucrado?: string;
  autoridad_emisora: string;
  estado_multa: string;
  fecha_notificacion?: Date | string | null;
  fecha_pago?: Date | string | null;
  monto_pagado?: number;
  observaciones_multa?: string;
  origen_dato: string;
}

export interface IInfraccionMultaCreate extends IInfraccionMultaBase {}

export interface IInfraccionMultaUpdate {
  numero_infraccion?: string;
  fecha_infraccion?: Date | string | null;
  tipo_infraccion?: string;
  codigo_infraccion?: string;
  descripcion_infraccion?: string;
  monto_multa?: number;
  moneda?: string;
  empresa_responsable_id?: string;
  ruc_empresa_responsable?: string;
  vehiculo_involucrado_id?: string;
  placa_vehiculo_involucrado?: string;
  conductor_involucrado_id?: string;
  dni_conductor_involucrado?: string;
  autoridad_emisora?: string;
  estado_multa?: string;
  fecha_notificacion?: Date | string | null;
  fecha_pago?: Date | string | null;
  monto_pagado?: number;
  observaciones_multa?: string;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IInfraccionMultaInDB extends IInfraccionMultaBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
