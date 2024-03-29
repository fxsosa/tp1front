import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { CategoriaService } from './service/categoria.service';
import { PersonaService } from './service/persona.service';
import { ReservaService } from './service/reserva.service';
import { FichaService } from './service/ficha.service';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './component/home-page/home-page.component';
import { CategoriasComponent } from './component/categorias/categorias.component';
import { ReservasComponent } from './component/reservas/reservas.component';
import { FichasComponent } from './component/fichas/fichas.component';
import { ExportAsModule } from 'ngx-export-as';
import { PersonaComponent } from './component/persona/persona.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    HomePageComponent,
    CategoriasComponent,
    ReservasComponent,
    FichasComponent,
    PersonaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ExportAsModule,
  ],
  providers: [CategoriaService, PersonaService, ReservaService, FichaService],
  bootstrap: [AppComponent]
})
export class AppModule {}
