import { Persona } from "./personaModel";
export class Reserva {
  _id!: string; 
  fechaInicioReserva!: Date;
  fechaFinReserva!: Date;
  cancelada: boolean = false;
  idDoctor!: Persona; 
  idPaciente!: Persona; 
}