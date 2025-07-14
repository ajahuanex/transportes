export interface ILicenciaConducir {
  numero?: string;
  clase_categoria?: string;
  fecha_emision?: Date | string | null;
  fecha_vencimiento?: Date | string | null;
  puntos?: number;
}

export interface IUsuarioBase {
  username: string;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  roles: string[];
  licencia_conducir?: ILicenciaConducir;
  origen_dato: string;
}

export interface IUsuarioCreate extends IUsuarioBase {
  password?: string; // Contraseña en texto plano para la creación
}

export interface IUsuarioUpdate {
  username?: string;
  password?: string;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  roles?: string[];
  licencia_conducir?: ILicenciaConducir;
  estado_logico?: string;
  origen_dato?: string;
}

export interface IUsuarioInDB extends IUsuarioBase {
  _id: string; // Mapea _id de MongoDB a '_id'
  fecha_creacion: Date;
  creado_por_usuario_id?: string; // PydanticObjectId se convierte a string
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string; // PydanticObjectId se convierte a string
  estado_logico: string;
  origen_dato: string;
}