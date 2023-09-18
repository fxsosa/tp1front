import { Component, OnInit } from "@angular/core";
import { Persona } from "src/app/models/personaModel";
import { PersonaService } from "src/app/service/persona.service";

@Component({
    selector: 'app-persona',
    templateUrl: './persona.component.html',
    styleUrls: ['./persona.component.css']
})

export class PersonaComponent implements OnInit{
    //Para el getAllPersonas
  personas: Persona[] = []
    //Para el get
  personaPrueba: Persona = {_id:'',
    nombre:'',
    apellido:'',
    telefono:'',
    email:'',
    cedula:'',
    esDoctor:false}

  //Para el post
  personaAdd: Persona = {_id:'',
  nombre:'',
  apellido:'',
  telefono:'',
  email:'',
  cedula:'',
  esDoctor:false}

  //Para el update
  personaUpdate: any = {}
  personaUpdated: Persona = {_id:'',
  nombre:'',
  apellido:'',
  telefono:'',
  email:'',
  cedula:'',
  esDoctor:false}

  constructor(private personaService: PersonaService){}

  ngOnInit(): void {
    this.personaService.getAll().subscribe({
     next: (entity) => {
       this.personas = entity.lista;
     },
     error: (error) => {
       console.log("No se pudieron listar las personas:", error);
     }
   });
   this.personaService.get("64f67e4cedfa4ac5bc60f631").subscribe({
     next: (entity) => {
       this.personaPrueba = entity;
     },
     error: (error) => {
       console.log("No se pudo conseguir la persona:", error);
     }
   });

 }
 createPersona(): void{
  this.personaService.create(this.personaAdd).subscribe({
    next: (entity) => {
      this.personaAdd = entity;
    },
    error: (error) => {
      console.log("No se pudo crear la persona:", error);
    }
  });
 }
 updatePersona(): void{
  this.personaService.update(this.personaUpdate).subscribe({
    next: (entity) => {
      this.personaUpdated = entity;
    },
    error: (error) => {
      console.log("No se pudo actualizar los datos de la persona:", error);
    }
  });
}
}