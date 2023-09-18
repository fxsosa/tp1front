import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoriaModel';
import { CategoriaService } from '../../service/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit{
  //Para el getAll
  categorias: Categoria[] = []
  //Para el get
  categoriaPrueba: Categoria = {_id:'', descripcion:''}
  //Para el post
  categoriaAdd: Categoria = {_id:'', descripcion:''}
  //Para el delete
  categoriaDeleteId: string = ''
  categoriaDeleted: Categoria = {_id:'', descripcion:''}

  //Para el update
  categoriaUpdate: any = {}
  categoriaUpdated: Categoria = {_id:'', descripcion:''}
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
    this.categoriaService.get('64fe4da1f9f5a93f587a9fef').subscribe({
      next: (entity) => {
        this.categoriaPrueba = entity;
      },
      error: (error) => {
        console.log('No se pudo conseguir la categoria:', error);
      },
    });

  }
  createCategoria(): void{
    this.categoriaService.create(this.categoriaAdd).subscribe({
      next: (entity) => {
        this.categoriaAdd = entity;
      },
      error: (error) => {
        console.log("No se pudo crear la categoria:", error);
      }
    });
  }
  deleteCategoria(): void{
    this.categoriaService.delete(this.categoriaDeleteId).subscribe({
      next: (entity) => {
        this.categoriaDeleted = entity;
      },
      error: (error) => {
        console.log("No se pudo eliminar la categoria", error);
      }
    });
  }
  updateCategoria(): void{
    this.categoriaService.update(this.categoriaUpdate).subscribe({
      next: (entity) => {
        this.categoriaUpdated = entity;
      },
      error: (error) => {
        console.log("No se pudo actualizar la categoria:", error);
      }
    });
  }
}
