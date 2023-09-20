import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Persona } from 'src/app/models/personaModel';
import { Reserva } from 'src/app/models/reservaModel';
import { PersonaService } from 'src/app/service/persona.service';
import { ReservaService } from 'src/app/service/reserva.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent {
  //Formulario de filtros
  formFiltrar = new FormGroup({
    doctorNombre: new FormControl(''),
    doctorApellido: new FormControl(''),
    pacienteNombre: new FormControl(''),
    pacienteApellido: new FormControl(''),
    fechaDesde: new FormControl(''),
    fechaHasta: new FormControl(''),
  });

  //Formulario para crear Reserva
  formNuevo = new FormGroup(
    {
      doctorNombre: new FormControl(''),
      doctorApellido: new FormControl(''),
      pacienteNombre: new FormControl(''),
      pacienteApellido: new FormControl(''),
      fecha: new FormControl(''),
      hora: new FormControl(''),
    },
    {}
  );

  //Lista de todas las reservas
  allReservas: Reserva[] = [];
  //lista de todos los doctores
  allDoctores: Persona[] = [];
  //lista de todos los pacientes
  allPacientes: Persona[] = [];
  //lista de todas las reservas filtradas
  reservasFiltradas: Reserva[] = [];
  //lista de todos los doctores filtrados
  doctoresFiltrados: Persona[] = [];
  //lista de todos los pacientes filtrados
  pacientesFiltrados: Persona[] = [];
  //fecha actual
  fechaActual: string;
  ////Seccion para formulario de nueva reserva
  doctoresNuevosFiltrados: Persona[] = [];
  pacientesNuevosFiltrados: Persona[] = [];
  permitidoGuardar: boolean = false;

  nuevaReserva: any = {
    fechaInicioReserva: '',
    fechaFinReserva: '',
    idPaciente: '',
    idDoctor: '',
  };

  // Horas disponibles
  horasDisponibles: any[] = [
    { texto: '09:00 a 10:00', horaInicio: '09:00', horaFin: '10:00' },
    { texto: '10:00 a 11:00', horaInicio: '10:00', horaFin: '11:00' },
    { texto: '11:00 a 12:00', horaInicio: '11:00', horaFin: '12:00' },
    { texto: '12:00 a 13:00', horaInicio: '12:00', horaFin: '13:00' },
    { texto: '13:00 a 14:00', horaInicio: '13:00', horaFin: '14:00' },
    { texto: '14:00 a 15:00', horaInicio: '14:00', horaFin: '15:00' },
    { texto: '15:00 a 16:00', horaInicio: '15:00', horaFin: '16:00' },
    { texto: '16:00 a 17:00', horaInicio: '16:00', horaFin: '17:00' },
    { texto: '17:00 a 18:00', horaInicio: '17:00', horaFin: '18:00' },
    { texto: '18:00 a 19:00', horaInicio: '18:00', horaFin: '19:00' },
    { texto: '19:00 a 20:00', horaInicio: '19:00', horaFin: '20:00' },
    { texto: '20:00 a 21:00', horaInicio: '20:00', horaFin: '21:00' },
  ];

  //variable utilizada cuando se va a cancelar una reserva
  reservaACancelar: Reserva = new Reserva();

  constructor(
    private reservaService: ReservaService,
    private personaService: PersonaService
  ) {
    this.fechaActual = this.formatearFecha(new Date());
  }

  ngOnInit(): void {
    forkJoin([
      this.personaService.getAll(),
      this.reservaService.getAll(),
    ]).subscribe({
      next: (valor) => {
        this.allDoctores = valor[0].lista.filter(
          (elemento) => elemento.esDoctor === true
        );

        this.allPacientes = valor[0].lista.filter(
          (elemento) => elemento.esDoctor === false
        );

        this.allReservas = valor[1].lista;
        this.filtrar();
      },
    });

    this.formFiltrar.setValue({
      doctorNombre: '',
      doctorApellido: '',
      pacienteNombre: '',
      pacienteApellido: '',
      fechaDesde: this.fechaActual,
      fechaHasta: this.fechaActual,
    });
    this.formNuevo.valueChanges.subscribe({
      next: (valor) => {
        if (
          this.nuevaReserva.idDoctor !== '' &&
          this.nuevaReserva.idPaciente !== '' &&
          valor.fecha !== '' &&
          valor.hora !== ''
        ) {
          this.nuevaReserva.fechaInicioReserva = this.pasarAISO(
            valor.fecha!,
            this.horasDisponibles.find(
              (elemento) => elemento.texto === valor.hora
            )?.horaInicio!
          );
          this.nuevaReserva.fechaFinReserva = this.pasarAISO(
            valor.fecha!,
            this.horasDisponibles.find(
              (elemento) => elemento.texto === valor.hora
            )?.horaFin!
          );
          this.permitidoGuardar = true;
        } else {
          this.permitidoGuardar = false;
        }
      },
    });
    this.formNuevo.setValue({
      doctorNombre: '',
      doctorApellido: '',
      pacienteNombre: '',
      pacienteApellido: '',
      fecha: '',
      hora: '',
    });

    this.filtrar();
  }

  /**
   * descompone un texto de fecha en formato ISO a solo la fecha
   * @param isoString String en formato ISO a ser formateado
   * @returns String con solo la fecha en formato yyyy-mm-dd
   */
  formatearFecha(fechaISO: Date): string {
    const fecha = new Date(fechaISO);
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  /**
   * descompone un texto de fecha en formato ISO a solo la hora
   * @param isoString String en formato ISO a ser formateado
   * @returns String con solo la hora en formato hh:mm
   */
  formatearHora(fechaISO: Date): string {
    const fecha = new Date(fechaISO);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  /**
   * Función para convertir fecha y hora en un string ISO
   * @param dateString string de fecha en formato dd/mm/yyyy
   * @param timeString string de la hora en formato hh:mm
   * @returns string en formato ISO para enviar a la API
   */
  pasarAISO(fecha: string, hora: string): string {
    const [horas, minutos] = hora.split(':');
    const fechaISO = new Date(`${fecha}T${horas}:${minutos}:00`);
    return fechaISO.toISOString().split('.')[0];
  }

  /**
   * Filtra la lista con los parámetros insertados en el formulario
   */
  filtrar(): void {
    if (
      this.formFiltrar.value.doctorNombre !== '' ||
      this.formFiltrar.value.doctorApellido !== ''
    ) {
      this.doctoresFiltrados = this.allDoctores.filter((doctor) => {
        const doctorNombreMatch = this.formFiltrar.value.doctorNombre
          ? doctor.nombre
              .toLowerCase()
              .includes(this.formFiltrar.value.doctorNombre.toLowerCase())
          : true;
        const doctorApellidoMatch = this.formFiltrar.value.doctorApellido
          ? doctor.apellido
              .toLowerCase()
              .includes(this.formFiltrar.value.doctorApellido.toLowerCase())
          : true;
        return doctorNombreMatch && doctorApellidoMatch;
      });
    } else {
      this.doctoresFiltrados = [...this.allDoctores];
    }
    if (
      this.formFiltrar.value.pacienteNombre ||
      this.formFiltrar.value.pacienteApellido
    ) {
      this.pacientesFiltrados = this.allPacientes.filter((paciente) => {
        const pacienteNombreMatch = this.formFiltrar.value.pacienteNombre
          ? paciente.nombre
              .toLowerCase()
              .includes(this.formFiltrar.value.pacienteNombre.toLowerCase())
          : true;
        const pacienteApellidoMatch = this.formFiltrar.value.pacienteApellido
          ? paciente.apellido
              .toLowerCase()
              .includes(this.formFiltrar.value.pacienteApellido.toLowerCase())
          : true;
        return pacienteNombreMatch && pacienteApellidoMatch;
      });
    } else {
      this.pacientesFiltrados = [...this.allPacientes];
    }

    this.reservasFiltradas = this.allReservas.filter((reserva) => {
      const nombreDoctorMatch = this.doctoresFiltrados.some((doctor) => {
        return this.formFiltrar.value.doctorNombre !== ''
          ? doctor.nombre.includes(
              this.formFiltrar.value.doctorNombre!.toString()
            )
          : true;
      });
      const apellidoDoctorMatch = this.doctoresFiltrados.some((doctor) => {
        return this.formFiltrar.value.doctorApellido !== ''
          ? doctor.apellido.includes(this.formFiltrar.value.doctorApellido!)
          : true;
      });
      const nombrePacienteMatch = this.pacientesFiltrados.some((paciente) => {
        return this.formFiltrar.value.pacienteNombre !== ''
          ? paciente.nombre.includes(this.formFiltrar.value.pacienteNombre!)
          : true;
      });
      const apellidoPacienteMatch = this.pacientesFiltrados.some((paciente) => {
        return this.formFiltrar.value.pacienteApellido !== ''
          ? paciente.apellido.includes(this.formFiltrar.value.pacienteApellido!)
          : true;
      });
      const fechaDesdeMatch =
        this.formFiltrar.value.fechaDesde !== ''
          ? this.formFiltrar.value.fechaDesde! <=
            this.formatearFecha(reserva.fechaInicioReserva)
          : true;

      const fechaHastaMatch =
        this.formFiltrar.value.fechaHasta !== ''
          ? this.formFiltrar.value.fechaHasta! >=
            this.formatearFecha(reserva.fechaFinReserva)
          : true;

      return (
        nombreDoctorMatch &&
        apellidoDoctorMatch &&
        nombrePacienteMatch &&
        apellidoPacienteMatch &&
        fechaDesdeMatch &&
        fechaHastaMatch
      );
    });
  }

  /**
   * busca el nombre del dr. según su id
   * @param id id del dr. que se quiere consultar
   * @returns nombre del dr.
   */
  obtenerDrPorId(id: string): string | undefined {
    let persona = this.allDoctores.find((doctor) => {
      return doctor._id == id;
    });
    let nombreCompleto = persona?.nombre! + ' ' + persona?.apellido!;
    return nombreCompleto;
  }
  /**
   * busca el nombre del paciente según su id
   * @param id id del paciente que se quiere consultar
   * @returns nombre del paciente
   */
  obtenerPacientePorId(id: string): string | undefined {
    let persona = this.allPacientes.find((paciente) => {
      return paciente._id == id;
    });
    let nombreCompleto = persona?.nombre! + ' ' + persona?.apellido!;
    return nombreCompleto;
  }

  /**
   * Elimina la reserva que esté seleccionada en ese momento
   * @param opcion "select" si solo se selecciono una reserva a eliminar, cualquier otra cadena si se quiere eliminar definitivamente
   * @param dato Reserva a querer eliminarse, utilizado solo para seleccionar la reserva, para eliminar se utiliza la variable reservaACancelar
   */
  cancelarReserva(opcion: string, dato: Reserva) {
    if (opcion === 'select') {
      this.reservaACancelar = dato;
    } else {
      this.reservaService.delete(this.reservaACancelar._id).subscribe({
        next: (valor) => {
          this.allReservas = this.allReservas.filter(
            (reserva) => reserva._id !== this.reservaACancelar._id
          );
          this.limpiarReservaACancelar();
          this.filtrar();
        },
      });
    }
  }

  /**
   * Limpia los datos del modal para evitar datos basura
   */
  limpiarReservaACancelar() {
    this.reservaACancelar = new Reserva();
  }

  /**
   * Cambia el formato de la fecha a uno utilizado en nuestra region
   * @param inputDate Fecha en formato YYYY-MM-DD
   * @returns Fecha en formato DD/MM/YYYY
   */
  convertDateFormat(inputDate: string): string {
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  }

  /**
   * Busca los doctores que coincidan con el nombre y apellido ingresados en el formulario
   */
  buscarDoctor() {
    this.doctoresNuevosFiltrados = this.allDoctores.filter((doctor) => {
      const existeNombre = doctor.nombre
        .toLowerCase()
        .includes(this.formNuevo.value.doctorNombre!.toLowerCase());
      const existeApellido = doctor.apellido
        .toLowerCase()
        .includes(this.formNuevo.value.doctorApellido!.toLowerCase());
      return existeNombre && existeApellido;
    });
  }

  /**
   * Guarda el doctor seleccionado en el formulario
   * @param doctor Doctor seleccionado en la lista de doctores filtrados
   */
  seleccionarDoctor(doctor: Persona) {
    this.nuevaReserva.idDoctor = doctor._id;
    this.formNuevo.get('doctorNombre')?.setValue(doctor.nombre);
    this.formNuevo.get('doctorApellido')?.setValue(doctor.apellido);
  }

  /**
   * Busca los pacientes que coincidan con el nombre y apellido ingresados en el formulario
   */
  buscarPaciente() {
    this.pacientesNuevosFiltrados = this.allPacientes.filter((paciente) => {
      const existeNombre = paciente.nombre
        .toLowerCase()
        .includes(this.formNuevo.value.pacienteNombre!.toLowerCase());
      const existeApellido = paciente.apellido
        .toLowerCase()
        .includes(this.formNuevo.value.pacienteApellido!.toLowerCase());
      return existeNombre && existeApellido;
    });
  }

  /**
   * Guarda el paciente seleccionado en el formulario
   * @param paciente Paciente seleccionado en la lista de pacientes filtrados
   */
  seleccionarPaciente(paciente: Persona) {
    this.nuevaReserva.idPaciente = paciente._id;
    this.formNuevo.get('pacienteNombre')?.setValue(paciente.nombre);
    this.formNuevo.get('pacienteApellido')?.setValue(paciente.apellido);
  }

  /**
   * Guarda la nueva reserva en la base de datos
   */
  guardarReserva() {
    this.reservaService.create(this.nuevaReserva).subscribe({
      next: (valor) => {
        this.allReservas.push(valor);
        this.limpiarReservaNuevo();
        this.filtrar();
      },
    });
  }

  /**
   * Limpia los datos del formulario de nueva reserva
   */
  limpiarReservaNuevo() {
    this.formNuevo.setValue({
      doctorNombre: '',
      doctorApellido: '',
      pacienteNombre: '',
      pacienteApellido: '',
      fecha: '',
      hora: '',
    });
    this.nuevaReserva = {
      fechaInicioReserva: '',
      fechaFinReserva: '',
      idPaciente: '',
      idDoctor: '',
    };
    this.permitidoGuardar = false;
  }
}
