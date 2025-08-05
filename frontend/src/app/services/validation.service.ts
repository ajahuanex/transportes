import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface ValidationRule {
  name: string;
  validator: (control: AbstractControl) => ValidationErrors | null;
  message: string;
}

export interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidators?: ValidationRule[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /**
   * Validadores específicos para el sistema DRTC
   */

  // Validador para placas de vehículos (formato DRTC)
  static placaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const placa = control.value.toUpperCase();
    const placaRegex = /^[A-Z0-9]{3}-\d{3}$/;
    
    if (!placaRegex.test(placa)) {
      return { 
        placaFormat: { 
          value: control.value,
          message: 'El formato debe ser XXX-NNN (XXX alfanumérico en mayúsculas, NNN 3 dígitos)' 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de documento (DNI, RUC, etc.)
  static documentoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const documento = control.value.toString().replace(/\D/g, '');
    
    if (documento.length !== 8 && documento.length !== 11) {
      return { 
        documentoLength: { 
          value: control.value,
          message: 'El documento debe tener 8 dígitos (DNI) o 11 dígitos (RUC)' 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de teléfono
  static telefonoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const telefono = control.value.toString().replace(/\D/g, '');
    
    if (telefono.length < 7 || telefono.length > 9) {
      return { 
        telefonoLength: { 
          value: control.value,
          message: 'El teléfono debe tener entre 7 y 9 dígitos' 
        } 
      };
    }
    
    return null;
  }

  // Validador para correos electrónicos
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(control.value)) {
      return { 
        emailFormat: { 
          value: control.value,
          message: 'El formato del correo electrónico no es válido' 
        } 
      };
    }
    
    return null;
  }

  // Validador para años de fabricación
  static anioFabricacionValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const anio = parseInt(control.value);
    const anioActual = new Date().getFullYear();
    
    if (anio < 1900 || anio > anioActual + 1) {
      return { 
        anioRange: { 
          value: control.value,
          message: `El año debe estar entre 1900 y ${anioActual + 1}` 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de resolución
  static resolucionValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const resolucion = control.value.toString();
    const resolucionRegex = /^[A-Z]{2,4}-\d{4}-\d{3}$/;
    
    if (!resolucionRegex.test(resolucion)) {
      return { 
        resolucionFormat: { 
          value: control.value,
          message: 'El formato debe ser XXX-YYYY-ZZZ (ej: DRTC-2024-001)' 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de expediente
  static expedienteValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const expediente = control.value.toString();
    const expedienteRegex = /^[A-Z]{2,4}-\d{4}-\d{3}-\d{2}$/;
    
    if (!expedienteRegex.test(expediente)) {
      return { 
        expedienteFormat: { 
          value: control.value,
          message: 'El formato debe ser XXX-YYYY-ZZZ-WW (ej: DRTC-2024-001-01)' 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de licencia de conducir
  static licenciaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const licencia = control.value.toString();
    const licenciaRegex = /^[A-Z]{2}\d{8}$/;
    
    if (!licenciaRegex.test(licencia)) {
      return { 
        licenciaFormat: { 
          value: control.value,
          message: 'El formato debe ser XX12345678 (2 letras + 8 dígitos)' 
        } 
      };
    }
    
    return null;
  }

  // Validador para números de TUC
  static tucValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const tuc = control.value.toString();
    const tucRegex = /^[A-Z]{2}\d{6}$/;
    
    if (!tucRegex.test(tuc)) {
      return { 
        tucFormat: { 
          value: control.value,
          message: 'El formato debe ser XX123456 (2 letras + 6 dígitos)' 
        } 
      };
    }
    
    return null;
  }

  /**
   * Métodos de utilidad para validación
   */

  // Formatear placa automáticamente
  static formatearPlaca(value: string): string {
    let placa = value.toUpperCase();
    placa = placa.replace(/[^A-Z0-9]/g, '');
    
    if (placa.length >= 3) {
      placa = placa.slice(0, 3) + '-' + placa.slice(3, 6);
    }
    
    return placa;
  }

  // Formatear documento automáticamente
  static formatearDocumento(value: string): string {
    const documento = value.replace(/\D/g, '');
    return documento;
  }

  // Formatear teléfono automáticamente
  static formatearTelefono(value: string): string {
    const telefono = value.replace(/\D/g, '');
    return telefono;
  }

  // Formatear resolución automáticamente
  static formatearResolucion(value: string): string {
    let resolucion = value.toUpperCase();
    resolucion = resolucion.replace(/[^A-Z0-9]/g, '');
    
    if (resolucion.length >= 4) {
      resolucion = resolucion.slice(0, 4) + '-' + resolucion.slice(4, 8) + '-' + resolucion.slice(8, 11);
    }
    
    return resolucion;
  }

  // Formatear expediente automáticamente
  static formatearExpediente(value: string): string {
    let expediente = value.toUpperCase();
    expediente = expediente.replace(/[^A-Z0-9]/g, '');
    
    if (expediente.length >= 4) {
      expediente = expediente.slice(0, 4) + '-' + expediente.slice(4, 8) + '-' + expediente.slice(8, 11) + '-' + expediente.slice(11, 13);
    }
    
    return expediente;
  }

  /**
   * Obtener mensaje de error personalizado
   */
  static getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (!control.errors) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return `El campo "${fieldName}" es requerido`;
    }
    
    if (errors['minlength']) {
      return `El campo "${fieldName}" debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['maxlength']) {
      return `El campo "${fieldName}" debe tener máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    
    if (errors['min']) {
      return `El campo "${fieldName}" debe ser mayor o igual a ${errors['min'].min}`;
    }
    
    if (errors['max']) {
      return `El campo "${fieldName}" debe ser menor o igual a ${errors['max'].max}`;
    }
    
    if (errors['pattern']) {
      return `El campo "${fieldName}" tiene un formato inválido`;
    }
    
    // Errores personalizados
    if (errors['placaFormat']) {
      return errors['placaFormat'].message;
    }
    
    if (errors['documentoLength']) {
      return errors['documentoLength'].message;
    }
    
    if (errors['telefonoLength']) {
      return errors['telefonoLength'].message;
    }
    
    if (errors['emailFormat']) {
      return errors['emailFormat'].message;
    }
    
    if (errors['anioRange']) {
      return errors['anioRange'].message;
    }
    
    if (errors['resolucionFormat']) {
      return errors['resolucionFormat'].message;
    }
    
    if (errors['expedienteFormat']) {
      return errors['expedienteFormat'].message;
    }
    
    if (errors['licenciaFormat']) {
      return errors['licenciaFormat'].message;
    }
    
    if (errors['tucFormat']) {
      return errors['tucFormat'].message;
    }
    
    return `El campo "${fieldName}" es inválido`;
  }

  /**
   * Validar si un campo es inválido
   */
  static isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }

  /**
   * Marcar todos los campos inválidos como tocados
   */
  static markInvalidFieldsAsTouched(form: any): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }
} 