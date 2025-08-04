import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  EmpresaTransporte, 
  EmpresaListResponse, 
  CreateEmpresaRequest,
  UpdateEmpresaRequest,
  TipoEmpresa
} from '../models/empresa.model';
import { EstadoGeneral } from '../models/base.model';
import { 
  Vehiculo, 
  VehiculoListResponse, 
  TipoVehiculo,
  TipoCombustible,
  TipoTransmision,
  TipoTraccion
} from '../models/vehiculo.model';
import { 
  Conductor, 
  ConductorListResponse, 
  CategoriaLicencia 
} from '../models/conductor.model';
import {
  Expediente,
  ExpedienteListResponse,
  CreateExpedienteRequest,
  UpdateExpedienteRequest,
  ExpedienteFilter,
  DeleteExpedienteRequest,
  RestoreExpedienteRequest,
  ExpedienteAuditLog,
  ExpedienteStats,
  EstadoExpediente,
  TipoExpediente,
  TipoTramite
} from '../models/expediente.model';
import {
  Ruta,
  RutaListResponse,
  CreateRutaRequest,
  UpdateRutaRequest,
  RutaFilter,
  DeleteRutaRequest,
  RestoreRutaRequest,
  RutaAuditLog,
  RutaStats,
  TipoRuta,
  CategoriaRuta
} from '../models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // Datos ficticios de empresas según nuevas reglas DRTC
  private empresas: EmpresaTransporte[] = [
    {
      id: '1',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-01-15'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la empresa según nuevas reglas
      ruc: '20123456789',
      razonSocial: 'Transportes El Veloz S.A.C.',
      razonSocialInterno: 'TRANSPORTES EL VELOZ SAC - INTERNO',
      nombreComercial: 'TransVeloz',
      nombreCorto: 'TransVeloz',
      representanteLegal: {
        dni: '12345678',
        nombres: 'Juan Carlos',
        apellidos: 'Pérez Mendoza',
        cargo: 'Gerente General',
        telefono: '051-123456',
        email: 'juan.perez@transveloz.com',
        fechaNacimiento: new Date('1980-05-15'),
        direccion: {
          calle: 'Av. El Sol',
          numero: '123',
          distrito: 'Puno',
          provincia: 'Puno',
          departamento: 'Puno'
        }
      },
      representanteLegalSecundario: {
        dni: '87654321',
        nombres: 'María Elena',
        apellidos: 'García López',
        cargo: 'Sub Gerente',
        telefono: '051-654321',
        email: 'maria.garcia@transveloz.com',
        fechaNacimiento: new Date('1985-08-20'),
        direccion: {
          calle: 'Jr. San Martín',
          numero: '456',
          distrito: 'Puno',
          provincia: 'Puno',
          departamento: 'Puno'
        }
      },
      direccion: {
        calle: 'Av. El Sol',
        numero: '123',
        distrito: 'Puno',
        provincia: 'Puno',
        departamento: 'Puno'
      },
      contacto: {
        telefono: '051-123456',
        email: 'info@transpuno.com',
        celular: '999888777',
        web: 'www.transpuno.com'
      },
      informacionFinanciera: {
        capitalSocial: 500000,
        moneda: 'PEN',
        bancoPrincipal: 'Banco de Crédito del Perú',
        cuentaBancaria: '0011-0123-0101234567',
        estadoFinanciero: 'SOLVENTE',
        fechaVencimientoPagos: new Date('2025-12-31')
      },
      cumplimiento: {
        licenciaVigente: true,
        fechaVencimientoLicencia: new Date('2025-12-31'),
        segurosVigentes: true,
        fechaVencimientoSeguros: new Date('2025-12-31'),
        revisionTecnicaVigente: true,
        fechaVencimientoRevision: new Date('2025-12-31'),
        certificadoOperacionVigente: true,
        fechaVencimientoCertificado: new Date('2025-12-31'),
        cumplimientoNormativo: true,
        observaciones: []
      },
      infracciones: [],
      sanciones: [],
      certificaciones: [],
      auditoria: {
        ultimaAuditoria: new Date('2024-12-01'),
        resultado: 'APROBADA',
        observaciones: [],
        proximaAuditoria: new Date('2025-12-01'),
        auditorResponsable: 'María González'
      },
      historial: [],
      estado: EstadoGeneral.ACTIVO,
      
      // Propiedades adicionales para el formulario
      telefono: '051-123456',
      email: 'info@transpuno.com',
      sitioWeb: 'www.transpuno.com',
      fechaConstitucion: new Date('2020-01-15'),
      tipoEmpresa: TipoEmpresa.TRANSPORTE,
      
      // Información del expediente
      expediente: {
        numero: 'E-0001-2024',
        fecha: new Date('2024-01-15'),
        estado: 'APROBADO',
        observaciones: 'Expediente aprobado sin observaciones',
        documentos: ['expediente_e0001_2024.pdf']
      }
    },
    {
      id: '2',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2019-06-10'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-11-15'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la empresa
      ruc: '20123456790',
      razonSocial: 'Empresa de Transportes Juliaca EIRL',
      razonSocialInterno: 'EMPRESA DE TRANSPORTES JULIACA EIRL - INTERNO',
      nombreComercial: 'TransJuliaca',
      nombreCorto: 'TransJuliaca',
      representanteLegal: {
        dni: '87654321',
        nombres: 'María Elena',
        apellidos: 'García López',
        cargo: 'Representante Legal',
        telefono: '051-654321',
        email: 'maria.garcia@transjuliaca.com',
        fechaNacimiento: new Date('1975-08-20'),
        direccion: {
          calle: 'Jr. San Martín',
          numero: '456',
          distrito: 'Juliaca',
          provincia: 'San Román',
          departamento: 'Puno'
        }
      },
      // Sin representante legal secundario para esta empresa
      direccion: {
        calle: 'Jr. San Martín',
        numero: '456',
        distrito: 'Juliaca',
        provincia: 'San Román',
        departamento: 'Puno'
      },
      contacto: {
        telefono: '051-654321',
        email: 'info@transjuliaca.com',
        celular: '999777666'
      },
      informacionFinanciera: {
        capitalSocial: 300000,
        moneda: 'PEN',
        bancoPrincipal: 'BBVA Perú',
        cuentaBancaria: '0011-0291-0101234567',
        estadoFinanciero: 'SOLVENTE',
        fechaVencimientoPagos: new Date('2025-12-31')
      },
      cumplimiento: {
        licenciaVigente: true,
        fechaVencimientoLicencia: new Date('2025-06-30'),
        segurosVigentes: true,
        fechaVencimientoSeguros: new Date('2025-12-31'),
        revisionTecnicaVigente: true,
        fechaVencimientoRevision: new Date('2025-03-31'),
        certificadoOperacionVigente: true,
        fechaVencimientoCertificado: new Date('2025-12-31'),
        cumplimientoNormativo: true,
        observaciones: []
      },
      infracciones: [],
      sanciones: [],
      certificaciones: [],
      auditoria: {
        ultimaAuditoria: new Date('2024-11-15'),
        resultado: 'APROBADA',
        observaciones: [],
        proximaAuditoria: new Date('2025-11-15'),
        auditorResponsable: 'Carlos Rodríguez'
      },
      historial: [],
      estado: EstadoGeneral.ACTIVO,
      
      // Propiedades adicionales para el formulario
      telefono: '051-654321',
      email: 'info@transjuliaca.com',
      sitioWeb: 'www.transjuliaca.com',
      fechaConstitucion: new Date('2019-06-10'),
      tipoEmpresa: TipoEmpresa.TRANSPORTE,
      
      // Información del expediente
      expediente: {
        numero: 'E-0002-2019',
        fecha: new Date('2019-06-10'),
        estado: 'APROBADO',
        observaciones: 'Expediente aprobado para operaciones en Juliaca',
        documentos: ['expediente_e0002_2019.pdf']
      }
    }
  ];

  // Datos ficticios de vehículos
  // Datos ficticios de vehículos según nuevas reglas DRTC
  private vehiculos: Vehiculo[] = [
    {
      id: '1',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2020-01-15'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos del vehículo según nuevas reglas
      placa: 'V1A-123',
      empresaActualId: '1',
      rutaId: '1',
      categoria: 'M3',
      marca: 'Mercedes-Benz',
      anioFabricacion: 2018,
      estado: 'ACTIVO',
      estaActivo: true,
      tuc: { 
        nroTuc: 'T-123456-2025', 
        fechaEmision: new Date('2024-01-15') 
      },
      datosTecnicos: {
        motor: 'Diesel Euro 4',
        chasis: 'A123-B456-C789',
        ejes: 2,
        asientos: 30,
        pesoNeto: 5000,
        pesoBruto: 12000,
        medidas: { largo: 10.5, ancho: 2.5, alto: 3.2 }
      },
      documentos: {
        tarjetaPropiedad: {
          numero: 'TP-2020-001234',
          fechaEmision: new Date('2020-01-15'),
          fechaVencimiento: new Date('2030-01-15'),
          estado: 'VIGENTE',
          documento: 'tarjeta_propiedad_abc123.pdf'
        },
        revisionTecnica: {
          numero: 'RT-2024-001234',
          fechaEmision: new Date('2024-01-15'),
          fechaVencimiento: new Date('2025-01-15'),
          estado: 'VIGENTE',
          documento: 'revision_tecnica_abc123.pdf'
        },
        seguroVehicular: {
          numero: 'SV-2024-001234',
          aseguradora: 'Rimac Seguros',
          fechaEmision: new Date('2024-01-01'),
          fechaVencimiento: new Date('2025-01-01'),
          estado: 'VIGENTE',
          documento: 'seguro_vehicular_abc123.pdf'
        },
        certificadoOperacion: {
          numero: 'CO-2024-001234',
          fechaEmision: new Date('2024-01-15'),
          fechaVencimiento: new Date('2025-01-15'),
          estado: 'VIGENTE',
          documento: 'certificado_operacion_abc123.pdf'
        }
      },
      informacionTecnica: {
        numeroMotor: 'MB123456789',
        numeroChasis: 'MBCH123456789',
        cilindrada: 6000,
        combustible: TipoCombustible.DIESEL,
        transmision: TipoTransmision.MANUAL,
        traccion: TipoTraccion.TRASERA,
        pesoBruto: 12000,
        pesoNeto: 8000,
        kilometraje: 150000,
        ultimaRevision: new Date('2024-12-01')
      },
      informacionSeguro: {
        poliza: 'POL-2024-001234',
        aseguradora: 'Rimac Seguros',
        tipoCobertura: 'Todo Riesgo',
        montoAsegurado: 200000,
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2025-01-01'),
        estado: 'VIGENTE',
        documento: 'poliza_seguro_abc123.pdf'
      },
      mantenimiento: {
        ultimoMantenimiento: new Date('2024-11-15'),
        proximoMantenimiento: new Date('2025-02-15'),
        kilometrajeUltimoMantenimiento: 145000,
        tipoUltimoMantenimiento: 'Preventivo',
        taller: 'Taller Mercedes-Benz Puno',
        costo: 2500,
        observaciones: ['Cambio de aceite', 'Filtros'],
        documentos: ['mantenimiento_abc123.pdf']
      },
      historial: []
    }
  ];

  // Datos ficticios de conductores según nuevas reglas DRTC
  private conductores: Conductor[] = [
    {
      id: '1',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-01-20'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos del conductor según nuevas reglas
      dni: '40123456',
      nombres: 'Juan Carlos',
      apellidos: 'Perez Quispe',
      licencia: {
        numero: 'A12345678',
        categoria: CategoriaLicencia.A1,
        fechaEmision: new Date('2020-01-15'),
        fechaVencimiento: new Date('2025-01-15'),
        estado: 'VIGENTE',
        puntos: 20,
        restricciones: [],
        documento: 'licencia_juan_perez.pdf'
      },
      estado: 'HABILITADO',
      estaActivo: true,
      empresasAsociadasIds: ['1'],
      antecedentes: {
        antecedentesPenales: false,
        fechaVerificacionAntecedentes: new Date('2024-01-15'),
        resultadoAntecedentes: 'FAVORABLE',
        antecedentesJudiciales: false,
        fechaVerificacionJudicial: new Date('2024-01-15'),
        resultadoJudicial: 'FAVORABLE',
        observaciones: [],
        documentos: ['antecedentes_carlos_rodriguez.pdf']
      },
      certificaciones: [],
      experiencia: {
        aniosExperiencia: 5,
        empresasAnteriores: ['Transportes Cusco SAC'],
        tiposVehiculosManejados: ['Bus', 'Microbús'],
        rutasConocidas: ['Puno-Cusco', 'Puno-Juliaca'],
        accidentes: [],
        infracciones: [],
        evaluaciones: []
      },
      historial: []
    }
  ];

  // Datos ficticios de expedientes según nuevas reglas DRTC
  private expedientes: Expediente[] = [
    {
      id: '1',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-01-15'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos del expediente según nuevas reglas
      nroExpediente: 'E-1234-2025',
      tipoTramite: 'RENOVACION_HABILITACION_VEHICULAR',
      estado: 'EN_EVALUACION',
      estaActivo: true,
      resolucionFinalId: undefined,
      // Campos adicionales para compatibilidad
      numero: 'E-1234-2025',
      tipo: TipoExpediente.EMPRESA_TRANSPORTE,
      fechaApertura: new Date('2024-01-15'),
      fechaCierre: undefined,
      solicitante: {
        tipo: 'EMPRESA',
        id: '1',
        nombre: 'Transportes El Veloz S.A.C.',
        documento: '20123456789'
      },
      descripcion: 'Renovación de habilitación vehicular para empresa de transporte',
      observaciones: 'Expediente en evaluación',
      prioridad: 'MEDIA',
      responsable: 'Juan Pérez',
      fechaLimite: new Date('2024-03-15'),
      tags: ['transporte', 'renovacion', 'habilitacion'],
      documentos: [],
      seguimiento: [
        {
          id: '1',
          fecha: new Date('2024-01-15'),
          usuario: 'admin',
          accion: 'CREACION',
          descripcion: 'Expediente creado',
          estadoNuevo: EstadoExpediente.ABIERTO
        },
        {
          id: '2',
          fecha: new Date('2024-01-20'),
          usuario: 'juan.perez',
          accion: 'CAMBIO_ESTADO',
          descripcion: 'Expediente en evaluación',
          estadoAnterior: EstadoExpediente.ABIERTO,
          estadoNuevo: EstadoExpediente.EN_TRAMITE
        }
      ],
      expedientesHijos: []
    },
    {
      id: '2',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-02-01'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos del expediente según nuevas reglas
      nroExpediente: 'E-0002-2024',
      tipoTramite: 'RENOVACION_HABILITACION_VEHICULAR',
      estado: 'EN_TRAMITE',
      estaActivo: true,
      resolucionFinalId: undefined,
      // Campos adicionales para compatibilidad
      numero: 'E-0002-2024',
      tipo: TipoExpediente.VEHICULO,
      fechaApertura: new Date('2024-02-01'),
      solicitante: {
        tipo: 'EMPRESA',
        id: '1',
        nombre: 'Transportes Puno SAC',
        documento: '20123456789'
      },
      descripcion: 'Renovación de autorización para vehículo de carga',
      observaciones: 'Pendiente documentación adicional',
      prioridad: 'ALTA',
      responsable: 'María García',
      fechaLimite: new Date('2024-03-01'),
      tags: ['vehiculo', 'renovacion'],
      documentos: [],
      seguimiento: [
        {
          id: '1',
          fecha: new Date('2024-02-01'),
          usuario: 'admin',
          accion: 'CREACION',
          descripcion: 'Expediente creado',
          estadoNuevo: EstadoExpediente.ABIERTO
        },
        {
          id: '2',
          fecha: new Date('2024-02-05'),
          usuario: 'maria.garcia',
          accion: 'CAMBIO_ESTADO',
          descripcion: 'Expediente en trámite',
          estadoAnterior: EstadoExpediente.ABIERTO,
          estadoNuevo: EstadoExpediente.EN_TRAMITE
        }
      ],
      expedientesHijos: []
    }
  ];

  // Datos ficticios de rutas según nuevas reglas DRTC
  private rutas: Ruta[] = [
    {
      id: '1',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-01-15'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la ruta según nuevas reglas
      codigoRuta: 'PUN-JUL-01',
      nombre: 'Puno - Juliaca',
      origen: 'Puno',
      destino: 'Juliaca',
      estado: 'ACTIVA',
      estaActivo: true,
      descripcion: 'Ruta principal de transporte entre Puno y Juliaca',
      distancia: 45,
      tiempoEstimado: 60,
      tipoRuta: TipoRuta.INTERURBANA,
      categoria: CategoriaRuta.PASAJEROS,
      coordenadas: {
        origen: {
          latitud: -15.8402,
          longitud: -70.0219
        },
        destino: {
          latitud: -15.4995,
          longitud: -70.1372
        },
        waypoints: [
          {
            latitud: -15.6700,
            longitud: -70.0795,
            nombre: 'Pucará'
          }
        ]
      },
      horarios: [
        {
          id: '1',
          dia: 'LUNES',
          horaSalida: '06:00',
          horaLlegada: '07:00',
          frecuencia: 30,
          tipoServicio: 'REGULAR',
          activo: true
        },
        {
          id: '2',
          dia: 'MARTES',
          horaSalida: '06:00',
          horaLlegada: '07:00',
          frecuencia: 30,
          tipoServicio: 'REGULAR',
          activo: true
        }
      ],
      tarifas: [
        {
          id: '1',
          tipoPasajero: 'ADULTO',
          precio: 8.50,
          moneda: 'PEN',
          vigenteDesde: new Date('2024-01-01'),
          vigenteHasta: undefined,
          activo: true
        },
        {
          id: '2',
          tipoPasajero: 'NINO',
          precio: 4.25,
          moneda: 'PEN',
          vigenteDesde: new Date('2024-01-01'),
          vigenteHasta: undefined,
          activo: true
        }
      ],
      empresasOperadoras: ['1', '2'],
      vehiculosAsignados: ['1', '2'],
      documentos: [
        {
          id: '1',
          nombre: 'Autorización de Ruta',
          tipo: 'AUTORIZACION',
          numero: 'AUT-001-2024',
          fechaEmision: new Date('2024-01-01'),
          fechaVencimiento: new Date('2025-01-01'),
          estado: 'VIGENTE',
          url: '/documentos/autorizacion-ruta-1.pdf',
          observaciones: 'Autorización vigente'
        }
      ],
      historial: [
        {
          id: '1',
          fecha: new Date('2024-01-15'),
          accion: 'CREACION',
          usuario: 'admin',
          descripcion: 'Ruta creada',
          datosAnteriores: null,
          datosNuevos: null,
          documentos: []
        }
      ]
    },
    {
      id: '2',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-02-01'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la ruta según nuevas reglas
      codigoRuta: 'PUN-CUS-01',
      nombre: 'Puno - Cusco',
      origen: 'Puno',
      destino: 'Cusco',
      estado: 'ACTIVA',
      estaActivo: true,
      descripcion: 'Ruta interprovincial entre Puno y Cusco',
      distancia: 380,
      tiempoEstimado: 420,
      tipoRuta: TipoRuta.INTERPROVINCIAL,
      categoria: CategoriaRuta.PASAJEROS,
      coordenadas: {
        origen: {
          latitud: -15.8402,
          longitud: -70.0219
        },
        destino: {
          latitud: -13.5167,
          longitud: -71.9789
        }
      },
      horarios: [
        {
          id: '3',
          dia: 'LUNES',
          horaSalida: '08:00',
          horaLlegada: '15:00',
          frecuencia: 120,
          tipoServicio: 'REGULAR',
          activo: true
        }
      ],
      tarifas: [
        {
          id: '3',
          tipoPasajero: 'ADULTO',
          precio: 25.00,
          moneda: 'PEN',
          vigenteDesde: new Date('2024-01-01'),
          vigenteHasta: undefined,
          activo: true
        }
      ],
      empresasOperadoras: ['1'],
      vehiculosAsignados: ['3'],
      documentos: [
        {
          id: '2',
          nombre: 'Permiso de Ruta',
          tipo: 'PERMISO',
          numero: 'PER-002-2024',
          fechaEmision: new Date('2024-02-01'),
          fechaVencimiento: new Date('2025-02-01'),
          estado: 'VIGENTE',
          url: '/documentos/permiso-ruta-2.pdf',
          observaciones: 'Permiso vigente'
        }
      ],
      historial: [
        {
          id: '2',
          fecha: new Date('2024-02-01'),
          accion: 'CREACION',
          usuario: 'admin',
          descripcion: 'Ruta creada',
          datosAnteriores: null,
          datosNuevos: null,
          documentos: []
        }
      ]
    },
    {
      id: '3',
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date('2024-03-01'),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date('2024-12-01'),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la ruta según nuevas reglas
      codigoRuta: 'PUN-ARE-01',
      nombre: 'Puno - Arequipa',
      origen: 'Puno',
      destino: 'Arequipa',
      estado: 'SUSPENDIDA',
      estaActivo: true,
      descripcion: 'Ruta interregional entre Puno y Arequipa',
      distancia: 320,
      tiempoEstimado: 360,
      tipoRuta: TipoRuta.INTERREGIONAL,
      categoria: CategoriaRuta.MIXTA,
      coordenadas: {
        origen: {
          latitud: -15.8402,
          longitud: -70.0219
        },
        destino: {
          latitud: -16.4090,
          longitud: -71.5375
        }
      },
      horarios: [
        {
          id: '4',
          dia: 'MIERCOLES',
          horaSalida: '07:00',
          horaLlegada: '13:00',
          frecuencia: 60,
          tipoServicio: 'REGULAR',
          activo: false
        }
      ],
      tarifas: [
        {
          id: '4',
          tipoPasajero: 'ADULTO',
          precio: 20.00,
          moneda: 'PEN',
          vigenteDesde: new Date('2024-01-01'),
          vigenteHasta: undefined,
          activo: false
        }
      ],
      empresasOperadoras: ['2'],
      vehiculosAsignados: ['4'],
      documentos: [
        {
          id: '3',
          nombre: 'Contrato de Ruta',
          tipo: 'CONTRATO',
          numero: 'CON-003-2024',
          fechaEmision: new Date('2024-03-01'),
          fechaVencimiento: new Date('2025-03-01'),
          estado: 'SUSPENDIDA',
          url: '/documentos/contrato-ruta-3.pdf',
          observaciones: 'Contrato suspendido temporalmente'
        }
      ],
      historial: [
        {
          id: '3',
          fecha: new Date('2024-03-01'),
          accion: 'CREACION',
          usuario: 'admin',
          descripcion: 'Ruta creada',
          datosAnteriores: null,
          datosNuevos: null,
          documentos: []
        },
        {
          id: '4',
          fecha: new Date('2024-12-01'),
          accion: 'SUSPENSION',
          usuario: 'admin',
          descripcion: 'Ruta suspendida temporalmente',
          datosAnteriores: { estado: 'ACTIVA' },
          datosNuevos: { estado: 'SUSPENDIDA' },
          documentos: []
        }
      ]
    }
  ];

  // Generadores de números de serie
  private generarNumeroResolucion(): string {
    const year = new Date().getFullYear();
    const count = Math.floor(Math.random() * 1000) + 1;
    return `R-${count.toString().padStart(4, '0')}-${year}`;
  }

  private generarNumeroTUC(): string {
    const year = new Date().getFullYear();
    const count = Math.floor(Math.random() * 1000) + 1;
    return `TUC-${count.toString().padStart(4, '0')}-${year}`;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // Métodos para empresas
  getEmpresas(page: number = 1, limit: number = 10, filters?: any): Observable<EmpresaListResponse> {
    let empresasFiltradas = this.empresas;
    
    // Filtrar por soft delete
    if (filters?.incluirEliminados) {
      // Incluir todas las empresas (eliminadas y no eliminadas)
    } else if (filters?.soloEliminados) {
      // Solo empresas eliminadas
      empresasFiltradas = this.empresas.filter(e => e.eliminado);
    } else {
      // Solo empresas no eliminadas (por defecto)
      empresasFiltradas = this.empresas.filter(e => !e.eliminado);
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const empresasPagina = empresasFiltradas.slice(start, end);
    
    return of({
      empresas: empresasPagina,
      total: empresasFiltradas.length,
      pagina: page,
      porPagina: limit,
      totalPaginas: Math.ceil(empresasFiltradas.length / limit)
    }).pipe(delay(200)); // Reducido de 500ms a 200ms
  }

  getEmpresa(id: string): Observable<EmpresaTransporte> {
    const empresa = this.empresas.find(e => e.id === id);
    return of(empresa!).pipe(delay(100)); // Reducido de 300ms a 100ms
  }

  createEmpresa(empresa: CreateEmpresaRequest): Observable<EmpresaTransporte> {
    const nuevaEmpresa: EmpresaTransporte = {
      id: (this.empresas.length + 1).toString(),
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date(),
      usuarioCreacion: 'admin',
      fechaModificacion: new Date(),
      usuarioModificacion: 'admin',
      version: 1,
      // Datos de la empresa
      ruc: empresa.ruc,
      razonSocial: empresa.razonSocial,
      razonSocialInterno: empresa.razonSocialInterno,
      nombreComercial: empresa.nombreComercial,
      nombreCorto: empresa.nombreCorto,
      representanteLegal: empresa.representanteLegal,
      representanteLegalSecundario: empresa.representanteLegalSecundario,
      direccion: empresa.direccion,
      contacto: empresa.contacto,
      informacionFinanciera: {
        ...empresa.informacionFinanciera,
        estadoFinanciero: 'SOLVENTE' // Agregar el estado financiero faltante
      },
      cumplimiento: {
        licenciaVigente: true,
        fechaVencimientoLicencia: new Date('2025-12-31'),
        segurosVigentes: true,
        fechaVencimientoSeguros: new Date('2025-12-31'),
        revisionTecnicaVigente: true,
        fechaVencimientoRevision: new Date('2025-12-31'),
        certificadoOperacionVigente: true,
        fechaVencimientoCertificado: new Date('2025-12-31'),
        cumplimientoNormativo: true,
        observaciones: []
      },
      infracciones: [],
      sanciones: [],
      certificaciones: [],
      auditoria: {
        ultimaAuditoria: new Date(),
        resultado: 'APROBADA',
        observaciones: [],
        proximaAuditoria: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        auditorResponsable: 'Sistema'
      },
      historial: [],
      estado: empresa.estado || EstadoGeneral.ACTIVO,
      
      // Propiedades adicionales para el formulario
      telefono: empresa.telefono,
      email: empresa.email,
      sitioWeb: empresa.sitioWeb,
      fechaConstitucion: new Date(empresa.fechaConstitucion),
      tipoEmpresa: empresa.tipoEmpresa,
      
      // Información del expediente
      expediente: {
        numero: empresa.expediente.numero,
        fecha: new Date(empresa.expediente.fecha),
        estado: empresa.expediente.estado,
        observaciones: empresa.expediente.observaciones,
        documentos: []
      }
    };
    
    this.empresas.push(nuevaEmpresa);
    return of(nuevaEmpresa).pipe(delay(200)); // Reducido de 500ms a 200ms
  }

  // Métodos para vehículos
  getVehiculos(page: number = 1, limit: number = 10): Observable<VehiculoListResponse> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const vehiculosPagina = this.vehiculos.slice(start, end);
    
    return of({
      vehiculos: vehiculosPagina,
      total: this.vehiculos.length,
      pagina: page,
      porPagina: limit,
      totalPaginas: Math.ceil(this.vehiculos.length / limit)
    }).pipe(delay(200)); // Reducido de 500ms a 200ms
  }

  // Métodos para conductores
  getConductores(page: number = 1, limit: number = 10): Observable<ConductorListResponse> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const conductoresPagina = this.conductores.slice(start, end);
    
    return of({
      conductores: conductoresPagina,
      total: this.conductores.length,
      pagina: page,
      porPagina: limit,
      totalPaginas: Math.ceil(this.conductores.length / limit)
    }).pipe(delay(200)); // Reducido de 500ms a 200ms
  }

  // Métodos para estadísticas
  getEstadisticas(): Observable<any> {
    return of({
      totalEmpresas: this.empresas.length,
      totalVehiculos: this.vehiculos.length,
      totalConductores: this.conductores.length,
      totalRutas: 23,
      empresasActivas: this.empresas.filter(e => e.estado === EstadoGeneral.ACTIVO).length,
      vehiculosActivos: this.vehiculos.filter(v => v.estado === 'ACTIVO').length,
      conductoresActivos: this.conductores.filter(c => c.estado === 'HABILITADO').length
    }).pipe(delay(100)); // Reducido de 300ms a 100ms
  }

  // Métodos para alertas
  getAlertas(): Observable<any> {
    return of({
      documentosPorVencer: 12,
      documentosVencidos: 3,
      expedientesPendientes: 7,
      licenciasPorVencer: 5,
      revisionesPorVencer: 8
    }).pipe(delay(100)); // Reducido de 300ms a 100ms
  }

  // Métodos para generar números de serie
  generarResolucion(): Observable<string> {
    return of(this.generarNumeroResolucion()).pipe(delay(50)); // Reducido de 200ms a 50ms
  }

  generarExpediente(): Observable<string> {
    const year = new Date().getFullYear();
    const count = this.expedientes.filter(e => 
      e.numero?.includes(year.toString())
    ).length + 1;
    return of(`E-${count.toString().padStart(4, '0')}-${year}`).pipe(delay(100));
  }

  generarTUC(): Observable<string> {
    return of(this.generarNumeroTUC()).pipe(delay(500));
  }

  // Métodos para Expedientes
  getExpedientes(filtros: ExpedienteFilter = {}, pagina: number = 1, porPagina: number = 10): Observable<ExpedienteListResponse> {
    let expedientesFiltrados = [...this.expedientes];

    // Aplicar filtros
    if (filtros.numero) {
      expedientesFiltrados = expedientesFiltrados.filter(e => 
        e.numero?.toLowerCase().includes(filtros.numero!.toLowerCase())
      );
    }

    if (filtros.tipo) {
      expedientesFiltrados = expedientesFiltrados.filter(e => e.tipo === filtros.tipo);
    }

    if (filtros.tipoTramite) {
      expedientesFiltrados = expedientesFiltrados.filter(e => e.tipoTramite === filtros.tipoTramite);
    }

    if (filtros.estado) {
      expedientesFiltrados = expedientesFiltrados.filter(e => e.estado === filtros.estado);
    }

    if (filtros.solicitanteId) {
      expedientesFiltrados = expedientesFiltrados.filter(e => 
        e.solicitante?.id === filtros.solicitanteId || 
        e.solicitante?.nombre.toLowerCase().includes(filtros.solicitanteId!.toLowerCase())
      );
    }

    if (filtros.prioridad) {
      expedientesFiltrados = expedientesFiltrados.filter(e => e.prioridad === filtros.prioridad);
    }

    if (filtros.responsable) {
      expedientesFiltrados = expedientesFiltrados.filter(e => 
        e.responsable?.toLowerCase().includes(filtros.responsable!.toLowerCase())
      );
    }

    // Búsqueda general
    if (filtros.busquedaGeneral) {
      const busqueda = filtros.busquedaGeneral.toLowerCase();
      expedientesFiltrados = expedientesFiltrados.filter(e => 
        e.numero?.toLowerCase().includes(busqueda) ||
        e.tipo?.toLowerCase().includes(busqueda) ||
        e.tipoTramite?.toLowerCase().includes(busqueda) ||
        e.solicitante?.nombre.toLowerCase().includes(busqueda) ||
        e.solicitante?.documento.toLowerCase().includes(busqueda) ||
        e.descripcion?.toLowerCase().includes(busqueda)
      );
    }

    // Filtrar por soft delete
    if (filtros.soloEliminados) {
      expedientesFiltrados = expedientesFiltrados.filter(e => e.eliminado);
    } else if (!filtros.incluirEliminados) {
      expedientesFiltrados = expedientesFiltrados.filter(e => !e.eliminado);
    }

    const total = expedientesFiltrados.length;
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const expedientes = expedientesFiltrados.slice(inicio, fin);

    return of({
      expedientes,
      total,
      pagina,
      porPagina
    }).pipe(delay(300));
  }

  getExpediente(id: string): Observable<Expediente | null> {
    const expediente = this.expedientes.find(e => e.id === id);
    return of(expediente || null).pipe(delay(200));
  }

  createExpediente(expediente: CreateExpedienteRequest): Observable<Expediente> {
    const nuevoExpediente: Expediente = {
      id: (this.expedientes.length + 1).toString(),
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date(),
      usuarioCreacion: 'usuario_actual',
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: 1,
      // Datos del expediente según nuevas reglas
      nroExpediente: expediente.numero,
      tipoTramite: expediente.tipoTramite,
      estado: 'ABIERTO',
      estaActivo: true,
      resolucionFinalId: undefined,
      // Campos adicionales para compatibilidad
      numero: expediente.numero,
      tipo: expediente.tipo,
      fechaApertura: new Date(),
      solicitante: expediente.solicitante,
      descripcion: expediente.descripcion,
      observaciones: expediente.observaciones,
      prioridad: expediente.prioridad,
      responsable: expediente.responsable,
      fechaLimite: expediente.fechaLimite,
      tags: expediente.tags || [],
      documentos: [],
      seguimiento: [
        {
          id: '1',
          fecha: new Date(),
          usuario: 'usuario_actual',
          accion: 'CREACION',
          descripcion: 'Expediente creado',
          estadoNuevo: EstadoExpediente.ABIERTO
        }
      ],
      expedientePadre: expediente.expedientePadre,
      expedientesHijos: []
    };

    this.expedientes.push(nuevoExpediente);
    return of(nuevoExpediente).pipe(delay(200));
  }

  updateExpediente(id: string, expediente: UpdateExpedienteRequest): Observable<Expediente> {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    const expedienteActualizado = {
      ...this.expedientes[index],
      ...expediente,
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.expedientes[index].version + 1
    };

    this.expedientes[index] = expedienteActualizado;
    return of(expedienteActualizado).pipe(delay(200));
  }

  deleteExpediente(request: DeleteExpedienteRequest): Observable<void> {
    const index = this.expedientes.findIndex(e => e.id === request.id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    this.expedientes[index] = {
      ...this.expedientes[index],
      eliminado: true,
      fechaEliminacion: new Date(),
      usuarioEliminacion: request.usuario,
      motivoEliminacion: request.motivo,
      fechaModificacion: new Date(),
      usuarioModificacion: request.usuario,
      version: this.expedientes[index].version + 1
    };

    return of(void 0).pipe(delay(200));
  }

  restoreExpediente(request: RestoreExpedienteRequest): Observable<Expediente> {
    const index = this.expedientes.findIndex(e => e.id === request.id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    this.expedientes[index] = {
      ...this.expedientes[index],
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      fechaModificacion: new Date(),
      usuarioModificacion: request.usuario,
      version: this.expedientes[index].version + 1
    };

    return of(this.expedientes[index]).pipe(delay(200));
  }

  getExpedientesEliminados(filtros: ExpedienteFilter = {}): Observable<Expediente[]> {
    const expedientesEliminados = this.expedientes.filter(e => e.eliminado);
    return of(expedientesEliminados).pipe(delay(200));
  }

  deleteExpedientePermanente(id: string): Observable<void> {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expedientes.splice(index, 1);
    }
    return of(void 0).pipe(delay(200));
  }

  getAuditLogExpediente(id: string): Observable<ExpedienteAuditLog[]> {
    // Mock de logs de auditoría
    const logs: ExpedienteAuditLog[] = [
      {
        id: '1',
        expedienteId: id,
        fecha: new Date(),
        usuario: 'usuario_actual',
        accion: 'CONSULTA',
        detalles: { motivo: 'Consulta de expediente' }
      }
    ];
    return of(logs).pipe(delay(200));
  }

  getExpedienteStats(): Observable<ExpedienteStats> {
    const total = this.expedientes.filter(e => !e.eliminado).length;
    const porEstado: Record<string, number> = {
      'ABIERTO': 0,
      'EN_TRAMITE': 0,
      'PENDIENTE_DOCUMENTACION': 0,
      'EN_REVISION': 0,
      'APROBADO': 0,
      'RECHAZADO': 0,
      'CERRADO': 0,
      'SUSPENDIDO': 0
    };

    this.expedientes.filter(e => !e.eliminado).forEach(e => {
      if (e.estado && porEstado[e.estado] !== undefined) {
        porEstado[e.estado]++;
      }
    });

    const stats: ExpedienteStats = {
      total,
      porEstado,
      porTipo: {} as Record<TipoExpediente, number>,
      porPrioridad: {},
      promedioTiempoResolucion: 15,
      expedientesVencidos: 2,
      expedientesUrgentes: 1
    };

    return of(stats).pipe(delay(200));
  }

  cambiarEstadoExpediente(id: string, nuevoEstado: string, observaciones?: string): Observable<Expediente> {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    const expediente = this.expedientes[index];
    const estadoAnterior = expediente.estado;

    this.expedientes[index] = {
      ...expediente,
      estado: nuevoEstado,
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: expediente.version + 1,
      seguimiento: [
        ...(expediente.seguimiento || []),
        {
          id: ((expediente.seguimiento?.length || 0) + 1).toString(),
          fecha: new Date(),
          usuario: 'usuario_actual',
          accion: 'CAMBIO_ESTADO',
          descripcion: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
          estadoAnterior: estadoAnterior as EstadoExpediente,
          estadoNuevo: nuevoEstado as EstadoExpediente,
          observaciones
        }
      ]
    };

    return of(this.expedientes[index]).pipe(delay(200));
  }

  agregarSeguimientoExpediente(id: string, seguimiento: {
    accion: string;
    descripcion: string;
    observaciones?: string;
  }): Observable<Expediente> {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    const expediente = this.expedientes[index];
    this.expedientes[index] = {
      ...expediente,
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: expediente.version + 1,
      seguimiento: [
        ...(expediente.seguimiento || []),
        {
          id: ((expediente.seguimiento?.length || 0) + 1).toString(),
          fecha: new Date(),
          usuario: 'usuario_actual',
          accion: seguimiento.accion,
          descripcion: seguimiento.descripcion,
          observaciones: seguimiento.observaciones
        }
      ]
    };

    return of(this.expedientes[index]).pipe(delay(200));
  }

  asignarResponsableExpediente(id: string, responsable: string): Observable<Expediente> {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expediente no encontrado');
    }

    this.expedientes[index] = {
      ...this.expedientes[index],
      responsable,
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.expedientes[index].version + 1
    };

    return of(this.expedientes[index]).pipe(delay(200));
  }

  getExpedientesPorSolicitante(solicitanteId: string): Observable<Expediente[]> {
    const expedientes = this.expedientes.filter(e => 
      !e.eliminado && e.solicitante?.id === solicitanteId
    );
    return of(expedientes).pipe(delay(200));
  }

  getExpedientesRelacionados(id: string): Observable<Expediente[]> {
    const expediente = this.expedientes.find(e => e.id === id);
    if (!expediente) {
      return of([]);
    }

    const relacionados = this.expedientes.filter(e => 
      !e.eliminado && (
        e.expedientePadre === id || 
        e.expedientesHijos?.includes(id) ||
        e.solicitante?.id === expediente.solicitante?.id
      )
    );

    return of(relacionados).pipe(delay(200));
  }

  generarNumeroExpediente(): Observable<string> {
    const year = new Date().getFullYear();
    const count = this.expedientes.filter(e => 
      e.numero?.includes(year.toString())
    ).length + 1;
    return of(`E-${count.toString().padStart(4, '0')}-${year}`).pipe(delay(100));
  }

  validarNumeroExpediente(numero: string): Observable<boolean> {
    const regex = /^E-\d{4}-\d{4}$/;
    const existe = this.expedientes.some(e => e.numero === numero);
    return of(regex.test(numero) && !existe).pipe(delay(100));
  }

  getExpedientesVencidos(): Observable<Expediente[]> {
    const hoy = new Date();
    const vencidos = this.expedientes.filter(e => 
      !e.eliminado && 
      e.fechaLimite && 
      new Date(e.fechaLimite) < hoy
    );
    return of(vencidos).pipe(delay(200));
  }

  getExpedientesUrgentes(): Observable<Expediente[]> {
    const urgentes = this.expedientes.filter(e => 
      !e.eliminado && e.prioridad === 'URGENTE'
    );
    return of(urgentes).pipe(delay(200));
  }

  buscarExpedientes(texto: string): Observable<Expediente[]> {
    const resultados = this.expedientes.filter(e => 
      !e.eliminado && (
        e.numero?.toLowerCase().includes(texto.toLowerCase()) ||
        e.descripcion?.toLowerCase().includes(texto.toLowerCase()) ||
        e.solicitante?.nombre.toLowerCase().includes(texto.toLowerCase())
      )
    );
    return of(resultados).pipe(delay(200));
  }

  exportarExpedientes(filtros: ExpedienteFilter, formato: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    // Mock de exportación
    const contenido = 'Expedientes exportados';
    const blob = new Blob([contenido], { type: 'text/plain' });
    return of(blob).pipe(delay(500));
  }

  // ===== MÉTODOS PARA RUTAS =====

  getRutas(filtros: RutaFilter = {}, pagina: number = 1, porPagina: number = 10): Observable<RutaListResponse> {
    let rutasFiltradas = this.rutas.filter(r => !r.eliminado);

    // Aplicar filtros
    if (filtros.codigoRuta) {
      rutasFiltradas = rutasFiltradas.filter(r => 
        r.codigoRuta.toLowerCase().includes(filtros.codigoRuta!.toLowerCase())
      );
    }

    if (filtros.nombre) {
      rutasFiltradas = rutasFiltradas.filter(r => 
        r.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
      );
    }

    if (filtros.origen) {
      rutasFiltradas = rutasFiltradas.filter(r => 
        r.origen.toLowerCase().includes(filtros.origen!.toLowerCase())
      );
    }

    if (filtros.destino) {
      rutasFiltradas = rutasFiltradas.filter(r => 
        r.destino.toLowerCase().includes(filtros.destino!.toLowerCase())
      );
    }

    if (filtros.estado) {
      rutasFiltradas = rutasFiltradas.filter(r => r.estado === filtros.estado);
    }

    if (filtros.tipoRuta) {
      rutasFiltradas = rutasFiltradas.filter(r => r.tipoRuta === filtros.tipoRuta);
    }

    if (filtros.categoria) {
      rutasFiltradas = rutasFiltradas.filter(r => r.categoria === filtros.categoria);
    }

    if (filtros.estaActivo !== undefined) {
      rutasFiltradas = rutasFiltradas.filter(r => r.estaActivo === filtros.estaActivo);
    }

    // Ordenamiento
    if (filtros.ordenarPor) {
      rutasFiltradas.sort((a, b) => {
        const aValue = this.getNestedValue(a, filtros.ordenarPor!);
        const bValue = this.getNestedValue(b, filtros.ordenarPor!);
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filtros.orden === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filtros.orden === 'desc' ? bValue - aValue : aValue - bValue;
        }
        
        return 0;
      });
    }

    const total = rutasFiltradas.length;
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const rutas = rutasFiltradas.slice(inicio, fin);

    const response: RutaListResponse = {
      rutas,
      total,
      pagina,
      porPagina,
      totalPaginas: Math.ceil(total / porPagina)
    };

    return of(response).pipe(delay(300));
  }

  getRuta(id: string): Observable<Ruta | null> {
    const ruta = this.rutas.find(r => r.id === id && !r.eliminado);
    return of(ruta || null).pipe(delay(200));
  }

  createRuta(ruta: CreateRutaRequest): Observable<Ruta> {
    const nuevaRuta: Ruta = {
      id: (this.rutas.length + 1).toString(),
      codigoRuta: ruta.codigoRuta,
      nombre: ruta.nombre,
      origen: ruta.origen,
      destino: ruta.destino,
      estado: ruta.estado || 'ACTIVA',
      estaActivo: true,
      descripcion: ruta.descripcion,
      distancia: ruta.distancia,
      tiempoEstimado: ruta.tiempoEstimado,
      tipoRuta: ruta.tipoRuta,
      categoria: ruta.categoria,
      coordenadas: ruta.coordenadas,
      horarios: ruta.horarios?.map(h => ({
        ...h,
        id: Math.random().toString(36).substr(2, 9),
        activo: true
      })) || [],
      tarifas: ruta.tarifas?.map(t => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9),
        activo: true
      })) || [],
      empresasOperadoras: ruta.empresasOperadoras || [],
      vehiculosAsignados: ruta.vehiculosAsignados || [],
      documentos: ruta.documentos || [],
      historial: [],
      // Campos de soft delete
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      // Campos de auditoría
      fechaCreacion: new Date(),
      usuarioCreacion: 'usuario_actual',
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: 1
    };

    this.rutas.push(nuevaRuta);
    return of(nuevaRuta).pipe(delay(300));
  }

  updateRuta(id: string, ruta: UpdateRutaRequest): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    this.rutas[index] = {
      ...this.rutas[index],
      ...ruta,
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  deleteRuta(request: DeleteRutaRequest): Observable<void> {
    const index = this.rutas.findIndex(r => r.id === request.id);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    this.rutas[index] = {
      ...this.rutas[index],
      eliminado: true,
      fechaEliminacion: new Date(),
      usuarioEliminacion: request.usuarioEliminacion,
      motivoEliminacion: request.motivoEliminacion,
      estaActivo: false,
      fechaModificacion: new Date(),
      usuarioModificacion: request.usuarioEliminacion,
      version: this.rutas[index].version + 1
    };

    return of(void 0).pipe(delay(300));
  }

  restoreRuta(request: RestoreRutaRequest): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === request.id);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    this.rutas[index] = {
      ...this.rutas[index],
      eliminado: false,
      fechaEliminacion: undefined,
      usuarioEliminacion: undefined,
      motivoEliminacion: undefined,
      estaActivo: true,
      fechaModificacion: new Date(),
      usuarioModificacion: request.usuarioRestauracion,
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  getRutasEliminadas(filtros: RutaFilter = {}): Observable<Ruta[]> {
    let rutasEliminadas = this.rutas.filter(r => r.eliminado);

    // Aplicar filtros similares a getRutas pero para eliminadas
    if (filtros.codigoRuta) {
      rutasEliminadas = rutasEliminadas.filter(r => 
        r.codigoRuta.toLowerCase().includes(filtros.codigoRuta!.toLowerCase())
      );
    }

    if (filtros.nombre) {
      rutasEliminadas = rutasEliminadas.filter(r => 
        r.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
      );
    }

    return of(rutasEliminadas).pipe(delay(200));
  }

  deleteRutaPermanente(id: string): Observable<void> {
    const index = this.rutas.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    this.rutas.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  getAuditLogRuta(id: string): Observable<RutaAuditLog[]> {
    const ruta = this.rutas.find(r => r.id === id);
    if (!ruta) {
      return of([]);
    }

    const logs: RutaAuditLog[] = [
      {
        id: '1',
        rutaId: id,
        accion: 'CREAR',
        descripcion: 'Ruta creada',
        usuario: ruta.usuarioCreacion,
        fecha: ruta.fechaCreacion,
        datosAnteriores: null,
        datosNuevos: ruta,
        ip: '192.168.1.100'
      }
    ];

    if (ruta.fechaModificacion && ruta.usuarioModificacion) {
      logs.push({
        id: '2',
        rutaId: id,
        accion: 'ACTUALIZAR',
        descripcion: 'Ruta modificada',
        usuario: ruta.usuarioModificacion,
        fecha: ruta.fechaModificacion,
        datosAnteriores: null,
        datosNuevos: ruta,
        ip: '192.168.1.100'
      });
    }

    return of(logs).pipe(delay(200));
  }

  getRutaStats(): Observable<RutaStats> {
    const rutasActivas = this.rutas.filter(r => !r.eliminado && r.estaActivo);
    const rutasInactivas = this.rutas.filter(r => !r.eliminado && !r.estaActivo);
    const rutasEliminadas = this.rutas.filter(r => r.eliminado);

    const porEstado: Record<string, number> = {};
    const porTipo: Record<string, number> = {};
    const porCategoria: Record<string, number> = {};

    this.rutas.filter(r => !r.eliminado).forEach(ruta => {
      porEstado[ruta.estado] = (porEstado[ruta.estado] || 0) + 1;
      porTipo[ruta.tipoRuta] = (porTipo[ruta.tipoRuta] || 0) + 1;
      porCategoria[ruta.categoria] = (porCategoria[ruta.categoria] || 0) + 1;
    });

    const stats: RutaStats = {
      total: this.rutas.filter(r => !r.eliminado).length,
      activas: rutasActivas.length,
      inactivas: rutasInactivas.length,
      eliminadas: rutasEliminadas.length,
      porEstado,
      porTipo,
      porCategoria,
      distanciaTotal: this.rutas
        .filter(r => !r.eliminado && r.distancia)
        .reduce((sum, r) => sum + (r.distancia || 0), 0),
      tiempoPromedio: this.rutas
        .filter(r => !r.eliminado && r.tiempoEstimado)
        .reduce((sum, r) => sum + (r.tiempoEstimado || 0), 0) / 
        this.rutas.filter(r => !r.eliminado && r.tiempoEstimado).length || 0
    };

    return of(stats).pipe(delay(200));
  }

  cambiarEstadoRuta(id: string, nuevoEstado: string, observaciones?: string): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    const estadoAnterior = this.rutas[index].estado;
    
    this.rutas[index] = {
      ...this.rutas[index],
      estado: nuevoEstado as any,
      estaActivo: nuevoEstado === 'ACTIVA',
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    // Agregar al historial
    if (!this.rutas[index].historial) {
      this.rutas[index].historial = [];
    }
    this.rutas[index].historial!.push({
      id: Math.random().toString(36).substr(2, 9),
      fecha: new Date(),
      accion: 'CAMBIO_ESTADO',
      descripcion: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
      observaciones: observaciones || '',
      usuario: 'usuario_actual',
      documentos: []
    });

    return of(this.rutas[index]).pipe(delay(300));
  }

  asignarEmpresaRuta(rutaId: string, empresaId: string): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (!this.rutas[index].empresasOperadoras) {
      this.rutas[index].empresasOperadoras = [];
    }
    if (!this.rutas[index].empresasOperadoras.includes(empresaId)) {
      this.rutas[index].empresasOperadoras.push(empresaId);
      
      this.rutas[index] = {
        ...this.rutas[index],
        fechaModificacion: new Date(),
        usuarioModificacion: 'usuario_actual',
        version: this.rutas[index].version + 1
      };
    }

    return of(this.rutas[index]).pipe(delay(300));
  }

  removerEmpresaRuta(rutaId: string, empresaId: string): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (this.rutas[index].empresasOperadoras) {
      this.rutas[index].empresasOperadoras = this.rutas[index].empresasOperadoras.filter(id => id !== empresaId);
    }
    
    this.rutas[index] = {
      ...this.rutas[index],
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  asignarVehiculoRuta(rutaId: string, vehiculoId: string): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (!this.rutas[index].vehiculosAsignados) {
      this.rutas[index].vehiculosAsignados = [];
    }
    if (!this.rutas[index].vehiculosAsignados.includes(vehiculoId)) {
      this.rutas[index].vehiculosAsignados.push(vehiculoId);
      
      this.rutas[index] = {
        ...this.rutas[index],
        fechaModificacion: new Date(),
        usuarioModificacion: 'usuario_actual',
        version: this.rutas[index].version + 1
      };
    }

    return of(this.rutas[index]).pipe(delay(300));
  }

  removerVehiculoRuta(rutaId: string, vehiculoId: string): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (this.rutas[index].vehiculosAsignados) {
      this.rutas[index].vehiculosAsignados = this.rutas[index].vehiculosAsignados.filter(id => id !== vehiculoId);
    }
    
    this.rutas[index] = {
      ...this.rutas[index],
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  agregarHorarioRuta(rutaId: string, horario: {
    dia: string;
    horaSalida: string;
    horaLlegada: string;
    frecuencia: string;
  }): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (!this.rutas[index].horarios) {
      this.rutas[index].horarios = [];
    }
    this.rutas[index].horarios!.push({
      id: Math.random().toString(36).substr(2, 9),
      dia: horario.dia as any,
      horaSalida: horario.horaSalida,
      horaLlegada: horario.horaLlegada,
      frecuencia: horario.frecuencia ? parseInt(horario.frecuencia) : 60,
      tipoServicio: 'REGULAR',
      activo: true
    });
    
    this.rutas[index] = {
      ...this.rutas[index],
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  agregarTarifaRuta(rutaId: string, tarifa: {
    tipoPasajero: string;
    precio: number;
    descripcion?: string;
  }): Observable<Ruta> {
    const index = this.rutas.findIndex(r => r.id === rutaId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    if (!this.rutas[index].tarifas) {
      this.rutas[index].tarifas = [];
    }
    this.rutas[index].tarifas!.push({
      id: Math.random().toString(36).substr(2, 9),
      tipoPasajero: tarifa.tipoPasajero as any,
      precio: tarifa.precio,
      moneda: 'PEN',
      vigenteDesde: new Date(),
      activo: true
    });
    
    this.rutas[index] = {
      ...this.rutas[index],
      fechaModificacion: new Date(),
      usuarioModificacion: 'usuario_actual',
      version: this.rutas[index].version + 1
    };

    return of(this.rutas[index]).pipe(delay(300));
  }

  buscarRutas(texto: string): Observable<Ruta[]> {
    const resultados = this.rutas.filter(r => 
      !r.eliminado && (
        r.codigoRuta.toLowerCase().includes(texto.toLowerCase()) ||
        r.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        r.origen.toLowerCase().includes(texto.toLowerCase()) ||
        r.destino.toLowerCase().includes(texto.toLowerCase())
      )
    );
    return of(resultados).pipe(delay(200));
  }

  exportarRutas(filtros: RutaFilter, formato: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    // Mock de exportación
    const contenido = 'Rutas exportadas';
    const blob = new Blob([contenido], { type: 'text/plain' });
    return of(blob).pipe(delay(500));
  }

  generarCodigoRuta(): Observable<string> {
    const count = this.rutas.length + 1;
    return of(`PUN-JUL-${count.toString().padStart(2, '0')}`).pipe(delay(100));
  }

  validarCodigoRuta(codigo: string): Observable<boolean> {
    const regex = /^[A-Z]{3}-[A-Z]{3}-\d{2}$/;
    const existe = this.rutas.some(r => r.codigoRuta === codigo);
    return of(regex.test(codigo) && !existe).pipe(delay(100));
  }
} 