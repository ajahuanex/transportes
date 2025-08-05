import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container" [class]="'position-' + position">
      <div 
        *ngFor="let notification of notifications()" 
        class="notification"
        [class]="'notification-' + notification.type"
        [@slideIn]
      >
        <div class="notification-header">
          <div class="notification-icon">
            <i [class]="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button 
            class="notification-close" 
            (click)="removeNotification(notification.id)"
            aria-label="Cerrar notificación"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div *ngIf="notification.action" class="notification-actions">
          <button 
            class="btn btn-primary btn-sm"
            (click)="executeAction(notification)"
          >
            {{ notification.action.label }}
          </button>
        </div>
        
        <div 
          *ngIf="notification.duration && notification.duration > 0" 
          class="notification-progress"
          [style.animation-duration]="notification.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
    }

    .notification-container.position-top-right {
      top: 20px;
      right: 20px;
    }

    .notification-container.position-top-left {
      top: 20px;
      left: 20px;
    }

    .notification-container.position-bottom-right {
      bottom: 20px;
      right: 20px;
    }

    .notification-container.position-bottom-left {
      bottom: 20px;
      left: 20px;
    }

    .notification-container.position-top-center {
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    }

    .notification-container.position-bottom-center {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
    }

    .notification {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 10px;
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      position: relative;
      overflow: hidden;
      border-left: 4px solid;
    }

    .notification-success {
      border-left-color: #28a745;
    }

    .notification-error {
      border-left-color: #dc3545;
    }

    .notification-warning {
      border-left-color: #ffc107;
    }

    .notification-info {
      border-left-color: #17a2b8;
    }

    .notification-header {
      display: flex;
      align-items: flex-start;
      padding: 15px;
      gap: 12px;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
    }

    .notification-success .notification-icon {
      background: #28a745;
    }

    .notification-error .notification-icon {
      background: #dc3545;
    }

    .notification-warning .notification-icon {
      background: #ffc107;
      color: #212529;
    }

    .notification-info .notification-icon {
      background: #17a2b8;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 600;
      color: #212529;
      line-height: 1.2;
    }

    .notification-message {
      margin: 0;
      font-size: 13px;
      color: #6c757d;
      line-height: 1.4;
    }

    .notification-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .notification-close:hover {
      background: #f8f9fa;
      color: #495057;
    }

    .notification-actions {
      padding: 0 15px 15px 15px;
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: #007bff;
      animation: progress linear;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    /* Animaciones */
    .notification {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .notification-container {
        left: 10px;
        right: 10px;
        transform: none;
      }

      .notification {
        min-width: auto;
        max-width: none;
      }
    }
  `],
  animations: [
    // Aquí irían las animaciones si usáramos @angular/animations
  ]
})
export class NotificationToastComponent {
  private notificationService = inject(NotificationService);
  
  public readonly notifications = this.notificationService.currentNotifications;
  public readonly hasNotifications = this.notificationService.hasNotifications;
  
  // Configuración de posición
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';

  constructor() {
    // Configurar el servicio de notificaciones
    this.notificationService.configure({
      position: this.position,
      maxNotifications: 5,
      autoClose: true,
      autoCloseDelay: 5000
    });
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  executeAction(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check';
      case 'error':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-bell';
    }
  }
} 