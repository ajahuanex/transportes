# Contexto del Proyecto DRTC Puno Frontend

## Última Actualización
Domingo, 13 de julio de 2025

## Estado Actual del Proyecto

### Frontend (Angular)
- Repositorio Git inicializado y subido a GitHub (`transportes_frontend`).
- Componentes CRUD existentes para:
  - Usuarios
  - Empresas
  - Rutas
  - Vehículos (restaurados a un estado básico).
- Uso de Angular CLI 20.1.0.
- Configurado para usar SCSS.
- Angular Material instalado y configurado.
- **Implementación completa de CRUD para las siguientes entidades:**
  - Usuarios
  - Empresas
  - Expedientes
  - Resoluciones
  - Rutas
  - Vehículos
  - Historial de Vehículos
  - TUCs
  - Conductores
  - Terminales Terrestres
  - Infracciones y Multas
  - Configuración MTC
  - Papeletas
- **Adopción de Enfoque Moderno de Angular 20:**
  - Componentes `standalone` utilizados para todos los nuevos componentes CRUD.
  - Nueva sintaxis de control flow (`@if`, `@for`) implementada en las plantillas.
  - Uso de `signals` para la reactividad en los componentes.
  - Manejo consistente de tipos de fecha (`Date | string | null`) en las interfaces y formularios para compatibilidad con el backend.

### Integración con Backend
- La API del backend está disponible en `https://github.com/ajahuanex/transportes_backend`.
- El servicio `api.ts` es la base para las llamadas HTTP.

## Próximos Pasos Acordados
- Documentar el progreso y las decisiones específicas del frontend en este archivo `GEMINI.md`.
- Continuar con la integración del CRUD del backend con el frontend, entidad por entidad, siguiendo el patrón de componentes y servicios existente.
- Priorizar la restauración y mejora de los componentes de Vehículos.

## Notas Importantes
- Para el contexto general del proyecto y la API del backend, consultar el `GEMINI.md` en el repositorio del backend.