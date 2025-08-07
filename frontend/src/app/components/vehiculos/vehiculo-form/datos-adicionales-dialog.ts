import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-datos-adicionales-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>build</mat-icon>
      Datos Adicionales del Vehículo
    </h2>
    
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="datosForm" class="datos-form">
        
        <!-- Información Básica -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>info</mat-icon>
            Información Básica
          </h3>
          <mat-divider></mat-divider>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Color</mat-label>
              <input matInput formControlName="color" placeholder="Ej: Blanco">
              <mat-icon matSuffix>palette</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tipo de Vehículo</mat-label>
              <mat-select formControlName="tipo">
                <mat-option value="">Seleccione un tipo</mat-option>
                <mat-option value="BUS">Bus</mat-option>
                <mat-option value="MICROBUS">Microbús</mat-option>
                <mat-option value="COMBIS">Combis</mat-option>
                <mat-option value="CAMION">Camión</mat-option>
                <mat-option value="CAMIONETA">Camioneta</mat-option>
                <mat-option value="MOTOTAXI">Mototaxi</mat-option>
                <mat-option value="TAXI">Taxi</mat-option>
                <mat-option value="OTRO">Otro</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Modelo</mat-label>
            <input matInput formControlName="modelo" placeholder="Ej: Corolla">
            <mat-icon matSuffix>directions_car</mat-icon>
          </mat-form-field>
        </div>

        <!-- Datos Técnicos -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>settings</mat-icon>
            Datos Técnicos
          </h3>
          <mat-divider></mat-divider>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Motor</mat-label>
              <input matInput formControlName="motor" placeholder="Ej: 2.0L 4-Cylinder">
              <mat-icon matSuffix>precision_manufacturing</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Chasis</mat-label>
              <input matInput formControlName="chasis" placeholder="Número de chasis">
              <mat-icon matSuffix>account_tree</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Número de Ejes</mat-label>
              <input matInput type="number" formControlName="ejes" placeholder="Ej: 2">
              <mat-icon matSuffix>linear_scale</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Número de Asientos</mat-label>
              <input matInput type="number" formControlName="asientos" placeholder="Ej: 45">
              <mat-icon matSuffix>event_seat</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Peso Neto (kg)</mat-label>
              <input matInput type="number" formControlName="pesoNeto" placeholder="Ej: 3500">
              <mat-icon matSuffix>monitor_weight</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Peso Bruto (kg)</mat-label>
              <input matInput type="number" formControlName="pesoBruto" placeholder="Ej: 4500">
              <mat-icon matSuffix>fitness_center</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Medidas -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>straighten</mat-icon>
            Medidas (metros)
          </h3>
          <mat-divider></mat-divider>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Largo</mat-label>
              <input matInput type="number" step="0.1" formControlName="largo" placeholder="Ej: 12.5">
              <mat-icon matSuffix>height</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ancho</mat-label>
              <input matInput type="number" step="0.1" formControlName="ancho" placeholder="Ej: 2.5">
              <mat-icon matSuffix>width_wide</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Alto</mat-label>
              <input matInput type="number" step="0.1" formControlName="alto" placeholder="Ej: 3.2">
              <mat-icon matSuffix>height</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="primary" (click)="onSave()">
        <mat-icon>save</mat-icon>
        Guardar Datos
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 24px;
    }

    .datos-form {
      width: 100%;
      min-width: 600px;
    }

    .form-section {
      margin-bottom: 32px;
      
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
        color: #1976d2;
      }

      mat-divider {
        margin-bottom: 24px;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .datos-form {
        min-width: unset;
        width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .dialog-content {
        padding: 0 16px;
      }
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class DatosAdicionalesDialogComponent {
  private dialogRef = inject(MatDialogRef<DatosAdicionalesDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  datosForm: FormGroup;

  constructor() {
    this.datosForm = this.fb.group({
      color: [this.data?.color || ''],
      tipo: [this.data?.tipo || ''],
      modelo: [this.data?.modelo || ''],
      motor: [this.data?.motor || ''],
      chasis: [this.data?.chasis || ''],
      ejes: [this.data?.ejes || ''],
      asientos: [this.data?.asientos || ''],
      pesoNeto: [this.data?.pesoNeto || ''],
      pesoBruto: [this.data?.pesoBruto || ''],
      largo: [this.data?.largo || ''],
      ancho: [this.data?.ancho || ''],
      alto: [this.data?.alto || ''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.datosForm.value);
  }
}
