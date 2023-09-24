import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Categoria } from 'src/app/models/categoriaModel';
import { Ficha } from 'src/app/models/fichaModel';
import { Persona } from 'src/app/models/personaModel';
import { CategoriaService } from 'src/app/service/categoria.service';
import { FichaService } from 'src/app/service/ficha.service';
import { PersonaService } from 'src/app/service/persona.service';

interface NuevFicha {
  _id: string;
  fecha: string | undefined;
  motivoConsulta: string | undefined;
  idDoctor: string | undefined;
  idPaciente: string | undefined;
  idCategoria: string | undefined;
  diagnostico: string | undefined;
}

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.css'],
})
export class FichasComponent {
  //Formulario de filtros
  formFiltrar = new FormGroup({
    doctorNombre: new FormControl(''),
    doctorApellido: new FormControl(''),
    pacienteNombre: new FormControl(''),
    pacienteApellido: new FormControl(''),
    fechaDesde: new FormControl(''),
    fechaHasta: new FormControl(''),
    categoria: new FormControl(''),
  });

  //formulario para crear una nueva ficha
  formNuevo = new FormGroup({
    fecha: new FormControl(''),
    motivo: new FormControl(''),
    diagnostico: new FormControl(''),
    doctorNombre: new FormControl(''),
    doctorApellido: new FormControl(''),
    pacienteNombre: new FormControl(''),
    pacienteApellido: new FormControl(''),
    categoria: new FormControl(''),
  });

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

  //lista de todos los doctores
  allDoctores: Persona[] = [];
  //lista de todos los pacientes
  allPacientes: Persona[] = [];
  //lista de todas lafichas
  allFichas: Ficha[] = [];
  //lista de todas las categorias
  allCategorias: Categoria[] = [];
  //lista de fichas filtradas
  fichasFiltradas: Ficha[] = [];
  //ficha seleccionada en el modal, ya sea para editar o eliminar
  fichaSeleccionada: Ficha | undefined;
  //fecha actual
  fechaActual = new Date();

  nuevaFicha: Ficha = {
    _id: '',
    fecha: this.fechaActual,
    motivoConsulta: '',
    idDoctor: '',
    idPaciente: '',
    idCategoria: '',
    diagnostico: '',
  };

  ///datos para filtrar en formNuevo
  doctoresNuevosFiltrados: Persona[] = [];
  pacientesNuevosFiltrados: Persona[] = [];
  categoriasNuevasFiltradas: Categoria[] = [];
  permitidoGuardar: boolean = false;

  constructor(
    private fichaService: FichaService,
    private personaService: PersonaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    //se obtienen todas las fichas, personas y categorias
    forkJoin([
      this.fichaService.getAll(),
      this.personaService.getAll(),
      this.categoriaService.getAll(),
    ]).subscribe({
      next: (ficha) => {
        this.allFichas = ficha[0].lista;
        this.fichasFiltradas = ficha[0].lista;
        this.allDoctores = ficha[1].lista.filter((persona) => {
          return persona.esDoctor === true;
        });
        this.allPacientes = ficha[1].lista.filter((persona) => {
          return persona.esDoctor === false;
        });
        this.allCategorias = ficha[2].lista;
        console.log(this.allCategorias);

      },
      complete: () => {
        this.formFiltrar
          .get('fechaDesde')
          ?.setValue(this.formatearFecha(this.fechaActual));
        this.formFiltrar
          .get('fechaHasta')
          ?.setValue(this.formatearFecha(this.fechaActual));
        this.filtrar();
      },
    });
    this.formNuevo.valueChanges.subscribe({
      next: (valor) => {
        if (
          valor.diagnostico !== '' &&
          this.nuevaFicha.idDoctor !== '' &&
          this.nuevaFicha.idPaciente !== '' &&
          valor.fecha !== '' &&
          valor.motivo !== '' &&
          valor.categoria !== ''
        ) {
          this.nuevaFicha.fecha = new Date(
            this.pasarAISO(valor.fecha!, '00:00')
          );
          this.nuevaFicha.motivoConsulta = valor.motivo!;
          this.nuevaFicha.diagnostico = valor.diagnostico!;
          this.permitidoGuardar = true;
        } else {
          this.permitidoGuardar = false;
        }
      },
    });
  }

  /**
   * Filtra las fichas según los filtros ingresados
   */
  filtrar() {
    this.fichasFiltradas = this.allFichas.filter((ficha) => {
      const doctor = this.allDoctores.find((doctor) => {
        return doctor._id == ficha.idDoctor;
      }
      );
      const paciente = this.allPacientes.find((paciente) => {
        return paciente._id == ficha.idPaciente;
      }
      );
      const categoria = this.allCategorias.find((categoria) => {
        return categoria._id == ficha.idCategoria;
      }
      );
      const doctorMatch = doctor?.nombre.toLowerCase().includes(
        this.formFiltrar.value.doctorNombre!.toLowerCase()
      ) && doctor?.apellido.toLowerCase().includes(this.formFiltrar.value.doctorApellido!.toLowerCase());
      const pacienteMatch = paciente?.nombre.toLowerCase().includes(
        this.formFiltrar.value.pacienteNombre!.toLowerCase()
      ) && paciente?.apellido.toLowerCase().includes(this.formFiltrar.value.pacienteApellido!.toLowerCase());

      const categoriaMatch = categoria?.descripcion.includes(
        this.formFiltrar.value.categoria!
      );

      const fechaDesdeMatch =
        this.formFiltrar.value.fechaDesde !== ''
          ? this.formFiltrar.value.fechaDesde! <=
            this.formatearFecha(ficha.fecha)
          : true;

      const fechaHastaMatch =
        this.formFiltrar.value.fechaHasta !== ''
          ? this.formFiltrar.value.fechaHasta! >=
            this.formatearFecha(ficha.fecha)
          : true;
      console.log(doctorMatch, pacienteMatch, categoriaMatch, fechaDesdeMatch, fechaHastaMatch);

      return pacienteMatch && doctorMatch && categoriaMatch && fechaDesdeMatch && fechaHastaMatch;
    });
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
   * busca el nombre de la categoria según su id
   * @param id id de la categoria que se quiere consultar
   * @returns nombre de la categoria
   */
  obtenerCategoriaPorId(id: string): string | undefined {
    let categoria = this.allCategorias.find((categoria) => {
      return categoria._id == id;
    });
    let nombre = categoria?.descripcion!;
    return nombre;
  }

  /**
   * Guarda la ficha seleccionada para el modal
   * @param ficha ficha que se quiere ver en el modal
   */
  verFicha(ficha: Ficha) {
    this.fichaSeleccionada = ficha;
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
   * limpia la ficha seleccionada
   */
  limpiarFichaActual() {
    this.fichaSeleccionada = new Ficha();
  }

  /**
   * Elimina la ficha seleccionada
   */
  eliminarFicha() {
    this.fichaService.delete(this.fichaSeleccionada!._id!).subscribe({
      next: (data) => {
        //elimina la misma ficha del array de fichas
        this.allFichas = this.allFichas.filter((ficha) => {
          return ficha._id !== this.fichaSeleccionada!._id;
        });
        this.filtrar();
      },
      error: (error) => {
        console.log(error);
      },
    });
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
    this.nuevaFicha.idDoctor = doctor._id;
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
    this.nuevaFicha.idPaciente = paciente._id;
    this.formNuevo.get('pacienteNombre')?.setValue(paciente.nombre);
    this.formNuevo.get('pacienteApellido')?.setValue(paciente.apellido);
  }

  /**
   * Busca las categorias que coincidan con la descripcion ingresada en el formulario
   */
  buscarCategoria() {
    this.categoriasNuevasFiltradas = this.allCategorias.filter((categoria) => {
      const existeCategoria = categoria.descripcion
        .toLowerCase()
        .includes(this.formNuevo.value.categoria!.toLowerCase());
      return existeCategoria;
    });
  }

  /**
   * Guarda la categoria seleccionada en el formulario
   * @param categoria Categoria seleccionada en la lista de categorias filtradas
   */
  seleccionarCategoria(categoria: Categoria) {
    this.nuevaFicha.idCategoria = categoria._id;
    this.formNuevo.get('categoria')?.setValue(categoria.descripcion);
  }

  /**
   * Limpia los datos de la ficha nuevo para evitar errores de datos
   */
  limpiarFichaNuevo() {
    this.formNuevo.setValue({
      doctorNombre: '',
      doctorApellido: '',
      pacienteNombre: '',
      pacienteApellido: '',
      fecha: '',
      motivo: '',
      categoria: '',
      diagnostico: '',
    });
    this.nuevaFicha = {
      _id: '',
      fecha: new Date(),
      motivoConsulta: '',
      idDoctor: '',
      idPaciente: '',
      idCategoria: '',
      diagnostico: '',
    };
    this.permitidoGuardar = false;
  }

  /**
   * Guarda la ficha nueva en la base de datos
   */
  guardarFicha() {
    this.fichaService.create(this.nuevaFicha).subscribe({
      next: (data) => {
        this.allFichas.push(data);
        this.filtrar();
        this.limpiarFichaNuevo();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
