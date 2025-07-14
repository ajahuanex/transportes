import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IPapeletaInDB, IPapeletaCreate, IPapeletaUpdate } from '../../models/ticket.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() ticket: IPapeletaInDB | null = null;
  @Output() save = new EventEmitter<IPapeletaCreate | IPapeletaUpdate>();

  ticketForm!: FormGroup;
  ticketId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketsService: TicketsService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.ticketId = this.route.snapshot.paramMap.get('id');

    if (this.ticketId) {
      this.ticketsService.getTicketById(this.ticketId).subscribe(
        (ticket) => {
          this.ticket = ticket;
          this.ticketForm.patchValue({
            numero_papeleta: ticket.numero_papeleta,
            fecha_infraccion: ticket.fecha_infraccion ? new Date(ticket.fecha_infraccion).toISOString().substring(0, 10) : '',
            tipo_infraccion: ticket.tipo_infraccion,
            codigo_infraccion: ticket.codigo_infraccion,
            descripcion_infraccion: ticket.descripcion_infraccion,
            monto_multa: ticket.monto_multa,
            moneda: ticket.moneda,
            empresa_responsable_id: ticket.empresa_responsable_id,
            ruc_empresa_responsable: ticket.ruc_empresa_responsable,
            vehiculo_involucrado_id: ticket.vehiculo_involucrado_id,
            placa_vehiculo_involucrado: ticket.placa_vehiculo_involucrado,
            conductor_involucrado_id: ticket.conductor_involucrado_id,
            dni_conductor_involucrado: ticket.dni_conductor_involucrado,
            autoridad_emisora: ticket.autoridad_emisora,
            estado_multa: ticket.estado_multa,
            fecha_notificacion: ticket.fecha_notificacion ? new Date(ticket.fecha_notificacion).toISOString().substring(0, 10) : '',
            fecha_pago: ticket.fecha_pago ? new Date(ticket.fecha_pago).toISOString().substring(0, 10) : '',
            monto_pagado: ticket.monto_pagado,
            observaciones_multa: ticket.observaciones_multa,
          });
        },
        (error) => {
          console.error('Error al cargar papeleta:', error);
          this.router.navigate(['/tickets']);
        }
      );
    }
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      numero_papeleta: ['', Validators.required],
      fecha_infraccion: ['', Validators.required],
      tipo_infraccion: ['', Validators.required],
      codigo_infraccion: ['', Validators.required],
      descripcion_infraccion: ['', Validators.required],
      monto_multa: [null, Validators.required],
      moneda: ['PEN', Validators.required],
      empresa_responsable_id: ['', Validators.required],
      ruc_empresa_responsable: ['', Validators.required],
      vehiculo_involucrado_id: [''],
      placa_vehiculo_involucrado: [''],
      conductor_involucrado_id: [''],
      dni_conductor_involucrado: [''],
      autoridad_emisora: ['', Validators.required],
      estado_multa: ['PENDIENTE', Validators.required],
      fecha_notificacion: [''],
      fecha_pago: [''],
      monto_pagado: [null],
      observaciones_multa: [''],
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const formValue = this.ticketForm.value;

      const ticketToSave: IPapeletaCreate | IPapeletaUpdate = {
        ...formValue,
        origen_dato: 'PRODUCCION' // Asumimos que los datos creados/actualizados son de producción
      };

      // Convertir cadenas vacías de fechas a null
      if (ticketToSave.fecha_infraccion === '') {
        ticketToSave.fecha_infraccion = null;
      }
      if (ticketToSave.fecha_notificacion === '') {
        ticketToSave.fecha_notificacion = null;
      }
      if (ticketToSave.fecha_pago === '') {
        ticketToSave.fecha_pago = null;
      }

      if (this.ticketId) {
        this.ticketsService.updateTicket(this.ticketId, ticketToSave as IPapeletaUpdate).subscribe(
          () => {
            console.log('Papeleta actualizada con éxito');
            this.router.navigate(['/tickets']);
          },
          (error) => {
            console.error('Error al actualizar papeleta:', error);
          }
        );
      } else {
        this.ticketsService.createTicket(ticketToSave as IPapeletaCreate).subscribe(
          () => {
            console.log('Papeleta creada con éxito');
            this.router.navigate(['/tickets']);
          },
          (error) => {
            console.error('Error al crear papeleta:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/tickets']);
  }
}