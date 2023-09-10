# Partes
![30d62af0a4bac038155006d92894b79d.png](../_resources/30d62af0a4bac038155006d92894b79d.png)
## mini back
### Routes
Contiene las rutas para hacer las consultas al back
### models
Contiene los modelos de los datos con los que se va a interactuar 
### Controller
Contiene la logica de los metodos para las routes, si se quiere agregar un metodo nuevo, se debe poner aqui la logica y luego agregar en el routes

![b7439f11e4a604ab490e3a9852053d46.png](../_resources/b7439f11e4a604ab490e3a9852053d46.png)
## Front
### component
Aqui va cada nuevo componente del proyecto, aqui es donde se pueden hacer las vistas para la pagina y tambien su logica
### models
Aqui va los models con los que se va a interactuar, de manera a estandarizar lo que se manipula
### service
Aqui estan los metodos que van a interactuar con el backend, en teoria ya esta utilizable

## Lo que en teoria queda por hacer:
`ng generate component component/nuevoComponente`
Implementar componentes, editar su html y su .ts para que se pueda ver en pantalla, cada componente debe ser agregado al archivo `app.module.ts` 
![f0b8ef9cffa71a6642e5f4a1301185d6.png](../_resources/f0b8ef9cffa71a6642e5f4a1301185d6.png)
