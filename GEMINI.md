# Contexto General del Proyecto DRTC Puno

## Última Actualización
Domingo, 13 de julio de 2025

## Descripción General
Este repositorio contiene el monorepo para el sistema de gestión DRTC Puno, que incluye un backend desarrollado con FastAPI (Python) y un frontend desarrollado con Angular.

## Estructura del Monorepo
- `transportes_backend/`: Contiene el código fuente del API RESTful.
- `transportes_frontend/`: Contiene el código fuente de la aplicación web Angular.

## Estado Actual del Proyecto

### Backend (FastAPI)
- Entorno de desarrollo configurado.
- Dependencias instaladas.
- Conexión a MongoDB y Redis establecida.
- Endpoints CRUD para las entidades principales implementados.
- Para más detalles, consultar `transportes_backend/GEMINI.md`.

### Frontend (Angular)
- Proyecto Angular inicializado con Angular CLI 20.1.0.
- Configurado para usar SCSS.
- Angular Material instalado y configurado.
- **¡IMPORTANTE: Se está siguiendo un enfoque moderno de Angular 20!**
  - **Nomenclatura de Archivos:** Los nombres de archivos de servicios y otros artefactos tienden a ser más concisos (ej., `users.ts` en lugar de `users.service.ts`).
  - **Control Flow (`@if`, `@for`, `@switch`):** Se prefiere el nuevo control flow incorporado en las plantillas de Angular (ej., `@if` en lugar de `*ngIf`) para una mayor eficiencia y legibilidad.
  - **Signals:** El uso de Signals es el enfoque preferido para la reactividad y la gestión de estado, ofreciendo un rendimiento más eficiente y una mejor experiencia de desarrollo.
- Para más detalles, consultar `transportes_frontend/GEMINI.md`.

## Próximos Pasos Acordados
- Continuar con la integración del CRUD del backend con el frontend, entidad por entidad.
- Implementar la lógica de negocio y las características adicionales según los requisitos.
- Mantener la documentación actualizada en los respectivos archivos `GEMINI.md`.

## Notas Importantes
- Asegurarse de que MongoDB y Redis estén en funcionamiento antes de iniciar el backend.
- La URL de la API del backend es `http://127.0.0.1:8000/api/v1`.