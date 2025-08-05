import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotificationToastComponent } from '../../shared/components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NotificationToastComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  
  private router = inject(Router);
  
  // Signals para el estado del componente
  sidebarCollapsed = signal(false);
  userMenuOpen = signal(false);
  notificationCount = signal(3);
  pageTitle = signal('Dashboard');

  // Computed properties
  isSidebarCollapsed = computed(() => this.sidebarCollapsed());
  isUserMenuOpen = computed(() => this.userMenuOpen());
  currentNotificationCount = computed(() => this.notificationCount());
  currentPageTitle = computed(() => this.pageTitle());

  private pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/empresas': 'Gestión de Empresas',
    '/vehiculos': 'Gestión de Vehículos',
    '/conductores': 'Gestión de Conductores',
    '/rutas': 'Gestión de Rutas',
    '/expedientes': 'Gestión de Expedientes',
    '/resoluciones': 'Gestión de Resoluciones',
    '/tucs': 'Gestión de TUCs',
    '/reportes': 'Reportes',
    '/notificaciones': 'Notificaciones'
  };

  ngOnInit(): void {
    // Escuchar cambios de ruta para actualizar el título
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.pageTitle.set(this.pageTitles[event.url] || 'Dashboard');
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(open => !open);
  }

  toggleNotifications(): void {
    // TODO: Implementar panel de notificaciones
    console.log('Abrir notificaciones');
  }

  // Cerrar menús cuando se hace clic fuera
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen.set(false);
    }
  }
} 