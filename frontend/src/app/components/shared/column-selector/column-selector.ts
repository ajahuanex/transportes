import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ColumnOption {
  key: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-column-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="column-selector">
      <button class="btn btn-outline btn-sm" (click)="toggleDropdown()">
        <i class="fas fa-columns"></i>
        Columnas
        <i class="fas fa-chevron-down" [class.rotated]="isOpen()"></i>
      </button>
      
      @if (isOpen()) {
        <div class="dropdown-menu">
          <div class="dropdown-header">
            <h6>Seleccionar Columnas</h6>
            <div class="dropdown-actions">
              <button class="btn btn-link btn-sm" (click)="selectAll()">Todas</button>
              <button class="btn btn-link btn-sm" (click)="deselectAll()">Ninguna</button>
            </div>
          </div>
          
          <div class="column-list">
            @for (column of columns(); track column.key) {
              <label class="column-option">
                <input 
                  type="checkbox" 
                  [checked]="column.visible"
                  (change)="toggleColumn(column.key)"
                >
                <span class="column-label">{{ column.label }}</span>
              </label>
            }
          </div>
          
          <div class="dropdown-footer">
            <button class="btn btn-primary btn-sm" (click)="applyChanges()">
              Aplicar
            </button>
            <button class="btn btn-outline btn-sm" (click)="cancel()">
              Cancelar
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./column-selector.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnSelectorComponent {
  columns = input.required<ColumnOption[]>();
  columnsChange = output<ColumnOption[]>();
  
  isOpen = signal(false);
  tempColumns = signal<ColumnOption[]>([]);
  
  ngOnInit(): void {
    this.tempColumns.set([...this.columns()]);
  }
  
  toggleDropdown(): void {
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.tempColumns.set([...this.columns()]);
    }
  }
  
  toggleColumn(key: string): void {
    this.tempColumns.update(cols => 
      cols.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  }
  
  selectAll(): void {
    this.tempColumns.update(cols => 
      cols.map(col => ({ ...col, visible: true }))
    );
  }
  
  deselectAll(): void {
    this.tempColumns.update(cols => 
      cols.map(col => ({ ...col, visible: false }))
    );
  }
  
  applyChanges(): void {
    this.columnsChange.emit(this.tempColumns());
    this.isOpen.set(false);
  }
  
  cancel(): void {
    this.tempColumns.set([...this.columns()]);
    this.isOpen.set(false);
  }
} 