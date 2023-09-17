import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { PersonaComponent } from './component/persona/persona.component';
import { HomePageComponent } from './component/home-page/home-page.component';

const routes: Routes = [
  {
    path:'categoria',
    component:CategoriaComponent
  },
  {
    path:'',
    component:HomePageComponent
  },
  {
    path:'personas',
    component:PersonaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
