import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lista } from '../models/listaModel';
import { Reserva } from '../models/reservaModel';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private api: string = '/api/reserva/';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Lista<Reserva>>{
    return this.http.get<Lista<Reserva>>(this.api)
  }

  get(idReserva: string): Observable<Reserva>{
    return this.http.get<Reserva>(`${this.api}/${idReserva}`)
  }

  create(nuevaReserva: Reserva) {
      let options = {
      headers: new HttpHeaders({ "Access-Control-Allow-Headers": 'Content-Type', 'Content-Type': 'application/json' })
    }
    return this.http.post<Reserva>(this.api, nuevaReserva, options);
  }
  update(reservaActualizada: any) {
    return this.http.patch<any>(this.api, reservaActualizada);
  }
  delete(idReserva: string) {
    return this.http.delete<Reserva>(`${this.api}/${idReserva}`)
  }
  
}
