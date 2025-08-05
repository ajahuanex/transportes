import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Dashboard - DRTC Puno' },
      
      // Rutas de Empresas
      { path: 'empresas', loadComponent: () => import('./components/empresas/empresas').then(m => m.EmpresasComponent), title: 'Gestión de Empresas - DRTC Puno' },
      { path: 'empresas/nueva', loadComponent: () => import('./components/empresas/empresa-form/empresa-form').then(m => m.EmpresaFormComponent), title: 'Nueva Empresa - DRTC Puno' },
      { 
        path: 'empresas/:id', 
        loadComponent: () => import('./components/empresas/empresa-detail/empresa-detail').then(m => m.EmpresaDetailComponent), 
        title: 'Detalles de Empresa - DRTC Puno'
      },
      { 
        path: 'empresas/:id/editar', 
        loadComponent: () => import('./components/empresas/empresa-form/empresa-form').then(m => m.EmpresaFormComponent), 
        title: 'Editar Empresa - DRTC Puno'
      },
      { 
        path: 'empresas/eliminadas', 
        loadComponent: () => import('./components/empresas/empresas-eliminadas/empresas-eliminadas').then(m => m.EmpresasEliminadasComponent), 
        title: 'Empresas Eliminadas - DRTC Puno'
      },
      
      // Rutas de Expedientes
      { path: 'expedientes', loadComponent: () => import('./components/expedientes/expedientes').then(m => m.ExpedientesComponent), title: 'Gestión de Expedientes - DRTC Puno' },
      { path: 'expedientes/nuevo', loadComponent: () => import('./components/expedientes/expediente-form/expediente-form').then(m => m.ExpedienteFormComponent), title: 'Nuevo Expediente - DRTC Puno' },
      { 
        path: 'expedientes/:id', 
        loadComponent: () => import('./components/expedientes/expediente-detail/expediente-detail').then(m => m.ExpedienteDetailComponent), 
        title: 'Detalles de Expediente - DRTC Puno'
      },
      { 
        path: 'expedientes/:id/editar', 
        loadComponent: () => import('./components/expedientes/expediente-form/expediente-form').then(m => m.ExpedienteFormComponent), 
        title: 'Editar Expediente - DRTC Puno'
      },
      { 
        path: 'expedientes/eliminados', 
        loadComponent: () => import('./components/expedientes/expedientes-eliminados/expedientes-eliminados').then(m => m.ExpedientesEliminadosComponent), 
        title: 'Expedientes Eliminados - DRTC Puno'
      },
      
      // Rutas de Vehículos
      { path: 'vehiculos', loadComponent: () => import('./components/vehiculos/vehiculos').then(m => m.VehiculosComponent), title: 'Gestión de Vehículos - DRTC Puno' },
      { path: 'vehiculos/nuevo', loadComponent: () => import('./components/vehiculos/vehiculo-form/vehiculo-form').then(m => m.VehiculoFormComponent), title: 'Nuevo Vehículo - DRTC Puno' },
      { 
        path: 'vehiculos/:id', 
        loadComponent: () => import('./components/vehiculos/vehiculo-detail/vehiculo-detail').then(m => m.VehiculoDetailComponent), 
        title: 'Detalles de Vehículo - DRTC Puno'
      },
      { 
        path: 'vehiculos/:id/editar', 
        loadComponent: () => import('./components/vehiculos/vehiculo-form/vehiculo-form').then(m => m.VehiculoFormComponent), 
        title: 'Editar Vehículo - DRTC Puno'
      },
      { 
        path: 'vehiculos/eliminados', 
        loadComponent: () => import('./components/vehiculos/vehiculos-eliminados/vehiculos-eliminados').then(m => m.VehiculosEliminadosComponent), 
        title: 'Vehículos Eliminados - DRTC Puno'
      },
      // Rutas de Conductores
      { path: 'conductores', loadComponent: () => import('./components/conductores/conductores').then(m => m.ConductoresComponent), title: 'Gestión de Conductores - DRTC Puno' },
      { path: 'conductores/nuevo', loadComponent: () => import('./components/conductores/conductor-form/conductor-form').then(m => m.ConductorFormComponent), title: 'Nuevo Conductor - DRTC Puno' },
      { 
        path: 'conductores/:id', 
        loadComponent: () => import('./components/conductores/conductor-detail/conductor-detail').then(m => m.ConductorDetailComponent), 
        title: 'Detalles de Conductor - DRTC Puno'
      },
      { 
        path: 'conductores/:id/editar', 
        loadComponent: () => import('./components/conductores/conductor-form/conductor-form').then(m => m.ConductorFormComponent), 
        title: 'Editar Conductor - DRTC Puno'
      },
      { 
        path: 'conductores/eliminados', 
        loadComponent: () => import('./components/conductores/conductores-eliminados/conductores-eliminados').then(m => m.ConductoresEliminadosComponent), 
        title: 'Conductores Eliminados - DRTC Puno'
      },
      
      // Rutas de Rutas
      { path: 'rutas', loadComponent: () => import('./components/rutas/rutas').then(m => m.RutasComponent), title: 'Gestión de Rutas - DRTC Puno' },
      { path: 'rutas/nueva', loadComponent: () => import('./components/rutas/ruta-form/ruta-form').then(m => m.RutaFormComponent), title: 'Nueva Ruta - DRTC Puno' },
      { 
        path: 'rutas/:id', 
        loadComponent: () => import('./components/rutas/ruta-detail/ruta-detail').then(m => m.RutaDetailComponent), 
        title: 'Detalles de Ruta - DRTC Puno'
      },
      { 
        path: 'rutas/:id/editar', 
        loadComponent: () => import('./components/rutas/ruta-form/ruta-form').then(m => m.RutaFormComponent), 
        title: 'Editar Ruta - DRTC Puno'
      },
      { 
        path: 'rutas/eliminadas', 
        loadComponent: () => import('./components/rutas/rutas-eliminadas/rutas-eliminadas').then(m => m.RutasEliminadasComponent), 
        title: 'Rutas Eliminadas - DRTC Puno'
      },
      
      // Rutas de Resoluciones
      { path: 'resoluciones', loadComponent: () => import('./components/resoluciones/resoluciones').then(m => m.ResolucionesComponent), title: 'Gestión de Resoluciones - DRTC Puno' },
      
      // Rutas de TUCs
      { path: 'tucs', loadComponent: () => import('./components/tucs/tucs').then(m => m.TUCsComponent), title: 'Gestión de TUCs - DRTC Puno' },
      
      // Rutas de Configuraciones
      { path: 'configuraciones', loadComponent: () => import('./components/configuraciones/configuraciones').then(m => m.ConfiguracionesComponent), title: 'Configuraciones del Sistema - DRTC Puno' },
      
      { path: 'reportes', loadComponent: () => import('./components/vehiculos/vehiculos').then(m => m.VehiculosComponent), title: 'Reportes - DRTC Puno' },
      { path: 'notificaciones', loadComponent: () => import('./components/vehiculos/vehiculos').then(m => m.VehiculosComponent), title: 'Notificaciones - DRTC Puno' },
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];
