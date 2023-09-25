import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { CategoriasComponent } from './component/categorias/categorias.component';
import { ReservasComponent } from './component/reservas/reservas.component';
import { FichasComponent } from './component/fichas/fichas.component';

const routes: Routes = [
  {path:'categoria',component:CategoriaComponent},
  {path:'',component:HomePageComponent},
  {path:'categorias',component:CategoriasComponent},
  {path:'reservas', component:ReservasComponent},
  {path:'fichas', component:FichasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
