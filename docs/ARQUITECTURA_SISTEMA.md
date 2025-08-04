# Arquitectura del Sistema DRTC Puno

## Objetivo General
Desarrollar un sistema de gestión integral para la DRTC Puno. El proyecto consta de un backend central en FastAPI, un front-end web en Angular 20 para el personal de oficina, y una aplicación móvil en Flutter para los fiscalizadores en campo.

## 1. Arquitectura del Sistema

### Backend
- **Tecnología**: Python 3.10+ con FastAPI
- **Función**: API RESTful único que dará servicio a ambos front-ends
- **Base de Datos**: MongoDB

### Front-ends
- **Web**: Angular 20 (personal de oficina)
- **Móvil**: Flutter (fiscalizadores en campo)

## 2. Lógica de Negocio y Reglas Clave

### Borrado Lógico
- Las entidades principales (empresas, vehiculos, conductores, rutas, terminales) no se eliminan permanentemente
- Se actualiza el campo `estaActivo` a `false`
- **Consistencia**: Al realizar un borrado lógico, las entidades asociadas deben ser desvinculadas, no eliminadas, para mantener la trazabilidad

### Vigencia de TUC
- Se calcula en función de la `fechaVigenciaFin` de la resolución que le dio origen
- Considera las normas de antigüedad del vehículo del MTC y su año de fabricación

### Estados de TUC
- **DADA_DE_BAJA**: Si un vehículo es dado de baja o deshabilitado de una empresa
- **DESECHADA**: Si se emite una TUC con datos erróneos (se registra la razón del descarte)

### Cambio de Placa
- La placa de un vehículo puede ser actualizada
- Se genera un registro de historial en `vehiculos_historial` indicando el cambio y las placas antigua y nueva

### Verificación por QR
- Cada TUC generada debe tener una URL única para su verificación pública
- La URL será codificada en un código QR

### Auditoría de Historial
- Todos los cambios importantes en las entidades principales se registrarán en colecciones de historial separadas
- Se incluye un historial de trámites para las empresas

### Dashboard y Reportes
- Las colecciones principales se mantendrán normalizadas para la integridad de los datos
- Para dashboard y reportes se utilizarán consultas de agregación o vistas de base de datos optimizadas

### Gestión de Sanciones e Infracciones
- Se utiliza la colección `infracciones` como catálogo central para todas las faltas
- Las actas de fiscalización (papeletas) harán referencia a estos catálogos para mantener consistencia

### Gestión Documentaria Centralizada
- Colección `documentos` para almacenar información de todos los archivos generados (PDFs, etc.)
- Las colecciones de resoluciones y tucs referenciarán el `documentoId` de esta colección

## 3. Modelos de Datos (MongoDB Schemas)

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

### Colecciones de Historial

#### vehiculos_historial
```json
{
  "_id": "ObjectId",
  "vehiculoId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "CAMBIO_EMPRESA" | "CAMBIO_ESTADO" | "DESVINCULACION" | "CAMBIO_PLACA",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

#### conductores_historial
```json
{
  "_id": "ObjectId",
  "conductorId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "ASOCIACION_EMPRESA" | "CAMBIO_LICENCIA" | "INFRACCION",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

#### expedientes_historial
```json
{
  "_id": "ObjectId",
  "expedienteId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "CAMBIO_ESTADO" | "ADJUNTAR_DOCUMENTO",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

#### empresas_historial
```json
{
  "_id": "ObjectId",
  "empresaId": "ObjectId",
  "fechaCambio": "Date",
  "tipoCambio": "APERTURA_TRAMITE" | "RESOLUCION_EMITIDA" | "CAMBIO_ESTADO",
  "detalles": { /* JSON con los campos anteriores y nuevos */ }
}
```

## 4. Requisitos de Código por Módulo

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

## 5. Estado Actual del Proyecto

### Completado ✅
- Estructura base del frontend Angular 20
- Módulo de Empresas (CRUD completo con soft delete)
- Módulo de Expedientes (CRUD completo con soft delete)
- Sistema de soft delete implementado
- Componente de selección de columnas
- Sistema de exportación de datos
- Git repository configurado

### Pendiente 🔄
- Backend FastAPI
- Aplicación móvil Flutter
- Módulos de Vehículos, Conductores, Rutas, Terminales
- Sistema de Resoluciones y TUCs
- Sistema de Fiscalizaciones e Infracciones
- Gestión de Documentos
- Sistema de Notificaciones
- Autenticación y Autorización
- Integración con APIs externas (RENIEC, SUNAT)
- Reportes y Dashboard avanzado

## 6. Próximos Pasos

1. **Desarrollar Backend FastAPI** con todos los modelos y endpoints
2. **Completar módulos del frontend** (Vehículos, Conductores, etc.)
3. **Implementar aplicación móvil Flutter**
4. **Integrar APIs externas**
5. **Implementar sistema de reportes**
6. **Configurar autenticación y autorización**
7. **Testing y optimización** 