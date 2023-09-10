import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lista } from '../models/listaModel';
import { Persona } from '../models/personaModel';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private api: string = '/api/persona/';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Lista<Persona>>{
    return this.http.get<Lista<Persona>>(this.api)
  }

  get(idPersona: string): Observable<Persona>{
    return this.http.get<Persona>(`${this.api}/${idPersona}`)
  }

  create(nuevaPersona: Persona) {
      let options = {
      headers: new HttpHeaders({ "Access-Control-Allow-Headers": 'Content-Type', 'Content-Type': 'application/json' })
    }
    return this.http.post<Persona>(this.api, nuevaPersona, options);
  }
  update(personaActualizada: any) {
    return this.http.patch<any>(this.api, personaActualizada);
  }
  delete(idPersona: string) {
    return this.http.delete<Persona>(`${this.api}/${idPersona}`)
  }
  
}
