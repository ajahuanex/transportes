export interface IUbicacion {
  latitud?: number;
  longitud?: number;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
}

export interface ITerminalTerrestreBase {
  nombre: string;
  ubicacion?: IUbicacion;
  tipo_infraestructura_complementaria: string[];
  empresas_usuarios: string[]; // PydanticObjectId como string
  capacidad_andenes?: number;
  administrador?: string;
  telefono?: string;
  email?: string;
  origen_dato: string;
}

export interface ITerminalTerrestreCreate extends ITerminalTerrestreBase {}

export interface ITerminalTerrestreUpdate {
  nombre?: string;
  ubicacion?: IUbicacion;
  tipo_infraestructura_complementaria?: string[];
  empresas_usuarios?: string[];
  capacidad_andenes?: number;
  administrador?: string;
  telefono?: string;
  email?: string;
  estado_logico?: string;
  origen_dato?: string;
}

export interface ITerminalTerrestreInDB extends ITerminalTerrestreBase {
  _id: string;
  fecha_creacion: Date;
  creado_por_usuario_id?: string;
  fecha_ultima_modificacion: Date;
  ultima_modificacion_por_usuario_id?: string;
  estado_logico: string;
  origen_dato: string;
}
