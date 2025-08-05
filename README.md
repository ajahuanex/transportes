# 🚛 DRTC Puno - Sistema de Gestión de Transportes

Sistema web moderno para la gestión integral de empresas de transporte, expedientes, vehículos y conductores en la Dirección Regional de Transportes y Comunicaciones de Puno.

## ✨ Características Principales

### 🏢 Módulo de Empresas
- **CRUD completo** de empresas de transporte
- **Soft delete** para preservar historial de auditoría
- **Filtros avanzados** y búsqueda por múltiples criterios
- **Columnas personalizables** en tablas
- **Exportación de datos** en múltiples formatos
- **Gestión de expedientes** asociados a empresas
- **Información detallada** de representantes legales

### 📋 Módulo de Expedientes
- **Gestión completa** de expedientes de trámites
- **Seguimiento de estados** con historial detallado
- **Documentos adjuntos** y observaciones
- **Filtros colapsibles** para optimizar espacio
- **Búsqueda general** por número, tipo, trámite, solicitante
- **Estados de prioridad** y fechas límite
- **Restauración** de expedientes eliminados

### 🚗 Módulo de Vehículos
- **Registro de vehículos** con información técnica
- **Gestión de documentos** y licencias
- **Historial de mantenimiento**
- **Asociación con empresas** y conductores
- **Validación de formato de placa** (XXX-NNN)
- **Jerarquía de relaciones** (Empresa → Resolución → Vehículo)

### 👨‍💼 Módulo de Conductores
- **Registro de conductores** con datos personales
- **Gestión de licencias** y documentos
- **Historial de infracciones**
- **Asociación con vehículos**

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Angular 17
- **Lenguaje:** TypeScript
- **Estilos:** SCSS
- **Arquitectura:** Componentes Standalone
- **Estado:** Angular Signals
- **Formularios:** Reactive Forms
- **Rutas:** Lazy Loading
- **Detección de cambios:** OnPush Strategy

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          # Dashboard principal
│   │   │   ├── empresas/           # Módulo de empresas
│   │   │   │   ├── empresa-form/   # Formulario de empresa
│   │   │   │   ├── empresa-detail/ # Detalle de empresa
│   │   │   │   └── empresas-eliminadas/ # Empresas eliminadas
│   │   │   ├── expedientes/        # Módulo de expedientes
│   │   │   │   ├── expediente-form/    # Formulario de expediente
│   │   │   │   ├── expediente-detail/  # Detalle de expediente
│   │   │   │   └── expedientes-eliminados/ # Expedientes eliminados
│   │   │   ├── vehiculos/          # Módulo de vehículos
│   │   │   │   ├── vehiculo-form/  # Formulario de vehículo
│   │   │   │   ├── vehiculo-detail/ # Detalle de vehículo
│   │   │   │   └── vehiculos-eliminados/ # Vehículos eliminados
│   │   │   ├── conductores/        # Módulo de conductores
│   │   │   │   ├── conductor-form/ # Formulario de conductor
│   │   │   │   ├── conductor-detail/ # Detalle de conductor
│   │   │   │   └── conductores-eliminados/ # Conductores eliminados
│   │   │   ├── layout/             # Layout principal
│   │   │   └── shared/             # Componentes compartidos
│   │   ├── models/                 # Interfaces TypeScript
│   │   ├── services/               # Servicios de datos
│   │   └── shared/                 # Utilidades compartidas
│   └── styles.scss                 # Estilos globales
├── package.json
└── angular.json

backend/
├── app/
│   ├── api/                        # API endpoints
│   ├── core/                       # Configuración y utilidades
│   └── main.py                     # Punto de entrada
├── requirements.txt
└── Dockerfile
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Python 3.8+ (para backend)

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/ajahuanex/transportes.git
cd transportes
```

2. **Instalar dependencias del frontend:**
```bash
cd frontend
npm install
```

3. **Instalar dependencias del backend:**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **Ejecutar en modo desarrollo:**

**Frontend:**
```bash
cd frontend
npm start
```

**Backend:**
```bash
cd backend
python main.py
```

5. **Abrir en el navegador:**
```
http://localhost:4200
```

### Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Linting del código

## 📊 Funcionalidades Avanzadas

### 🔍 Sistema de Filtros
- **Filtros básicos:** Búsqueda por texto
- **Filtros avanzados:** Múltiples criterios combinables
- **Filtros colapsibles:** Optimización de espacio en pantalla
- **Persistencia:** Filtros se mantienen entre navegaciones

### 📤 Exportación de Datos
- **Formatos soportados:** CSV, Excel (simulado), PDF (simulado)
- **Columnas personalizables:** Selección de campos a exportar
- **Filtros aplicados:** Solo exporta datos filtrados
- **Nombres de archivo:** Automáticos con fecha

### 🎨 Personalización de Tablas
- **Columnas configurables:** Mostrar/ocultar columnas
- **Ordenamiento:** Por cualquier columna
- **Paginación:** Configurable por página
- **Responsive:** Adaptable a diferentes pantallas

## 🔐 Seguridad y Auditoría

### Soft Delete
- **Eliminación lógica:** Los datos nunca se borran físicamente
- **Historial completo:** Fechas, usuarios y motivos de eliminación
- **Restauración:** Posibilidad de restaurar datos eliminados
- **Auditoría:** Trazabilidad completa de cambios

### Información de Auditoría
- **Fechas de creación/modificación**
- **Usuarios responsables**
- **Versiones de datos**
- **Historial de cambios**

## 🧪 Datos de Prueba

El sistema incluye datos mock completos para:
- **Empresas:** 10 empresas de ejemplo
- **Expedientes:** 15 expedientes con diferentes estados
- **Vehículos:** 20 vehículos de ejemplo
- **Conductores:** 15 conductores de ejemplo

## 🔄 Estado del Desarrollo

### ✅ Completado
- [x] Arquitectura base del proyecto
- [x] Módulo de Empresas (CRUD completo)
- [x] Módulo de Expedientes (CRUD completo)
- [x] Módulo de Vehículos (CRUD completo)
- [x] Módulo de Conductores (CRUD completo)
- [x] Sistema de filtros y búsqueda
- [x] Exportación de datos
- [x] Soft delete y auditoría
- [x] Diseño responsive
- [x] Formularios reactivos
- [x] Validaciones de formato
- [x] Jerarquía de relaciones

### 🚧 En Desarrollo
- [ ] Sistema de notificaciones
- [ ] Autenticación y autorización
- [ ] Integración completa con backend

### 📋 Pendiente
- [ ] Tests unitarios y de integración
- [ ] Documentación de API
- [ ] Optimización de performance
- [ ] PWA (Progressive Web App)
- [ ] Reportes avanzados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## 📚 Documentación

- [Arquitectura del Sistema](docs/ARQUITECTURA_SISTEMA.md) - Documentación técnica y arquitectura del proyecto
- [Reglas del Proyecto DRTC](docs/REGLAS_PROYECTO_DRTC.md) - Reglas de negocio, modelos de datos y convenciones del proyecto
- [Guía de Desarrollo](CONTINUAR_DESARROLLO.md) - Guía para continuar el desarrollo del proyecto

## 📞 Contacto

**DRTC Puno** - Dirección Regional de Transportes y Comunicaciones de Puno

---

**Versión:** 1.2.2  
**Última actualización:** Enero 2025  
**Estado:** En desarrollo activo
