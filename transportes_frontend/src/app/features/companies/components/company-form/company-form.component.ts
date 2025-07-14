import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IEmpresaInDB, IEmpresaCreate, IEmpresaUpdate } from '../../models/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../services/companies';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  @Input() company: IEmpresaInDB | null = null;
  @Output() save = new EventEmitter<IEmpresaCreate | IEmpresaUpdate>();

  companyForm!: FormGroup;
  companyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.companyId = this.route.snapshot.paramMap.get('id');

    if (this.companyId) {
      this.companiesService.getCompanyById(this.companyId).subscribe(
        (company) => {
          this.company = company;
          this.companyForm.patchValue({
            ruc: company.ruc,
            razon_social: company.razon_social,
            nombre_comercial: company.nombre_comercial,
            telefono: company.telefono,
            email: company.email,
            estado_habilitacion_mtc: company.estado_habilitacion_mtc,
            // Los campos anidados como domicilio_legal, representante_legal, info_sunat
            // requerirían un manejo más complejo o formularios anidados.
            // Por ahora, los omitimos o los manejamos como texto simple si es posible.
          });
        },
        (error) => {
          console.error('Error al cargar empresa:', error);
          this.router.navigate(['/companies']);
        }
      );
    }
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      ruc: ['', Validators.required],
      razon_social: ['', Validators.required],
      nombre_comercial: [''],
      telefono: [''],
      email: ['', Validators.email],
      estado_habilitacion_mtc: ['Habilitado', Validators.required],
      // Campos anidados no incluidos en el formulario inicial
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formValue = this.companyForm.value;

      const companyToSave: IEmpresaCreate | IEmpresaUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null en info_sunat
      if (companyToSave.info_sunat) {
        if (companyToSave.info_sunat.fecha_inscripcion_sunat === '') {
          companyToSave.info_sunat.fecha_inscripcion_sunat = null;
        }
        if (companyToSave.info_sunat.emisor_electronico_desde === '') {
          companyToSave.info_sunat.emisor_electronico_desde = null;
        }
        if (companyToSave.info_sunat.fecha_actualizacion_sunat === '') {
          companyToSave.info_sunat.fecha_actualizacion_sunat = null;
        }
      }

      if (this.companyId) {
        this.companiesService.updateCompany(this.companyId, companyToSave as IEmpresaUpdate).subscribe(
          () => {
            console.log('Empresa actualizada con éxito');
            this.router.navigate(['/companies']);
          },
          (error) => {
            console.error('Error al actualizar empresa:', error);
          }
        );
      } else {
        this.companiesService.createCompany(companyToSave as IEmpresaCreate).subscribe(
          () => {
            console.log('Empresa creada con éxito');
            this.router.navigate(['/companies']);
          },
          (error) => {
            console.error('Error al crear empresa:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/companies']);
  }
}
