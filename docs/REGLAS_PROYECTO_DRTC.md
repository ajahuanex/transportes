# Reglas del Proyecto DRTC Puno

## Información del Proyecto

### Objetivo General
Desarrollar un sistema de gestión integral para la DRTC Puno. El proyecto consta de un backend central en FastAPI, un front-end web en Angular 20 para el personal de oficina, y una aplicación móvil en Flutter para los fiscalizadores en campo.

### Arquitectura del Sistema
- **Backend**: Python 3.10+ con FastAPI (API RESTful único)
- **Base de Datos**: MongoDB
- **Front-end Web**: Angular 20 (personal de oficina)
- **Front-end Móvil**: Flutter (fiscalizadores en campo)

## Reglas de Negocio Clave

### 1. Borrado Lógico
- **Regla**: Las entidades principales (empresas, vehiculos, conductores, rutas, terminales) NO se eliminan permanentemente
- **Implementación**: Se actualiza el campo `estaActivo` a `false`
- **Consistencia**: Al realizar un borrado lógico, las entidades asociadas deben ser DESVINCULADAS, no eliminadas, para mantener la trazabilidad

### 2. Vigencia de TUC
- **Cálculo**: Se basa en la `fechaVigenciaFin` de la resolución que le dio origen
- **Consideraciones**: Normas de antigüedad del vehículo del MTC y año de fabricación

### 3. Estados de TUC
- **DADA_DE_BAJA**: Si un vehículo es dado de baja o deshabilitado de una empresa
- **DESECHADA**: Si se emite una TUC con datos erróneos (se registra la razón del descarte)

### 4. Cambio de Placa
- **Permitido**: La placa de un vehículo puede ser actualizada
- **Registro**: Se genera un registro de historial en `vehiculos_historial` indicando el cambio y las placas antigua y nueva

### 5. Verificación por QR
- **Requerido**: Cada TUC generada debe tener una URL única para su verificación pública
- **Implementación**: La URL será codificada en un código QR

### 6. Auditoría de Historial
- **Obligatorio**: Todos los cambios importantes en las entidades principales se registrarán en colecciones de historial separadas
- **Incluye**: Historial de trámites para las empresas

### 7. Dashboard y Reportes
- **Normalización**: Las colecciones principales se mantendrán normalizadas para la integridad de los datos
- **Optimización**: Para dashboard y reportes se utilizarán consultas de agregación o vistas de base de datos optimizadas

### 8. Gestión de Sanciones e Infracciones
- **Catálogo Central**: Se utiliza la colección `infracciones` como catálogo central para todas las faltas
- **Consistencia**: Las actas de fiscalización (papeletas) harán referencia a estos catálogos para mantener consistencia

### 9. Gestión Documentaria Centralizada
- **Colección Única**: Colección `documentos` para almacenar información de todos los archivos generados (PDFs, etc.)
- **Referencias**: Las colecciones de resoluciones y tucs referenciarán el `documentoId` de esta colección

## Modelos de Datos (MongoDB Schemas)

### empresas
```json
{
  "_id": "ObjectId",
  "ruc": "20123456789",
  "razonSocial": { 
    "principal": "Transportes El Veloz S.A.C.", 
    "sunat": "...", 
    "minimo": "..." 
  },
  "direccionFiscal": "Av. El Sol 123, Puno",
  "estado": "HABILITADA",
  "estaActivo": true,
  "fechaRegistro": "Date",
  "representanteLegal": { "dni": "...", "nombres": "..." }
}
```

### vehiculos
```json
{
  "_id": "ObjectId",
  "placa": "V1A-123",
  "empresaActualId": "ObjectId",
  "rutaId": "ObjectId",
  "categoria": "M3",
  "marca": "Mercedes-Benz",
  "anioFabricacion": 2018,
  "estado": "ACTIVO",
  "estaActivo": true,
  "tuc": { "nroTuc": "T-123456-2025", "fechaEmision": "Date" },
  "datosTecnicos": {
    "motor": "Diesel Euro 4",
    "chasis": "A123-B456-C789",
    "ejes": 2,
    "asientos": 30,
    "pesoNeto": 5000,
    "pesoBruto": 12000,
    "medidas": { "largo": 10.5, "ancho": 2.5, "alto": 3.2 }
  }
}
```

### conductores
```json
{
  "_id": "ObjectId",
  "dni": "40123456",
  "nombres": "Juan Carlos",
  "apellidos": "Perez Quispe",
  "licencia": { /* ... */ },
  "estado": "HABILITADO",
  "estaActivo": true,
  "empresasAsociadasIds": ["ObjectId"]
}
```

### rutas
```json
{
  "_id": "ObjectId",
  "codigoRuta": "PUN-JUL-01",
  "nombre": "Puno - Juliaca",
  "origen": "Puno",
  "destino": "Juliaca",
  "estado": "ACTIVA",
  "estaActivo": true
}
```

### expedientes
```json
{
  "_id": "ObjectId",
  "nroExpediente": "E-1234-2025",
  "tipoTramite": "RENOVACION_HABILITACION_VEHICULAR",
  "estado": "EN_EVALUACION",
  "estaActivo": true,
  "resolucionFinalId": "ObjectId"
}
```

### resoluciones
```json
{
  "_id": "ObjectId",
  "nroResolucion": "R-1234-2025-DRTC-PUNO",
  "empresaId": "ObjectId",
  "fechaEmision": "Date",
  "fechaVigenciaInicio": "Date",
  "fechaVigenciaFin": "Date",
  "tipoResolucion": "PADRE" | "HIJO",
  "resolucionPadreId": "ObjectId | null",
  "tipoTramite": "HABILITACION_VEHICULAR" | "INCREMENTO" | "SUSTITUCION",
  "descripcion": "Descripción detallada de la resolución.",
  "expedienteId": "ObjectId",
  "documentoId": "ObjectId",
  "estaActivo": true
}
```

### tucs
```json
{
  "_id": "ObjectId",
  "vehiculoId": "ObjectId",
  "empresaId": "ObjectId",
  "resolucionPadreId": "ObjectId",
  "nroTuc": "T-123456-2025",
  "fechaEmision": "Date",
  "estado": "VIGENTE" | "DADA_DE_BAJA" | "DESECHADA",
  "razonDescarte": "string | null",
  "estaActivo": true,
  "documentoId": "ObjectId",
  "qrVerificationUrl": "string"
}
```

### infracciones
```json
{
  "_id": "ObjectId",
  "codigo": "I-01",
  "descripcion": "Exceso de velocidad",
  "montoMulta": 500,
  "normativa": "Decreto Supremo...",
  "estaActivo": true
}
```

### fiscalizaciones
```json
{
  "_id": "ObjectId",
  "fechaHora": "Date",
  "inspector": { "id": "ObjectId", "nombre": "..." },
  "vehiculoInspeccionado": { "placa": "...", "id": "ObjectId" },
  "resultado": "CON_INFRACCION" | "SIN_INFRACCION",
  "estaActivo": true,
  "papeleta": {
    "nroPapeleta": "P-123456",
    "infraccionesIds": ["ObjectId"],
    "observaciones": "Comentarios adicionales.",
    "montoTotal": 500,
    "estado": "EMITIDA" | "PAGADA" | "IMPUGNADA"
  }
}
```

### documentos
```json
{
  "_id": "ObjectId",
  "nombreArchivo": "Resolucion_R-1234.pdf",
  "url": "url_al_pdf",
  "tipoDocumento": "RESOLUCION" | "TUC" | "CERTIFICADO",
  "entidadAsociadaId": "ObjectId",
  "fechaSubida": "Date",
  "usuarioSubidaId": "ObjectId",
  "estaActivo": true
}
```

### usuarios
```json
{
  "_id": "ObjectId",
  "dni": "40123456",
  "nombres": "Juan",
  "apellidos": "Perez",
  "email": "jperez@drtc.gob.pe",
  "rolId": "admin",
  "passwordHash": "String",
  "estaActivo": true
}
```

### notificaciones
```json
{
  "_id": "ObjectId",
  "destinatarioId": "ObjectId",
  "asunto": "Notificación de Papeleta de Infracción",
  "contenido": "Se ha generado la papeleta N°...",
  "fechaEnvio": "Date",
  "fechaLectura": "Date",
  "tipoDestinatario": "EMPRESA" | "USUARIO",
  "estaActivo": true
}
```

### interoperatividad
```json
{
  "_id": "ObjectId",
  "fecha": "Date",
  "servicioOrigen": "RENIEC",
  "entidadConsultada": "CONDUCTOR",
  "idEntidad": "ObjectId",
  "datosConsultados": { /* JSON de la respuesta de la API externa */ },
  "estadoConsulta": "EXITOSA" | "FALLIDA"
}
```

### terminales
```json
{
  "_id": "ObjectId",
  "nombre": "Terminal Terrestre Puno",
  "direccion": "Av. Costanera s/n",
  "estaActivo": true
}
```

## Colecciones de Historial

### vehiculos_historial
```json
{
  "_id": "ObjectId",
  "vehiculoId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "CAMBIO_EMPRESA" | "CAMBIO_ESTADO" | "DESVINCULACION" | "CAMBIO_PLACA",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

### conductores_historial
```json
{
  "_id": "ObjectId",
  "conductorId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "ASOCIACION_EMPRESA" | "CAMBIO_LICENCIA" | "INFRACCION",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

### expedientes_historial
```json
{
  "_id": "ObjectId",
  "expedienteId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "CAMBIO_ESTADO" | "ADJUNTAR_DOCUMENTO",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

### empresas_historial
```json
{
  "_id": "ObjectId",
  "empresaId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "APERTURA_TRAMITE" | "RESOLUCION_EMITIDA" | "CAMBIO_ESTADO",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

## Requisitos de Código por Módulo

### Backend (FastAPI)
- **Estructura**: Modular, con un main.py y routers separados
- **Funcionalidad**: 
  - Implementar todos los endpoints CRUD con la lógica de borrado lógico
  - Implementar la lógica de generación de TUCs, reportes y el endpoint público de verificación de TUC por QR
  - Agregar la lógica de persistencia de historiales al modificar las entidades principales
  - Implementar endpoints para la colección de terminales y resoluciones

### Front-end Web (Angular 20)
- **Estructura**: Proyecto de Angular 20 con layout principal
- **Componentes iniciales**:
  - Dashboard principal
  - Componentes de lista con filtros y búsqueda
  - Interfaz de gestión de usuarios y roles
  - Interfaz para el envío y consulta de notificaciones
  - Lógica para mostrar y descargar el código QR de una TUC
  - Vistas para consultar los historiales de vehiculos, conductores y empresas
  - Interfaz de gestión de terminales y resoluciones

### Front-end Móvil (Flutter)
- **Estructura**: Proyecto de Flutter
- **Vistas iniciales**:
  - Pantalla de inicio de sesión
  - Pantalla de búsqueda para vehículos y conductores
  - Formulario para crear un acta de fiscalización
  - Lógica para escanear códigos QR y navegar al endpoint de verificación

## Reglas de Desarrollo

### 1. Soft Delete Obligatorio
- TODAS las entidades principales deben implementar borrado lógico
- NUNCA eliminar registros permanentemente
- Mantener trazabilidad completa

### 2. Historial de Cambios
- Registrar TODOS los cambios importantes en colecciones de historial
- Incluir detalles completos de cambios (valores anteriores y nuevos)
- Mantener auditoría completa

### 3. Validaciones de Negocio
- Implementar todas las reglas de negocio en el backend
- Validar consistencia de datos antes de cualquier operación
- Manejar errores de manera apropiada

### 4. Seguridad
- Implementar autenticación JWT
- Validar permisos en cada endpoint
- Registrar todas las operaciones para auditoría

### 5. Performance
- Usar índices apropiados en MongoDB
- Implementar paginación en todas las listas
- Optimizar consultas de agregación para reportes

### 6. Integración
- Implementar integración con RENIEC y SUNAT
- Manejar errores de APIs externas
- Registrar todas las consultas externas

## Estados y Enums Importantes

### Estados de Empresa
- `HABILITADA`
- `SUSPENDIDA`
- `CANCELADA`

### Estados de Vehículo
- `ACTIVO`
- `MANTENIMIENTO`
- `SUSPENDIDO`
- `BAJA`

### Estados de Conductor
- `HABILITADO`
- `SUSPENDIDO`
- `VENCIDO`

### Estados de TUC
- `VIGENTE`
- `DADA_DE_BAJA`
- `DESECHADA`

### Estados de Expediente
- `EN_EVALUACION`
- `APROBADO`
- `RECHAZADO`
- `OBSERVADO`

### Tipos de Resolución
- `PADRE`
- `HIJO`

### Tipos de Trámite
- `HABILITACION_VEHICULAR`
- `INCREMENTO`
- `SUSTITUCION`
- `RENOVACION_HABILITACION_VEHICULAR`

## Convenciones de Nomenclatura

### Base de Datos
- Colecciones en minúsculas y plural: `empresas`, `vehiculos`, `conductores`
- Campos en camelCase: `fechaRegistro`, `representanteLegal`
- IDs como `ObjectId`

### API Endpoints
- RESTful: `/api/v1/empresas`, `/api/v1/vehiculos`
- Verbos HTTP apropiados: GET, POST, PUT, DELETE
- Parámetros de consulta: `?page=1&limit=10&estado=ACTIVO`

### Código
- Python: snake_case para variables y funciones
- TypeScript: camelCase para variables y funciones, PascalCase para clases
- Constantes: UPPER_SNAKE_CASE

## Consideraciones de Seguridad

### Autenticación
- JWT tokens con expiración
- Refresh tokens para renovación
- Logout seguro

### Autorización
- Roles granulares: `admin`, `inspector`, `funcionario`
- Permisos por módulo y acción
- Validación en frontend y backend

### Auditoría
- Log de todas las operaciones
- Registro de intentos de acceso
- Trazabilidad de cambios

### Datos Sensibles
- Encriptar contraseñas
- Proteger datos personales
- Cumplir con normativas de protección de datos 