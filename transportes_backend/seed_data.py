import asyncio
import argparse
from datetime import datetime, timedelta
from typing import List, Optional
import random

from beanie import PydanticObjectId
from faker import Faker

from app.database import initiate_database
from app.core.config import settings

# Import all models
from app.models.usuario import Usuario, LicenciaConducir
from app.models.empresa import Empresa, Domicilio, RepresentanteLegal, InfoSunat
from app.models.vehiculo import Vehiculo
from app.models.conductor import Conductor, LicenciaConducirConductor, EmpresaAsociadaConductor
from app.models.ruta import Ruta, PuntoRuta, FrecuenciaRuta
from app.models.expediente import Expediente, DocumentoAdjunto, InformeTecnico, OpinionLegal, ObservacionHistorial
from app.models.resolucion import Resolucion, VehiculoAfectado, RutaAfectada
from app.models.tuc import TUC, RutaDesignadaTUC, HistorialEstadoTUC
from app.models.infraccion_multa import InfraccionMulta
from app.models.papeleta import Papeleta
from app.models.terminal_terrestre import TerminalTerrestre, Ubicacion


fake = Faker('es_ES')

# Listas de marcas y modelos de vehículos comunes en Perú
MARCAS_VEHICULO = [
    "Toyota", "Hyundai", "Kia", "Nissan", "Chevrolet", "Volkswagen", "Suzuki",
    "Mitsubishi", "Mazda", "Honda", "Mercedes-Benz", "BMW", "Audi", "Ford",
    "Renault", "Peugeot", "Citroën", "Subaru", "Volvo", "Jeep", "Land Rover",
    "SsangYong", "Changan", "Jac", "Great Wall", "Chery", "MG", "BYD"
]

MODELOS_VEHICULO = {
    "Toyota": ["Hilux", "Corolla", "Yaris", "Rav4", "Fortuner", "Etios", "Avanza"],
    "Hyundai": ["Elantra", "Tucson", "Creta", "Accent", "Grand i10", "Kona"],
    "Kia": ["Sportage", "Rio", "Cerato", "Seltos", "Picanto", "Sorento"],
    "Nissan": ["Frontier", "Kicks", "Versa", "Sentra", "Qashqai", "X-Trail"],
    "Chevrolet": ["Tracker", "Onix", "Captiva", "Groove", "Colorado"],
    "Volkswagen": ["Amarok", "Virtus", "T-Cross", "Taos", "Gol", "Voyage"],
    "Suzuki": ["Swift", "Vitara", "Baleno", "Ertiga", "Jimny"],
    "Mitsubishi": ["L200", "Outlander", "ASX", "Mirage", "Montero Sport"],
    "Mazda": ["CX-5", "Mazda3", "CX-30", "Mazda2"],
    "Honda": ["CR-V", "HR-V", "Civic", "WR-V"],
    "Mercedes-Benz": ["Clase C", "Clase E", "GLC", "GLE"],
    "BMW": ["Serie 3", "Serie 5", "X1", "X3", "X5"],
    "Audi": ["A3", "A4", "Q3", "Q5"],
    "Ford": ["Ranger", "Explorer", "Escape", "Territory"],
    "Renault": ["Duster", "Kwid", "Stepway", "Oroch"],
    "Peugeot": ["2008", "3008", "208", "Partner"],
    "Citroën": ["C3", "C4 Cactus", "C-Elysée"],
    "Subaru": ["Forester", "XV", "Outback"],
    "Volvo": ["XC60", "XC40", "S60"],
    "Jeep": ["Renegade", "Compass", "Wrangler"],
    "Land Rover": ["Discovery Sport", "Range Rover Evoque"],
    "SsangYong": ["Korando", "Tivoli", "Rexton"],
    "Changan": ["CS15", "CS35 Plus", "Alsvin"],
    "Jac": ["JS2", "JS3", "JS4", "T6"],
    "Great Wall": ["Poer", "Haval H6", "Haval Jolion"],
    "Chery": ["Tiggo 2", "Tiggo 3X", "Tiggo 7 Pro"],
    "MG": ["ZS", "HS", "MG5"],
    "BYD": ["Dolphin", "Atto 3", "Song Plus DM-i"]
}

LIMA_TZ = datetime.now().astimezone().tzinfo # Get local timezone for datetime.now()

async def create_seed_data(num_users: int = 5, num_empresas: int = 3, num_vehiculos_per_empresa: int = 2):
    print("Creando datos de ejemplo...")

    # 1. Crear Usuarios
    users = []
    for _ in range(num_users):
        user = Usuario(
            username=fake.user_name(),
            password_hash="hashed_password", # En un entorno real, esto sería un hash
            nombres=fake.first_name(),
            apellidos=fake.last_name(),
            dni=fake.unique.numerify(text='########'),
            email=fake.unique.email(),
            roles=random.choice([["admin"], ["analista_tecnico"], ["mesa_partes"], ["admin", "analista_tecnico"]]),
            licencia_conducir=LicenciaConducir(
                numero=fake.unique.bothify(text='???-####'),
                clase_categoria=random.choice(["A-I", "A-IIa", "A-IIb", "A-IIIa", "A-IIIb", "A-IIIc"]),
                fecha_emision=fake.date_time_between(start_date="-5y", end_date="-2y", tzinfo=LIMA_TZ),
                fecha_vencimiento=fake.date_time_between(start_date="+1y", end_date="+5y", tzinfo=LIMA_TZ),
                puntos=random.randint(50, 100)
            ) if random.random() > 0.3 else None,
            origen_dato="SEED_DATA"
        )
        await user.insert()
        users.append(user)
    print(f"Creados {len(users)} usuarios.")

    # 2. Crear Empresas
    empresas = []
    for _ in range(num_empresas):
        empresa = Empresa(
            ruc=fake.unique.numerify(text='###########'),
            razon_social=fake.company(),
            nombre_comercial=fake.company_suffix(),
            domicilio_legal=Domicilio(
                calle=fake.street_name(),
                distrito=fake.city(),
                provincia=fake.city(),
                departamento=fake.state(),
                codigo_postal=fake.postcode()
            ),
            telefono=fake.phone_number(),
            email=fake.unique.company_email(),
            representante_legal=RepresentanteLegal(
                dni=fake.unique.numerify(text='########'),
                nombres=fake.first_name(),
                apellidos=fake.last_name()
            ),
            partida_registral=str(fake.unique.random_number(digits=8)), # Corrected: Convert to string
            estado_habilitacion_mtc=random.choice(["Habilitado", "Suspendido"]),
            origen_dato="SEED_DATA"
        )
        await empresa.insert()
        empresas.append(empresa)
    print(f"Creadas {len(empresas)} empresas.")

    # 3. Crear Vehículos y Conductores asociados a Empresas
    vehiculos = []
    conductores = []
    for empresa in empresas:
        for _ in range(num_vehiculos_per_empresa):
            marca_elegida = random.choice(MARCAS_VEHICULO)
            modelo_elegido = random.choice(MODELOS_VEHICULO.get(marca_elegida, [fake.word()])) # Fallback if brand not in dict
            vehiculo = Vehiculo(
                placa=fake.unique.bothify(text='???-####'),
                empresa_id=empresa.id,
                tipo_servicio_principal=random.choice(["Transporte de Personas - Nacional", "Carga - Regional"]),
                marca=marca_elegida,
                modelo=modelo_elegido,
                anio_fabricacion=random.randint(2000, 2023),
                categoria=random.choice(["M1", "M2", "M3"]),
                numero_serie_chasis=fake.unique.vin(),
                origen_dato="SEED_DATA"
            )
            await vehiculo.insert()
            vehiculos.append(vehiculo)

            conductor = Conductor(
                dni=fake.unique.numerify(text='########'), # Corrected: Use numerify
                nombres=fake.first_name(),
                apellidos=fake.last_name(),
                licencia_conducir=LicenciaConducirConductor(
                    numero=fake.unique.bothify(text='???-####'), # Corrected: Use bothify
                    clase_categoria=random.choice(["A-I", "A-IIa", "A-IIb", "A-IIIa", "A-IIIb", "A-IIIc"]),
                    fecha_emision=fake.date_time_between(start_date="-5y", end_date="-2y", tzinfo=LIMA_TZ),
                    fecha_vencimiento=fake.date_time_between(start_date="+1y", end_date="+5y", tzinfo=LIMA_TZ),
                    puntos=random.randint(50, 100)
                ),
                empresas_asociadas=[EmpresaAsociadaConductor(
                    empresa_id=empresa.id,
                    fecha_inicio=fake.date_time_between(start_date="-2y", end_date="now", tzinfo=LIMA_TZ),
                    cargo=random.choice(["Conductor", "Conductor Auxiliar"])
                )],
                origen_dato="SEED_DATA"
            )
            await conductor.insert()
            conductores.append(conductor)
    print(f"Creados {len(vehiculos)} vehículos y {len(conductores)} conductores.")

    # 4. Crear Terminales Terrestres
    terminales = []
    for _ in range(num_empresas): # Crear un terminal por empresa para simplificar
        terminal = TerminalTerrestre(
            nombre=f"Terminal {fake.city()} {fake.street_name()}",
            ubicacion=Ubicacion(
                ciudad=fake.city(),
                departamento=fake.state(),
                direccion=fake.address(),
                latitud=float(fake.latitude()),
                longitud=float(fake.longitude())
            ),
            empresas_usuarios=[random.choice(empresas).id],
            origen_dato="SEED_DATA"
        )
        await terminal.insert()
        terminales.append(terminal)
    print(f"Creados {len(terminales)} terminales terrestres.")

    # 5. Crear Rutas
    rutas = []
    for _ in range(num_empresas * 2): # Crear más rutas que empresas
        empresa_autorizada = random.choice(empresas)
        ruta = Ruta(
            codigo_ruta=fake.unique.bothify(text='Ruta-###-???'),
            origen=PuntoRuta(ciudad=fake.city(), departamento=fake.state(), terminal_id=random.choice(terminales).id if terminales else None),
            destino=PuntoRuta(ciudad=fake.city(), departamento=fake.state(), terminal_id=random.choice(terminales).id if terminales else None),
            puntos_intermedios=[fake.city() for _ in range(random.randint(0, 2))],
            distancia_km=round(random.uniform(50, 1000), 2),
            tiempo_estimado_horas=round(random.uniform(1, 15), 2),
            frecuencias=[FrecuenciaRuta(dia_semana=random.choice(["Lunes", "Martes", "Diario"]), hora_salida=fake.time()) for _ in range(random.randint(1, 3))],
            tipo_servicio=random.choice(["Regular", "Expreso", "Especial", "Turístico"]),
            empresa_autorizada_id=empresa_autorizada.id,
            ruc_empresa_autorizada=empresa_autorizada.ruc,
            resolucion_autorizacion_id=PydanticObjectId(), # Placeholder, se actualizará con resoluciones reales
            numero_resolucion_autorizacion=fake.unique.bothify(text='Res-####-??'),
            estado_ruta_mtc=random.choice(["Autorizada", "Suspendida"]),
            observaciones=fake.sentence(),
            origen_dato="SEED_DATA"
        )
        await ruta.insert()
        rutas.append(ruta)
    print(f"Creadas {len(rutas)} rutas.")

    # 6. Crear Expedientes y Resoluciones
    expedientes = []
    resoluciones = []
    for _ in range(num_empresas * 2):
        empresa_solicitante = random.choice(empresas)
        expediente = Expediente(
            numero_expediente=fake.unique.bothify(text='EXP-#####-YY'),
            empresa_solicitante_id=empresa_solicitante.id,
            tipo_tramite=random.choice(["AUTORIZACION NUEVA", "INCREMENTO", "RENOVACION", "SUSTITUCION", "BAJA"]),
            fecha_inicio_tramite=fake.date_time_between(start_date="-2y", end_date="now", tzinfo=LIMA_TZ),
            estado_expediente=random.choice(["En Proceso", "Observado", "Aprobado", "Rechazado"]),
            resumen_solicitud=fake.paragraph(),
            numero_folios=random.randint(10, 100),
            documentos_adjuntos=[DocumentoAdjunto(nombre_documento=fake.file_name(), url=fake.url()) for _ in range(random.randint(1, 3))],
            informes_tecnicos=[InformeTecnico(numero_informe=fake.unique.bothify(text='INF-####'), autor_usuario_id=random.choice(users).id, resumen_informe=fake.sentence(), estado=random.choice(["Aprobado", "Pendiente"])) for _ in range(random.randint(0, 1))],
            opiniones_legales=[OpinionLegal(numero_opinion=fake.unique.bothify(text='OPL-####'), autor_usuario_id=random.choice(users).id, resumen_opinion=fake.sentence(), estado=random.choice(["Aprobado", "Pendiente"])) for _ in range(random.randint(0, 1))],
            observaciones_historial=[ObservacionHistorial(descripcion=fake.sentence(), usuario_responsable_id=random.choice(users).id) for _ in range(random.randint(0, 2))],
            fecha_cierre_expediente=fake.date_time_between(start_date=datetime.now(LIMA_TZ) - timedelta(days=30), end_date="now", tzinfo=LIMA_TZ) if random.random() > 0.5 else None,
            origen_dato="SEED_DATA"
        )
        await expediente.insert()
        expedientes.append(expediente)

        if expediente.estado_expediente == "Aprobado":
            resolucion = Resolucion(
                numero_resolucion=fake.unique.bothify(text='RES-####-MTC'),
                expediente_origen_id=expediente.id,
                tipo_tramite=expediente.tipo_tramite,
                fecha_emision=fake.date_time_between(start_date="-1y", end_date="now", tzinfo=LIMA_TZ),
                fecha_inicio_vigencia=fake.date_time_between(start_date="-1y", end_date="now", tzinfo=LIMA_TZ),
                anios_vigencia=random.randint(1, 5),
                fecha_fin_vigencia=fake.date_time_between(start_date="now", end_date="+3y", tzinfo=LIMA_TZ),
                empresa_afectada_id=empresa_solicitante.id,
                ruc_empresa_afectada=empresa_solicitante.ruc,
                estado_resolucion="Vigente",
                observaciones=fake.sentence(),
                origen_dato="SEED_DATA"
            )
            # Asociar vehículos y rutas a la resolución
            if vehiculos:
                num_vehiculos_afectados = random.randint(1, min(3, len(vehiculos)))
                for _ in range(num_vehiculos_afectados):
                    veh = random.choice(vehiculos)
                    resolucion.vehiculos_afectados.append(VehiculoAfectado(
                        vehiculo_id=veh.id,
                        placa=veh.placa,
                        accion=random.choice(["Adición", "Sustitución", "Baja", "Reasignación"])
                    ))
            if rutas:
                num_rutas_afectadas = random.randint(1, min(2, len(rutas)))
                for _ in range(num_rutas_afectadas):
                    rut = random.choice(rutas)
                    resolucion.rutas_afectadas.append(RutaAfectada(
                        ruta_id=rut.id,
                        codigo_ruta=rut.codigo_ruta,
                        accion=random.choice(["Autorización Nueva", "Modificación", "Suspensión", "Cancelación"])
                    ))
            await resolucion.insert()
            resoluciones.append(resolucion)

            # Actualizar expediente con resolución asociada
            expediente.resoluciones_asociadas.append(resolucion.id)
            await expediente.save()

            # Actualizar rutas con resolución de autorización
            for r_afectada in resolucion.rutas_afectadas:
                r = await Ruta.get(r_afectada.ruta_id)
                if r:
                    r.resolucion_autorizacion_id = resolucion.id
                    r.numero_resolucion_autorizacion = resolucion.numero_resolucion
                    await r.save()

    print(f"Creados {len(expedientes)} expedientes y {len(resoluciones)} resoluciones.")

    # 7. Crear TUCs (Tarjetas Únicas de Circulación)
    tucs = []
    for res in resoluciones:
        for veh_afectado in res.vehiculos_afectados:
            veh = await Vehiculo.get(veh_afectado.vehiculo_id)
            emp = await Empresa.get(res.empresa_afectada_id)
            if veh and emp:
                rutas_designadas_list = []
                for r_afectada in res.rutas_afectadas:
                    r = await Ruta.get(r_afectada.ruta_id)
                    if r:
                        rutas_designadas_list.append(RutaDesignadaTUC(
                            ruta_id=r.id,
                            codigo_ruta=r.codigo_ruta,
                            origen_ciudad=r.origen.ciudad,
                            destino_ciudad=r.destino.ciudad
                        ))

                tuc = TUC(
                    numero_tuc=fake.unique.bothify(text='TUC-#####-??'),
                    numero_tuc_primigenia=fake.unique.bothify(text='TUC-#####-??') if random.random() > 0.5 else None,
                    tipo_generacion=random.choice(["EMISION_INICIAL", "RENOVACION", "SUSTITUCION", "RECTIFICACION"]),
                    empresa_id=emp.id,
                    ruc_empresa=emp.ruc,
                    razon_social_empresa=emp.razon_social,
                    nombre_representante_legal=emp.representante_legal.nombres + " " + emp.representante_legal.apellidos if emp.representante_legal else None,
                    vehiculo_id=veh.id,
                    placa_vehiculo=veh.placa,
                    marca_vehiculo=veh.marca,
                    modelo_vehiculo=veh.modelo,
                    anio_fabricacion_vehiculo=veh.anio_fabricacion,
                    color_vehiculo=veh.color,
                    categoria_vehiculo=veh.categoria,
                    carroceria_vehiculo=veh.carroceria,
                    clase_vehiculo=veh.clase,
                    combustible_vehiculo=veh.combustible,
                    numero_motor_vehiculo=veh.numero_motor,
                    numero_serie_vin_vehiculo=veh.numero_serie_chasis,
                    num_asientos_vehiculo=veh.num_asientos,
                    num_pasajeros_vehiculo=veh.capacidad_pasajeros,
                    cilindros_vehiculo=veh.cilindros,
                    ejes_vehiculo=veh.ejes,
                    ruedas_vehiculo=veh.ruedas,
                    peso_bruto_vehiculo=veh.peso_bruto_vehicular,
                    peso_neto_vehiculo=veh.peso_neto,
                    carga_util_vehiculo=veh.carga_util,
                    largo_vehiculo=veh.largo,
                    ancho_vehiculo=veh.ancho,
                    alto_vehiculo=veh.alto,
                    resolucion_origen_id=res.id,
                    numero_resolucion=res.numero_resolucion,
                    fecha_resolucion=res.fecha_emision,
                    tipo_resolucion=res.tipo_tramite,
                    expediente_id=res.expediente_origen_id,
                    numero_expediente=(await Expediente.get(res.expediente_origen_id)).numero_expediente if await Expediente.get(res.expediente_origen_id) else "N/A",
                    rutas_designadas=rutas_designadas_list,
                    fecha_emision=fake.date_time_between(start_date="-6m", end_date="now", tzinfo=LIMA_TZ),
                    fecha_vencimiento=res.fecha_fin_vigencia,
                    estado="HABILITADO",
                    motivo_estado=fake.sentence() if random.random() > 0.7 else None,
                    observaciones_tuc=fake.paragraph() if random.random() > 0.5 else None,
                    historial_estados=[HistorialEstadoTUC(estado="HABILITADO", fecha=fake.date_time_between(start_date="-1y", end_date="now", tzinfo=LIMA_TZ), motivo="Emisión inicial", usuario_id=random.choice(users).id)],
                    origen_dato="SEED_DATA"
                )
                await tuc.insert()
                tucs.append(tuc)
                # Actualizar vehículo con TUC asociada
                veh.tucs_asociadas.append(tuc.id)
                await veh.save()
    print(f"Creadas {len(tucs)} TUCs.")

    # 8. Crear Infracciones y Multas
    infracciones = []
    for _ in range(num_users * 2):
        empresa_resp = random.choice(empresas)
        veh_involucrado = random.choice(vehiculos) if vehiculos else None
        cond_involucrado = random.choice(conductores) if conductores else None

        infraccion = InfraccionMulta(
            numero_infraccion=fake.unique.bothify(text='INF-######'),
            fecha_infraccion=fake.date_time_between(start_date="-1y", end_date="now", tzinfo=LIMA_TZ),
            tipo_infraccion=random.choice(["Leve", "Grave", "Muy Grave"]),
            codigo_infraccion=fake.bothify(text='[A-Z].##'),
            descripcion_infraccion=fake.sentence(),
            monto_multa=round(random.uniform(100, 5000), 2),
            empresa_responsable_id=empresa_resp.id,
            ruc_empresa_responsable=empresa_resp.ruc,
            vehiculo_involucrado_id=veh_involucrado.id if veh_involucrado else None,
            placa_vehiculo_involucrado=veh_involucrado.placa if veh_involucrado else None,
            conductor_involucrado_id=cond_involucrado.id if cond_involucrado else None,
            dni_conductor_involucrado=cond_involucrado.dni if cond_involucrado else None,
            autoridad_emisora=random.choice(["SUTRAN", "Policía Nacional", "DRTC Puno"]),
            estado_multa=random.choice(["PENDIENTE", "PAGADA", "IMPUGNADA"]),
            fecha_notificacion=fake.date_time_between(start_date="-6m", end_date="now", tzinfo=LIMA_TZ) if random.random() > 0.3 else None,
            fecha_pago=fake.date_time_between(start_date=datetime.now(LIMA_TZ) - timedelta(days=30), end_date="now", tzinfo=LIMA_TZ) if random.random() > 0.5 else None,
            monto_pagado=round(random.uniform(50, 4000), 2) if random.random() > 0.5 else None,
            observaciones_multa=fake.paragraph() if random.random() > 0.5 else None,
            origen_dato="SEED_DATA"
        )
        await infraccion.insert()
        infracciones.append(infraccion)
    print(f"Creadas {len(infracciones)} infracciones y multas.")

    # 9. Crear Papeletas
    papeletas = []
    for _ in range(num_users * 2):
        empresa_resp = random.choice(empresas)
        veh_involucrado = random.choice(vehiculos) if vehiculos else None
        cond_involucrado = random.choice(conductores) if conductores else None

        papeleta = Papeleta(
            numero_papeleta=fake.unique.bothify(text='PAP-######'),
            fecha_infraccion=fake.date_time_between(start_date="-1y", end_date="now", tzinfo=LIMA_TZ),
            tipo_infraccion=random.choice(["Leve", "Grave", "Muy Grave"]),
            codigo_infraccion=fake.bothify(text='[A-Z].##'),
            descripcion_infraccion=fake.sentence(),
            monto_multa=round(random.uniform(50, 2000), 2),
            empresa_responsable_id=empresa_resp.id,
            ruc_empresa_responsable=empresa_resp.ruc,
            vehiculo_involucrado_id=veh_involucrado.id if veh_involucrado else None,
            placa_vehiculo_involucrado=veh_involucrado.placa if veh_involucrado else None,
            conductor_involucrado_id=cond_involucrado.id if cond_involucrado else None,
            dni_conductor_involucrado=cond_involucrado.dni if cond_involucrado else None,
            autoridad_emisora=random.choice(["Policía Nacional", "DRTC Puno"]),
            estado_multa=random.choice(["PENDIENTE", "PAGADA"]),
            fecha_notificacion=fake.date_time_between(start_date="-6m", end_date="now", tzinfo=LIMA_TZ) if random.random() > 0.3 else None,
            fecha_pago=fake.date_time_between(start_date=datetime.now(LIMA_TZ) - timedelta(days=30), end_date="now", tzinfo=LIMA_TZ) if random.random() > 0.5 else None,
            monto_pagado=round(random.uniform(20, 1500), 2) if random.random() > 0.5 else None,
            observaciones_multa=fake.paragraph() if random.random() > 0.5 else None,
            origen_dato="SEED_DATA"
        )
        await papeleta.insert()
        papeletas.append(papeleta)
    print(f"Creadas {len(papeletas)} papeletas.")

    print("Datos de ejemplo creados exitosamente.")

async def delete_seed_data():
    print("Eliminando datos de ejemplo...")
    
    # Lista de todos los modelos a limpiar
    models_to_clean = [
        Usuario, Empresa, Vehiculo, Conductor, Ruta, Expediente,
        Resolucion, TUC, InfraccionMulta, Papeleta, TerminalTerrestre
    ]

    for Model in models_to_clean:
        deleted_count = await Model.find(Model.origen_dato == "SEED_DATA").delete()
        print(f"Eliminados {deleted_count} documentos de la colección '{Model.Settings.name}'.")
    
    print("Datos de ejemplo eliminados exitosamente.")

async def main():
    # Conectar a la base de datos
    try:
        await initiate_database()
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return

    parser = argparse.ArgumentParser(description="Script para crear o eliminar datos de ejemplo en la base de datos.")
    parser.add_argument("--crear", action="store_true", help="Crea datos de ejemplo.")
    parser.add_argument("--eliminar", action="store_true", help="Elimina datos de ejemplo.")
    
    args = parser.parse_args()

    if args.crear:
        await create_seed_data() # Corrected indentation
    elif args.eliminar:
        await delete_seed_data() # Corrected indentation
    else:
        print("Por favor, especifica --crear para crear datos o --eliminar para eliminarlos.")
if __name__ == "__main__":
    asyncio.run(main())