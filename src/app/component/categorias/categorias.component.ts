import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { Categoria } from 'src/app/models/categoriaModel';
import { CategoriaService } from 'src/app/service/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  //lista de categorias
  categorias: Categoria[] = [];
  //se utilizará cuando se vaya a crear o editar una categoría
  categoriaUpdate: any = { _id: '', descripcion: '' };
  //categoría con bind en el html, se utilizará para comparar si hubo cambios para enviar a la bd
  categoriaUpdated: any = { _id: '', descripcion: '' };
  //titulo del modal, para que cambie dependiendo de si es una nueva categoria o una edicion
  tituloModal: string = 'nuevo';

  //datos para el FormControl, para actualizar los filtros en el momento
  filtroDescripcionControl = new FormControl();
  filtroIdControl = new FormControl();
  categoriasFiltradas: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    //se traen todas las categorías existentes en el back para mostrar
    this.categoriaService.getAll().subscribe({
      next: (valor) => {
        this.categorias = valor.lista;
        // Observables para los controles del formulario
        const filtroDescripcion$ =
          this.filtroDescripcionControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map((value) => value?.toLowerCase())
          );

        const filtroId$ = this.filtroIdControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          map((value) => value?.toLowerCase())
        );

        // Combinar los cambios de los filtros y las categorías
        combineLatest([filtroDescripcion$, filtroId$]).subscribe(
          ([filtroDescripcion, filtroId]) => {
            this.categoriasFiltradas = this.categorias.filter((categoria) => {
              const descripcionMatch = filtroDescripcion
                ? categoria.descripcion
                    .toLowerCase()
                    .includes(filtroDescripcion)
                : true;
              const idMatch = filtroId
                ? categoria._id.toString().toLowerCase().includes(filtroId)
                : true;
              return descripcionMatch && idMatch;
            });
          }
        );
      },
      error: () => console.log('No se pudieron obtener las categorias'),
    });
  }

  /**
   * Función para guardar los cambios editados en una categoría
   */
  editar() {
    //comprueba primero si efectivamente hubo cambios en la descripción, solo en ese caso se va a guardar el cambio
    if (
      this.categoriaUpdate != this.categoriaUpdated &&
      this.categoriaUpdated.descripcion != ''
    ) {
      this.categoriaService.update(this.categoriaUpdated).subscribe({
        next: () => {
          //si se acepta, guarda el nuevo valor en su lugar, para no repetir la consulta de todos los datos a la bd
          const newvalor = this.categorias.find(
            (obj) =>
              obj._id ==
              this.categoriaUpdate._id
          );
          if (newvalor) {
            newvalor.descripcion = this.categoriaUpdated.descripcion;
          }
          //una vez actualizado, se vacían de nuevo los campos
          this.limpiarModal();
          this.reFiltrarCategorias();
        },
        error: () => console.log('No se pudo actualizar'),
      });
    }
  }

  /**
   * Función para crear una nueva categoría
   */
  nuevo() {
    //primero comprueba si no existe ya dicha categoría y que el campo no esté vacío, si ya existe, no hace nada
    if (
      !this.categorias.find(
        (obj) => obj.descripcion.toLowerCase == this.categoriaUpdate.descripcion.toLowerCase
      ) &&
      this.categoriaUpdated.descripcion != ''
    ) {
      //guarda el valor y agrega a la nueva categoría
      this.categoriaService.create(this.categoriaUpdated).subscribe({
        next: (nuevoValor) => {
          this.categorias.push(nuevoValor);
          this.limpiarModal();
          this.reFiltrarCategorias();
        },
        error: () => console.log('No se pudo agregar la nueva categoría'),
      });
    }
  }

  /**
   * Función para volver a filtrar las categorías, utilizado cuando el array original cambia
   */
  reFiltrarCategorias(): void {
    console.log("antes de refiltrar:", this.categoriasFiltradas);

    this.categoriasFiltradas = this.categorias.filter((categoria) => {
      const descripcionMatch = this.filtroDescripcionControl.value
        ? categoria.descripcion.toLowerCase().includes(this.filtroDescripcionControl.value)
        : true;
      const idMatch = this.filtroIdControl.value
        ? categoria._id.toString().toLowerCase().includes(this.filtroIdControl.value)
        : true;
      return descripcionMatch && idMatch;
    });

    console.log("despues: ", this.categoriasFiltradas);

  }

  /**
   * Limpia datos del modal
   */
  limpiarModal() {
    this.categoriaUpdate = { _id: '', descripcion: '' };
    this.categoriaUpdated = { _id: '', descripcion: '' };
  }

  /**
   * completa los campos del modal con un elemento
   * @param elemento elemento elegido para modificar/eliminar
   */
  verCategoria(elemento: Categoria) {
    this.abrirModal('editar');
    this.categoriaUpdated = {...elemento};
    this.categoriaUpdate = { ...elemento};
  }

  /**
   * completa algunos datos del modal como la parte visual y botones
   * @param opcion intención con la que se abre el modal
   */
  abrirModal(opcion: string) {
    switch (opcion) {
      case 'editar':
        this.tituloModal = 'Editar...';
        this.categoriaUpdated = this.categoriaUpdate;
        break;
      case 'nuevo':
        this.tituloModal = 'Nuevo';
        break;
    }
  }

  /**
   * Funcion para eliminar la categoria seleccionada
   */
  eliminar(){
    this.categoriaService.delete(this.categoriaUpdated._id).subscribe({
      next: () => {
        const indice = this.categorias.indexOf(this.categoriaUpdated);
        if(indice>-1){
          this.categorias.splice(indice,1);
          this.reFiltrarCategorias();
        }
      },
      error: () => console.log("No se pudo eliminar")
    });
  }
}
