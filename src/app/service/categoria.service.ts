import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lista } from '../models/listaModel';
import { Categoria } from '../models/categoriaModel';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private api: string = 'http://localhost:4000/api/categoria/';


  constructor(private http: HttpClient) { }
  getAllCategorias(): Observable<Lista<Categoria>>{
    return this.http.get<Lista<Categoria>>(this.api)
  }
  
}
