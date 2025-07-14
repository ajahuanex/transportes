import { Component, OnInit, signal } from '@angular/core';
import { CompaniesService } from '../../services/companies';
import { IEmpresaInDB } from '../../models/company.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies = signal<IEmpresaInDB[]>([]);

  constructor(private companiesService: CompaniesService, private router: Router) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companiesService.getAllActiveCompanies().subscribe(
      (data) => {
        this.companies.set(data);
      },
      (error) => {
        console.error('Error al cargar empresas:', error);
      }
    );
  }

  editCompany(id: string): void {
    this.router.navigate(['/companies/edit', id]);
  }

  softDeleteCompany(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      this.companiesService.softDeleteCompany(id).subscribe(
        () => {
          console.log('Empresa eliminada lógicamente con éxito');
          this.loadCompanies();
        },
        (error) => {
          console.error('Error al eliminar empresa:', error);
        }
      );
    }
  }

  restoreCompany(id: string): void {
    if (confirm('¿Estás seguro de que quieres restaurar esta empresa?')) {
      this.companiesService.restoreCompany(id).subscribe(
        () => {
          console.log('Empresa restaurada con éxito');
          this.loadCompanies();
        },
        (error) => {
          console.error('Error al restaurar empresa:', error);
        }
      );
    }
  }

  createCompany(): void {
    this.router.navigate(['/companies/new']);
  }
}
