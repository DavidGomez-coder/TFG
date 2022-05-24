# Cliente ReactJs
## ÍNDICE
* [Introducción](#introduccion)
* [Instalación del cliente](#client-inst)
    * [Variables de entorno](#env-var)

***
## <a id="introduccion">Introducción</a>
Se trata de una aplicación cliente, que toma peticiones de un servidor basado en API REST para mostrar los resultados de simulaciones. Como base, se utiliza JavaScript (no TypeScript como en el servidor), pues su uso no tiene en cuenta el tipado de las variables y es más flexible en la asignación de estas.


## <a id="client-inst">Instalación del cliente</a>
* Visitar la web de [NodeJS](https://nodejs.org/en/) para instalar la última versión.
* Descargar el código fuente del <strong>cliente</strong> del repositorio.
* Moverse al directorio 'client' descargado utilizando 
```$ cd client```
* Instalación de las dependiencias del cliente
```$ npm install  ```
* Crear variables de entorno si no están creadas (ver más abajo).
* Existen dos formas de iniciar la aplicación:
    * Utilizando el comando ``` $ npm start ``` en el directorio raíz del cliente. A continuación se abrirá automaticamente una ventana del navegador con la aplicación.
    * En caso de que la pestaña/ventana anterior no se abriese, ingresar en la barra de búsqueda la dirección dónde se aloja la aplicación.

### ⚠️ <a id="env-variables"> Variables de entorno </a>
Crear en el directorio raíz del <strong>cliente</strong> un fichero con el nombre **.env** si este no ha sido creado. En este fichero serán incluidas todas las variables de entorno que el cliente utilizará durante su ejecución. Las únicas variables que son necesarias hasta la fecha son las siiguientes (escribir el nombre de las variables tal y como se muestra a continuación) 
* **PORT**. Puerto utilizado por el cliente. Debe de ser diferente al del servidor y además este no debería de estar en uso (se avisaría de un conflicto existente en caso de que dicho puerto ya se esté utilizando. Ej. <strong>PORT=3030</strong>)
* **REACT_APP_API_SERVER**. Es la dirección donde está ejecutándose el servidor que atiende las peticiones. Si éste está ejecutándose en el puerto _8080_ en _localhost_, entonces <strong>REACT_APP_API_SERVER=http://localhost:8080</strong>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

