import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tp1front';

  //variable utilizado para saber si se está en el home o no, se aplica para ocultar
  //las opciones en el navbar ya que sería redundante mostrar esas opciones desde el home
  isHomePage: boolean;

  constructor(private router: Router) {
    // Inicializa isHomePage con el valor actual
    this.isHomePage = this.router.url === '/';

    // Escucha los eventos de cambio de ruta para alterar el valor de isHomePage
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
      }
    });
  }
}
