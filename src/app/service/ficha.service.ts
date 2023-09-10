import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lista } from '../models/listaModel';
import { Ficha } from '../models/fichaModel';

@Injectable({
  providedIn: 'root'
})
export class FichaService {

  private api: string = '/api/ficha/';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Lista<Ficha>>{
    return this.http.get<Lista<Ficha>>(this.api)
  }

  get(idFicha: string): Observable<Ficha>{
    return this.http.get<Ficha>(`${this.api}/${idFicha}`)
  }

  create(nuevaFicha: Ficha) {
      let options = {
      headers: new HttpHeaders({ "Access-Control-Allow-Headers": 'Content-Type', 'Content-Type': 'application/json' })
    }
    return this.http.post<Ficha>(this.api, nuevaFicha, options);
  }
  update(fichaActualizada: any) {
    return this.http.patch<any>(this.api, fichaActualizada);
  }
  delete(idFicha: string) {
    return this.http.delete<Ficha>(`${this.api}/${idFicha}`)
  }
  
}
