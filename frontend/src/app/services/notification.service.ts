import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
  timestamp: Date;
}

export interface NotificationConfig {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private config: NotificationConfig = {
    position: 'top-right',
    maxNotifications: 5,
    autoClose: true,
    autoCloseDelay: 5000
  };

  // Signals para el estado de las notificaciones
  public readonly currentNotifications = this.notifications.asReadonly();
  public readonly hasNotifications = signal(false);

  constructor() {
    // Inicializar el estado
    this.updateNotificationState();
  }

  /**
   * Configurar el servicio de notificaciones
   */
  configure(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Mostrar notificación de éxito
   */
  success(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration: duration || this.config.autoCloseDelay
    });
  }

  /**
   * Mostrar notificación de error
   */
  error(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: duration || this.config.autoCloseDelay
    });
  }

  /**
   * Mostrar notificación de advertencia
   */
  warning(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: duration || this.config.autoCloseDelay
    });
  }

  /**
   * Mostrar notificación informativa
   */
  info(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration: duration || this.config.autoCloseDelay
    });
  }

  /**
   * Mostrar notificación personalizada
   */
  show(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    // Agregar la notificación
    const currentNotifications = this.notifications();
    const updatedNotifications = [fullNotification, ...currentNotifications];
    
    // Limitar el número máximo de notificaciones
    if (updatedNotifications.length > this.config.maxNotifications!) {
      updatedNotifications.splice(this.config.maxNotifications!);
    }

    this.notifications.set(updatedNotifications);
    this.updateNotificationState();

    // Auto-cerrar si está configurado
    if (this.config.autoClose && fullNotification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }

    return id;
  }

  /**
   * Remover notificación por ID
   */
  remove(id: string): void {
    const currentNotifications = this.notifications();
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.set(updatedNotifications);
    this.updateNotificationState();
  }

  /**
   * Limpiar todas las notificaciones
   */
  clear(): void {
    this.notifications.set([]);
    this.updateNotificationState();
  }

  /**
   * Mostrar confirmación (reemplaza confirm())
   */
  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const id = this.show({
        type: 'warning',
        title,
        message,
        duration: 0, // No auto-cerrar
        action: {
          label: 'Confirmar',
          callback: () => {
            this.remove(id);
            resolve(true);
          }
        }
      });

      // Agregar botón de cancelar
      setTimeout(() => {
        const currentNotifications = this.notifications();
        const notification = currentNotifications.find(n => n.id === id);
        if (notification) {
          notification.action = {
            label: 'Cancelar',
            callback: () => {
              this.remove(id);
              resolve(false);
            }
          };
          this.notifications.set([...currentNotifications]);
        }
      }, 100);
    });
  }

  /**
   * Mostrar prompt (reemplaza prompt())
   */
  prompt(title: string, message: string, defaultValue: string = ''): Promise<string> {
    return new Promise((resolve) => {
      // Implementación simplificada - en una aplicación real usarías un modal
      const result = window.prompt(message, defaultValue);
      resolve(result || '');
    });
  }

  /**
   * Notificaciones específicas para el módulo de transportes
   */
  
  // Notificaciones de expedientes
  expedienteCreado(numero: string): void {
    this.success(
      'Expediente Creado',
      `El expediente ${numero} ha sido creado exitosamente.`
    );
  }

  expedienteActualizado(numero: string): void {
    this.success(
      'Expediente Actualizado',
      `El expediente ${numero} ha sido actualizado exitosamente.`
    );
  }

  expedienteEliminado(numero: string): void {
    this.warning(
      'Expediente Eliminado',
      `El expediente ${numero} ha sido movido a la papelera. Puede restaurarlo desde la sección de eliminados.`
    );
  }

  expedienteRestaurado(numero: string): void {
    this.success(
      'Expediente Restaurado',
      `El expediente ${numero} ha sido restaurado exitosamente.`
    );
  }

  // Notificaciones de vehículos
  vehiculoRegistrado(placa: string): void {
    this.success(
      'Vehículo Registrado',
      `El vehículo con placa ${placa} ha sido registrado exitosamente.`
    );
  }

  vehiculoActualizado(placa: string): void {
    this.success(
      'Vehículo Actualizado',
      `El vehículo con placa ${placa} ha sido actualizado exitosamente.`
    );
  }

  vehiculoEliminado(placa: string): void {
    this.warning(
      'Vehículo Eliminado',
      `El vehículo con placa ${placa} ha sido movido a la papelera.`
    );
  }

  // Notificaciones de conductores
  conductorRegistrado(nombre: string): void {
    this.success(
      'Conductor Registrado',
      `El conductor ${nombre} ha sido registrado exitosamente.`
    );
  }

  conductorActualizado(nombre: string): void {
    this.success(
      'Conductor Actualizado',
      `El conductor ${nombre} ha sido actualizado exitosamente.`
    );
  }

  conductorEliminado(nombre: string): void {
    this.warning(
      'Conductor Eliminado',
      `El conductor ${nombre} ha sido movido a la papelera.`
    );
  }

  // Notificaciones de empresas
  empresaRegistrada(nombre: string): void {
    this.success(
      'Empresa Registrada',
      `La empresa ${nombre} ha sido registrada exitosamente.`
    );
  }

  empresaActualizada(nombre: string): void {
    this.success(
      'Empresa Actualizada',
      `La empresa ${nombre} ha sido actualizada exitosamente.`
    );
  }

  empresaEliminada(nombre: string): void {
    this.warning(
      'Empresa Eliminada',
      `La empresa ${nombre} ha sido movida a la papelera.`
    );
  }

  // Notificaciones de vencimientos
  documentoVencimiento(documento: string, fecha: string): void {
    this.warning(
      'Documento por Vencer',
      `El documento ${documento} vence el ${fecha}. Por favor, actualice la documentación.`
    );
  }

  documentoVencido(documento: string): void {
    this.error(
      'Documento Vencido',
      `El documento ${documento} ha vencido. Es necesario actualizar la documentación inmediatamente.`
    );
  }

  // Notificaciones de errores
  errorConexion(): void {
    this.error(
      'Error de Conexión',
      'No se pudo conectar con el servidor. Verifique su conexión a internet.'
    );
  }

  errorValidacion(campo: string): void {
    this.error(
      'Error de Validación',
      `El campo "${campo}" contiene información incorrecta. Por favor, verifique los datos.`
    );
  }

  errorPermisos(): void {
    this.error(
      'Sin Permisos',
      'No tiene permisos para realizar esta acción. Contacte al administrador.'
    );
  }

  // Métodos privados
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private updateNotificationState(): void {
    this.hasNotifications.set(this.notifications().length > 0);
  }
} 