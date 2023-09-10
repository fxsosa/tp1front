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
  }
}
