import { Persona } from "./personaModel";
import { Categoria } from "./categoriaModel";

export class Ficha {
  _id!: string;
  fecha!: Date;
  motivoConsulta!: string;
  diagnostico: string = '';
  idDoctor!: string;
  idPaciente!: string;
  idCategoria!: string;
}
