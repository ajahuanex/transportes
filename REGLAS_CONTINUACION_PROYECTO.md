# 🚀 REGLAS DE CONTINUACIÓN DEL PROYECTO DRTC

## 📋 **INFORMACIÓN DEL PROYECTO**

- **Repositorio:** https://github.com/ajahuanex/transportes
- **Tecnologías:** Angular 17/20, TypeScript, SCSS, FastAPI (backend)
- **Arquitectura:** Standalone Components, Signals, Reactive Forms
- **Estado Actual:** Sistema de configuraciones implementado ✅

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Jerarquía de Entidades DRTC:**
```
Empresa → Resolución (PADRE) → Resolución (HIJO) → Vehículo → TUC
```

### **Módulos Implementados:**
- ✅ **Empresas** - Gestión de empresas de transporte
- ✅ **Vehículos** - Gestión de vehículos y sus estados
- ✅ **Conductores** - Gestión de conductores y licencias
- ✅ **Rutas** - Gestión de rutas de transporte
- ✅ **Expedientes** - Gestión de expedientes administrativos
- ✅ **Resoluciones** - Gestión de resoluciones (padre/hijo)
- ✅ **TUCs** - Gestión de Tarjetas Únicas de Circulación
- ✅ **Configuraciones** - Sistema centralizado de configuraciones
- ⏳ **Reportes** - Sistema de reportes (pendiente)
- ⏳ **Sistema** - Configuraciones generales del sistema

---

## 🔧 **SISTEMAS IMPLEMENTADOS**

### **1. Sistema de Notificaciones** 📢
```typescript
// Servicio: frontend/src/app/services/notification.service.ts
// Componente: frontend/src/app/shared/components/notification-toast/

// Uso en componentes:
private notificationService = inject(NotificationService);

// Notificaciones específicas:
this.notificationService.vehiculoRegistrado(placa);
this.notificationService.error('Error', 'Mensaje de error');
this.notificationService.confirm('Título', 'Mensaje');
```

### **2. Sistema de Validación** ✅
```typescript
// Servicio: frontend/src/app/services/validation.service.ts

// Validadores específicos DRTC:
ValidationService.placaValidator        // XXX-NNN
ValidationService.documentoValidator    // DNI, RUC, CE
ValidationService.telefonoValidator     // 9 dígitos
ValidationService.anioFabricacionValidator // 1900-actual+1
ValidationService.resolucionValidator  // R-001-2023-GR-DRTC-P
ValidationService.expedienteValidator  // EXP-001-2023-DRTC
ValidationService.licenciaValidator    // A1-00123456
ValidationService.tucValidator         // TUC-001-2023

// Uso en formularios:
placa: ['', [Validators.required, ValidationService.placaValidator]]
```

### **3. Sistema de Configuraciones** ⚙️
```typescript
// Modelo: frontend/src/app/models/configuracion.model.ts
// Servicio: frontend/src/app/services/configuracion.service.ts

// Enums principales:
ModuloSistema.EMPRESAS | VEHICULOS | CONDUCTORES | RUTAS | EXPEDIENTES | RESOLUCIONES | TUCS
TipoConfiguracion.ESTADO | CATEGORIA | TIPO | CLASIFICACION | PARAMETRO

// Estados por módulo:
EstadoEmpresa: HABILITADA | SUSPENDIDA | CANCELADA
EstadoVehiculo: ACTIVO | MANTENIMIENTO | SUSPENDIDO | BAJA
EstadoConductor: HABILITADO | SUSPENDIDO | VENCIDO
EstadoTUC: VIGENTE | DADA_DE_BAJA | DESECHADA
EstadoExpediente: EN_EVALUACION | APROBADO | RECHAZADO | OBSERVADO
```

---

## 🎨 **CONVENCIONES DE CÓDIGO**

### **Nomenclatura:**
- **Archivos:** kebab-case (`vehiculo-form.component.ts`)
- **Clases:** PascalCase (`VehiculoFormComponent`)
- **Variables/Métodos:** camelCase (`cargarVehiculos()`)
- **Constantes:** UPPER_SNAKE_CASE (`ESTADO_ACTIVO`)
- **Enums:** PascalCase (`EstadoVehiculo`)

### **Estructura de Componentes:**
```typescript
@Component({
  selector: 'app-nombre-componente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nombre-componente.html',
  styleUrls: ['./nombre-componente.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NombreComponente implements OnInit {
  // 1. Inyección de servicios
  private servicio = inject(Servicio);
  
  // 2. Signals
  datos = signal<Interface[]>([]);
  cargando = signal(false);
  
  // 3. Computed properties
  currentDatos = computed(() => this.datos());
  isLoading = computed(() => this.cargando());
  
  // 4. Lifecycle
  ngOnInit(): void {
    this.cargarDatos();
  }
  
  // 5. Métodos públicos
  // 6. Métodos privados
}
```

### **Estructura de Servicios:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class NombreService {
  // Métodos CRUD
  getItems(): Observable<Response>
  getItem(id: string): Observable<Item>
  createItem(item: CreateRequest): Observable<Item>
  updateItem(id: string, item: UpdateRequest): Observable<Item>
  deleteItem(id: string): Observable<void>
  
  // Métodos específicos del dominio
  getItemsByFiltro(filtro: Filter): Observable<Response>
  exportarItems(filtros: Filter): Observable<Blob>
}
```

---

## 📁 **ESTRUCTURA DE ARCHIVOS**

```
frontend/src/app/
├── components/           # Componentes de UI
│   ├── configuraciones/ # Sistema de configuraciones
│   ├── dashboard/       # Dashboard principal
│   ├── empresas/        # Gestión de empresas
│   ├── vehiculos/       # Gestión de vehículos
│   ├── conductores/     # Gestión de conductores
│   ├── rutas/          # Gestión de rutas
│   ├── expedientes/    # Gestión de expedientes
│   ├── resoluciones/   # Gestión de resoluciones
│   ├── tucs/          # Gestión de TUCs
│   └── layout/         # Layout principal
├── models/             # Interfaces y tipos
│   ├── base.model.ts   # Entidad base
│   ├── configuracion.model.ts # Sistema de configuraciones
│   └── [modulo].model.ts # Modelos por módulo
├── services/           # Servicios de datos
│   ├── notification.service.ts # Sistema de notificaciones
│   ├── validation.service.ts  # Sistema de validación
│   ├── configuracion.service.ts # Sistema de configuraciones
│   └── [modulo].service.ts # Servicios por módulo
└── shared/            # Componentes compartidos
    └── components/
        └── notification-toast/ # Componente de notificaciones
```

---

## 🔄 **FLUJO DE TRABAJO**

### **Para agregar un nuevo módulo:**

1. **Crear el modelo** (`models/[modulo].model.ts`)
2. **Crear el servicio** (`services/[modulo].service.ts`)
3. **Crear los componentes** (`components/[modulo]/`)
4. **Agregar rutas** en `app.routes.ts`
5. **Actualizar el layout** con el nuevo menú
6. **Agregar configuraciones** si es necesario

### **Para modificar un módulo existente:**

1. **Actualizar el modelo** si cambian las interfaces
2. **Actualizar el servicio** si cambian las operaciones
3. **Actualizar los componentes** según los cambios
4. **Actualizar configuraciones** si se agregan nuevos estados/tipos

---

## 🎯 **PRÓXIMAS MEJORAS PRIORITARIAS**

### **1. Autenticación y Autorización** 🔐
```typescript
// Implementar:
- JWT Authentication
- Role-based Authorization
- Guards de ruta
- Interceptors para tokens
- Servicio de autenticación
```

### **2. Integración con Backend** 🔗
```typescript
// Conectar con FastAPI:
- Configurar environment variables
- Implementar HTTP interceptors
- Manejo de errores de red
- Caching de datos
```

### **3. Mejoras de UX/UI** 🎨
```typescript
// Implementar:
- Animaciones y transiciones
- Modo oscuro/claro
- Responsive design mejorado
- Loading states
- Error boundaries
```

### **4. Optimización de Performance** ⚡
```typescript
// Implementar:
- Lazy loading mejorado
- Virtual scrolling para listas grandes
- Memoización de computed properties
- Bundle optimization
```

---

## 🛠️ **COMANDOS ÚTILES**

### **Desarrollo:**
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Build de producción
npm run build

# Ejecutar tests
npm test
```

### **Git:**
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# Push a GitHub
git push origin main

# Pull de cambios
git pull origin main
```

---

## 📝 **CONVENCIONES DE COMMITS**

```bash
# Formato: tipo(scope): descripción

feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de formato
refactor: refactorización de código
test: agregar tests
chore: tareas de mantenimiento

# Ejemplos:
feat(vehiculos): agregar validación de placa
fix(configuraciones): corregir filtro por módulo
docs(readme): actualizar instrucciones de instalación
```

---

## 🚨 **PUNTOS IMPORTANTES**

### **Validaciones DRTC:**
- **Placas:** Formato XXX-NNN (alfanumérico-números)
- **Documentos:** DNI (8), RUC (11), CE (9-12)
- **Teléfonos:** 9 dígitos
- **Años:** Entre 1900 y año actual + 1
- **Resoluciones:** R-001-2023-GR-DRTC-P
- **Expedientes:** EXP-001-2023-DRTC
- **Licencias:** A1-00123456
- **TUCs:** TUC-001-2023

### **Relaciones Jerárquicas:**
- **Vehículo** → **Resolución** (directa)
- **Vehículo** → **Empresa** (a través de Resolución)
- **TUC** → **Vehículo** (directa)

### **Estados por Módulo:**
- Cada módulo tiene sus propios estados
- Los estados tienen colores e iconos específicos
- Se pueden configurar desde el módulo de configuraciones

---

## 📞 **CONTACTO Y SOPORTE**

- **Repositorio:** https://github.com/ajahuanex/transportes
- **Email:** ajahuana@hotmail.com
- **Estado:** En desarrollo activo

---

## ✅ **CHECKLIST PARA NUEVA MÁQUINA**

- [ ] Clonar repositorio: `git clone https://github.com/ajahuanex/transportes`
- [ ] Instalar Node.js (versión 18+)
- [ ] Instalar dependencias: `npm install`
- [ ] Verificar que el proyecto compile: `npm start`
- [ ] Revisar que todos los módulos funcionen
- [ ] Configurar IDE con TypeScript y Angular
- [ ] Revisar documentación de reglas
- [ ] ¡Listo para continuar desarrollo! 🚀

---

**Última actualización:** $(date)
**Versión del proyecto:** Sistema de configuraciones implementado ✅
**Próximo hito:** Autenticación y autorización 🔐 