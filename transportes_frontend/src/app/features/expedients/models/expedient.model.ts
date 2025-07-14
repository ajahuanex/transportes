export interface IDocumentoAdjunto {
  nombre_documento: string;
  url: string;
  fecha_carga?: Date | string | null;
}

export interface IInformeTecnico {
  numero_informe: string;
  fecha_emision?: Date | string | null;
  autor_usuario_id: string; // PydanticObjectId se convierte a string
  resumen_informe?: string;
  documento_url?: string;
  estado: string;
}

export interface IOpinionLegal {
  numero_opinion: string;
  fecha_emision?: Date | string | null;
  autor_usuario_id: string; // PydanticObjectId se convierte a string
  resumen_opinion?: string;
  documento_url?: string;
  estado: string;
}

export interface IObservacionHistorial {
  fecha?: Date | string | null;
  descripcion: string;
  usuario_responsable_id?: string; // PydanticObjectId se convierte a string
}

export interface IExpedienteBase {
  numero_expediente: string;
  empresa_solicitante_id: string; // PydanticObjectId se convierte a string
  tipo_tramite: string;
  fecha_inicio_tramite?: Date | string | null;
  estado_expediente: string;
  resumen_solicitud?: string;
  numero_folios?: number;
  documentos_adjuntos: IDocumentoAdjunto[];
  informes_tecnicos: IInformeTecnico[];
  opiniones_legales: IOpinionLegal[];
  resoluciones_asociadas: string[]; // Lista de PydanticObjectId como string
  observaciones_historial: IObservacionHistorial[];
  fecha_cierre_expediente?: Date | string | null;
  origen_dato: string;
}

export interface IExpedienteCreate extends IExpedienteBase {}

export interface IExpedienteUpdate {
  numero_expediente?: string;
  empresa_solicitante_id?: string;
  tipo_tramite?: string;
  fecha_inicio_tramite?: Date | string | null;
  estado_expediente?: string;
  resumen_solicitud?: string;
  numero_folios?: number;
  documentos_adjuntos?: IDocumentoAdjunto[];
  informes_tecnicos?: IInformeTecnico[];
  opiniones_legales?: IOpinionLegal[];
  resoluciones_asociadas?: string[];
  observaciones_historial?: IObservacionHistorial[];
  fecha_cierre_expediente?: Date | string | null;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IExpedienteInDB extends IExpedienteBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
