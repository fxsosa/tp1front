import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { CategoriasComponent } from './component/categorias/categorias.component';

const routes: Routes = [
  {path:'categoria',component:CategoriaComponent},
  {path:'',component:HomePageComponent},
  {path:'categorias',component:CategoriasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
