import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lista } from '../models/listaModel';
import { Categoria } from '../models/categoriaModel';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private api: string = '/api/categoria/';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Lista<Categoria>>{
    return this.http.get<Lista<Categoria>>(this.api)
  }

  get(idCategoria: string): Observable<Categoria>{
    return this.http.get<Categoria>(`${this.api}/${idCategoria}`)
  }

  create(nuevaCategoria: Categoria) {
      let options = {
      headers: new HttpHeaders({ "Access-Control-Allow-Headers": 'Content-Type', 'Content-Type': 'application/json' })
    }
    return this.http.post<Categoria>(this.api, nuevaCategoria, options);
  }
  update(categoriaActualizada: any) {
    return this.http.put<Categoria>(this.api, categoriaActualizada);
  }
  delete(idCategoria: string) {
    return this.http.delete<Categoria>(`${this.api}/${idCategoria}`)
  }
  
}
