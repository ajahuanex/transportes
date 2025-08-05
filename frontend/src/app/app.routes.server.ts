import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parámetros - usar renderizado dinámico
  {
    path: 'empresas/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'empresas/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'expedientes/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'expedientes/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehiculos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehiculos/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'conductores/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'conductores/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'rutas/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'rutas/:id/editar',
    renderMode: RenderMode.Server
  },
  // Todas las demás rutas - usar prerendering
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
