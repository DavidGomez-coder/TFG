# Física Interactiva

"Física Interactiva" es un proyecto de Fin de Grado utilizado para que el alumnado que curse las asignaturas de física de los grados de ingeniería, puedan apoyarse para entender mejor los fenómenos físicos estudiados en dichas asignaturas. 

En concreto, en esta aplicación elaborada en <i>ReactJS</i> se propone una solución a las simulaciones de los circuitos RC y RL en corriente continua y estado transitorio, fenómenos estudiados en la asignatura <i>Fundamentos Físicos de la Informática</i> de los grados de <i>Ingeniería Informática, Software y Computadores</i> de la Universidad de Málaga.

# ¿Qué contiene esta aplicación?
Como se ha comentado en la sección anterior, en esta aplicación se desarrolla dos soluciones para emular de manera interactiva los circuitos RC y RL. En ellas, se pueden modificar los valores de cada uno de los componentes, así como visualizar gráficamente la evolución de algunas métricas que pueden ser interesantes de analizar: carga del condensador, diferencia de potencial en la resistencia, energía almacenada, diferencia de potencial en el condensador/inductor, ...

Además, se incluye un apartado de teoría, en el que se explica de manera simple estos fenómenos. En ellos, se hace un análisis matemático de la situación, obteniendo así las expresiones correspondientes que lo modelan y que además, son utilizadas para obtener los resultados de dichas simulaciones.


# ¿Cómo instalar e iniciar la aplicación en local?
Para poder instalar la aplicación localmente, es necesario disponer de <strong>NodeJS</strong>, un entorno en tiempo de ejecución de <i>JavaScript</i>, permitiendo la creación de aplicaciones, módulos o librerías haciendo uso de este lenguaje, teniendo este como primer objetivo ser ejecutado en el navegador. 

(Para descargar la última versión de NodeJS ir a https://nodejs.org/en/download/)

Una vez la instalación está completa y hallamos descargado el código fuente en nuestra máquina local, debemos de situarnos en el directorio padre descargado, y en él, ejecutar los siguientes comandos:

<strong>`npm install --force`</strong> : Instalación de todas las dependencias. La opción <i>--force</i> es usada para poder instalar librerías con conflictos (en caso de que los hubiese), ya que dependiendo del sistema operativo utilizado puede salir este error o no. 

Una vez hecho esto, la aplicación se encuentra lista para ser lanzada, escribiendo sobre el mismo directorio el comando <strong> `npm start` </strong> y, acto seguido, se abrirá una ventana de nuestro navegador con la aplicación (por defecto en http://localhost:3000)*.


<strong>*</strong> El codigo fuente esta configurado para desplegarse en github-pages, así que por defecto el proyecto se abrirá en http://localhost:3000/TFG. Basta con quitar la ruta <i>TFG</i> de la URL en el navegador y la aplicación se muestra correctamete.

# Como realizar el despliegue en github-pages
Para realizar el despliegue en github-pages, realizaremos los siguientes pasos. 

En primer lugar será instalar la dependencia <i>gh-pages</i>, la cuál nos permitirá crear un <strong>build </strong> de nuestra aplicación. Este <strong>build </strong> lo desplegaremos en una rama diferente, para así tener en una el código fuente y en otra, los archivos necesarios para poder desplegar la aplicación. Instalamos entonces esta dependencia con la siguiente instrucción.

```$ npm install gh-pages --save-dev ```

Una finalizada la instalación, abrimos el fichero `package.json` y añadimos una propiedad `homepage` con el siguiente formato: `https://{username}.github.io/{repo-name}`

<div style="text-align: center">
    <img alt="homepage_added" src="./docs/imgs/homepage.PNG"/>
</div>

<br />

A continuación, añadimos los scripts `predeploy` y `deploy` para hacer el despliegue en el fichero `package.json`.


<br/>
<div style="text-align: center">
    <img alt="deploy_scripts" src="./docs/imgs/deploy_scripts.PNG"/>
</div>

<br />

Para terminar, despleguamos ejecutando el siguiente script ```$ npm run deploy``` , el cuál llamará internamente a los anteriores scripts añadidos.

Con todo esto, tendremos el proyecto dividido en dos ramas diferentes.
    
    - Por un lado la rama main que contendrá el código fuente del proyecto.
    - Rama gh-pages, con el build del proyecto
    - Para limpiar la rama gh-pages y hacer un nuevo build, en deploy se debe de utilizar 'gh-pages-clean gh-pages -d build'

Para poder acceder desde internet, nos moveremos al apartado <strong>settings</strong> 

<div style="text-align: center">
    <img alt="settings" src="./docs/imgs/settings.PNG"/>
</div>

<br />
y en la pestaña <strong>Pages</strong> habilitamos la siguiente configuración. 

<br/>

<div style="text-align: center">
    <img alt="pages-conf" src="./docs/imgs/pages-conf.PNG"/>
</div>

<br />
Guardamos los cambios y la aplicación sería accesible con el siguiente enlace
https://davidgomez-coder.github.io/TFG/ 

<br /><br />
Ⓒ2022 David Gómez Pérez







