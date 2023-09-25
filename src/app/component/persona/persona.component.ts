import { Component, OnInit } from "@angular/core";
import { Persona } from "src/app/models/personaModel";
import { PersonaService } from "src/app/service/persona.service";
import { FormControl} from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';

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

  filtroNombreControl = new FormControl();
  filtroApellidoControl = new FormControl()
  filtroTipoControl = new FormControl();
  personasFiltradas: Persona[] = [];

  tituloModal: string = 'Nuevo';
  

  constructor(private personaService: PersonaService){}

  ngOnInit(): void {
    this.personaService.getAll().subscribe({
     next: (entity) => {
       this.personas = entity.lista;
       const filtroNombre$ =
          this.filtroNombreControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map((value) => value?.toLowerCase())
          );
        const filtroApellido$ =
          this.filtroApellidoControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map((value) => value?.toLowerCase())
          );
        const filtroTipo$ =
          this.filtroTipoControl.valueChanges.pipe(
            startWith(null),
            debounceTime(300),
            distinctUntilChanged(),
            map((value) => value?.toLowerCase())
          );
          combineLatest([filtroNombre$,filtroApellido$, filtroTipo$]).subscribe(
            ([filtroNombre, filtroApellido, filtroTipo]) => {
              this.personasFiltradas = this.personas.filter((persona) => {
                const nombreMatch = filtroNombre
                  ? persona.nombre
                      .toLowerCase()
                      .includes(filtroNombre)
                  : true;
                  console.log("persona.nombre "+persona.nombre)
                  console.log("filtroNombre "+filtroNombre)
                  console.log("nombreMatch "+nombreMatch) 
                const apellidoMatch = filtroApellido
                  ? persona.apellido
                      .toLowerCase()
                      .includes(filtroApellido)
                  : true;
                  console.log("persona.esDoctor "+persona.esDoctor)
                  console.log("filtrotipo "+filtroTipo)
                const esDoctorMatch = filtroTipo !== undefined
                  ? filtroTipo === 'todos' ? true: filtroTipo === 'doctor' && persona.esDoctor ? true: filtroTipo === 'paciente' && !persona.esDoctor ?true: false 
                  : true;
                  console.log("esDoctorMatch "+esDoctorMatch)
                return nombreMatch && apellidoMatch && esDoctorMatch;
              });
            }
          );
          console.log("personasFiltradas ",this.personasFiltradas)
       
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
      this.reFiltrarPersonas();
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
      this.reFiltrarPersonas();
    },
    error: (error) => {
      console.log("No se pudo actualizar los datos de la persona:", error);
    }
  });
}

abrirModal(opcion: string) {
  switch (opcion) {
    case 'editar':
      this.tituloModal = 'Editar...';
      this.personaUpdated = this.personaUpdate;
      break;
    case 'nuevo':
      this.tituloModal = 'Nuevo';
      break;
  }
}

limpiarModal() {
  this.personaUpdate = {_id:'',
  nombre:'',
  apellido:'',
  telefono:'',
  email:'',
  cedula:'',
  esDoctor:false};
  this.personaUpdated = {_id:'',
  nombre:'',
  apellido:'',
  telefono:'',
  email:'',
  cedula:'',
  esDoctor:false};
}

verPersona(elemento: Persona) {
  this.abrirModal('editar');
  this.personaUpdated = {...elemento};
  this.personaUpdate = { ...elemento};
}

eliminar(){
  this.personaService.delete(this.personaUpdated._id).subscribe({
    next: () => {
      const indice = this.personas.indexOf(this.personaUpdated);
      if(indice>-1){
        this.personas.splice(indice,1);
        this.reFiltrarPersonas();
      }
    },
    error: () => console.log("No se pudo eliminar")
  });
}

reFiltrarPersonas(): void {

  this.personasFiltradas = this.personas.filter((persona) => {
    const nombreMatch = this.filtroNombreControl.value
                  ? persona.nombre
                      .toLowerCase()
                      .includes(this.filtroNombreControl.value)
                  : true;
                const apellidoMatch = this.filtroApellidoControl.value
                  ? persona.apellido
                      .toLowerCase()
                      .includes(this.filtroApellidoControl.value)
                  : true;
                const esDoctorMatch = this.filtroTipoControl.value !== undefined
                  ? this.filtroTipoControl.value === 'todos' ? true: this.filtroTipoControl.value === 'doctor' && persona.esDoctor ? true: this.filtroTipoControl.value === 'paciente' && !persona.esDoctor ?true: false 
                  : true;
                return nombreMatch && apellidoMatch && esDoctorMatch;
  });
}
}
