# Servidor API

## Introducción



***

## Instalación del Servidor API
* Visitar la web de [NodeJS](https://nodejs.org/en/) para instalar la última versión.
* Descargar el código fuente del repositorio en https://github.com/DavidGomez-coder/TFG.git
* Moverse al directorio 'server' con:  
``` $ cd server ```
* Instalación de las dependencias del servidor
``` $ npm install ```
* Crear variables de entorno (ver más abajo)
* Iniciar el servidor en el navegador escribiendo: _http://localhost:{PORT}_. Se recibirá un `OK` (status 200) por pantalla si el servidor se ha iniciado correctamente.

### ⚠️ Variables de entorno 
Crear en el directorio raiz un fichero con nombre **.env**. En este  fichero incluiremos todas las variables de entorno, las cuáles son utilizadas por el servidor para poder comenzar a ejecutarse. Inicialmente solamente son necesarias solamente las siguientes (escribir tal y como se muestra):

* **PORT**. Puerto utilizado por el sevidor para atender las peticiones.
* **SESSION_SECRET**. Valor utilizado para crear las sesiones. Se proporciona un fichero _SecretGenerator.ts_ para generar estos valores. (Se puede escribir uno al azar).

***

## Lenguajes utilizados
[![My GitHub Language Stats](https://github-readme-stats.vercel.app/api/top-langs/?username=DavidGomez-coder&langs_count=5&theme=tokyonight)]()

[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=DavidGomez-coder&layout=compact)](https://github.com/DavidGomez-coder/TFG/github-readme-stats)

 Instalacion de las dependencias en produccion -> npm install 
