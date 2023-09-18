import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { PersonaComponent } from './component/persona/persona.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    HomePageComponent,
    PersonaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CategoriaService, PersonaService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
