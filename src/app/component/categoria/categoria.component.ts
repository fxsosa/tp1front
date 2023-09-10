import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoriaModel';
import { CategoriaService } from '../../service/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit{
  categorias: Categoria[] = []
  categoriaPrueba: Categoria = {_id:'', descripcion:''}
  categoriaAdd: Categoria = {_id:'', descripcion:''}
  categoriaDeleteId: string = ''
  categoriaDeleted: Categoria = {_id:'', descripcion:''}

  constructor(private categoriaService: CategoriaService){}

  ngOnInit(): void {
     this.categoriaService.getAll().subscribe({
      next: (entity) => {
        this.categorias = entity.lista;
      },
      error: (error) => {
        console.log("No se pudieron conseguir las categorías:", error);
      }
    });
    this.categoriaService.get("64f67e4cedfa4ac5bc60f631").subscribe({
      next: (entity) => {
        this.categoriaPrueba = entity;
      },
      error: (error) => {
        console.log("No se pudieron conseguir las categorías:", error);
      }
    });

  }
  createCategoria(): void{
    this.categoriaService.create(this.categoriaAdd).subscribe({
      next: (entity) => {
        this.categoriaAdd = entity;
      },
      error: (error) => {
        console.log("No se pudieron conseguir las categorías:", error);
      }
    });
  }
  deleteCategoria(): void{
    this.categoriaService.delete(this.categoriaDeleteId).subscribe({
      next: (entity) => {
        this.categoriaDeleted = entity;
      },
      error: (error) => {
        console.log("No se pudieron conseguir las categorías:", error);
      }
    });

  }
}
