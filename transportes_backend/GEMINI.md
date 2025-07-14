# Contexto del Proyecto DRTC Puno API

## Última Actualización
Domingo, 13 de julio de 2025

## Estado Actual del Proyecto

### Backend (FastAPI)
- Repositorio Git inicializado.
- Archivo `.gitignore` configurado para ignorar archivos temporales, entornos virtuales y el repositorio Git del frontend.
- Primer commit realizado con la estructura inicial del proyecto.
- Endpoints CRUD para las siguientes entidades:
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
- **Refactorización de Endpoints:**
  - Orden de rutas corregido para evitar conflictos (rutas específicas antes que generales).
  - Implementación de soft delete y restauración a través de peticiones `PUT` para todas las entidades aplicables, eliminando endpoints `DELETE` y `POST /restore` dedicados.
  - Campo `estado_logico` añadido a la entidad `Resoluciones` para permitir soft delete.

### Frontend (Angular)
- Repositorio Git separado (ignorado por el backend).
- Componentes CRUD existentes para:
  - Usuarios
  - Empresas
  - Rutas
  - Vehículos (restaurados a un estado básico después de intentos de modernización).

## Próximos Pasos Acordados
- Documentar el progreso y las decisiones en este archivo `GEMINI.md`.
- Utilizar Git para el control de versiones de forma consistente.
- Continuar con la integración del CRUD del backend con el frontend, entidad por entidad, siguiendo el patrón existente.