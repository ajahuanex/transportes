import { Injectable, inject } from '@angular/core';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  formatter?: (value: any) => string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  exportToCSV(data: any[], columns: ColumnConfig[], options: ExportOptions = { format: 'csv' }): void {
    const visibleColumns = columns.filter(col => col.visible);
    
    // Crear headers
    const headers = visibleColumns.map(col => col.label);
    
    // Crear filas de datos
    const rows = data.map(item => 
      visibleColumns.map(col => {
        const value = this.getNestedValue(item, col.key);
        return col.formatter ? col.formatter(value) : this.formatValue(value, options.dateFormat);
      })
    );
    
    // Combinar headers y datos
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Crear y descargar archivo
    this.downloadFile(csvContent, `${options.filename || 'export'}.csv`, 'text/csv');
  }
  
  exportToExcel(data: any[], columns: ColumnConfig[], options: ExportOptions = { format: 'excel' }): void {
    // Para Excel, usamos una librería como xlsx
    // Por ahora, exportamos como CSV con extensión .xlsx
    this.exportToCSV(data, columns, { ...options, format: 'csv' });
    
    // TODO: Implementar exportación real a Excel usando xlsx library
    console.log('Exportación a Excel no implementada aún. Usando CSV como fallback.');
  }
  
  exportToPDF(data: any[], columns: ColumnConfig[], options: ExportOptions = { format: 'pdf' }): void {
    // TODO: Implementar exportación a PDF usando jsPDF o similar
    console.log('Exportación a PDF no implementada aún.');
    
    // Por ahora, exportamos como CSV
    this.exportToCSV(data, columns, { ...options, format: 'csv' });
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  private formatValue(value: any, dateFormat?: string): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (value instanceof Date) {
      return dateFormat ? this.formatDate(value, dateFormat) : value.toLocaleDateString();
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    
    return String(value);
  }
  
  private formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'dd/mm/yyyy':
        return `${day}/${month}/${year}`;
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString();
    }
  }
  
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
} 