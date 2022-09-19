# Física Interactiva

"Física Interactiva" es un proyecto de Fin de Grado utilizado para que el alumnado que curse las asignaturas de física de los grados de ingeniería, puedan apoyarse para entender mejor los fenómenos físicos estudiados en dichas asignaturas. 

En concreto, en esta aplicación elaborada en <i>ReactJS</i> se propone una solución a las simulaciones de los circuitos RC y RL en corriente continua y estado transitorio, fenómenos estudiados en la asignatura <i>Fundamentos Físicos de la Informática</i> de los grados de <i>Ingeniería Informática, Software y Computadores</i> de la Universidad de Málaga.

# ¿Qué contiene esta aplicación?
Como se ha comentado en la sección anterior, en esta aplicación se desarrolla dos soluciones para emular de manera interactiva los circuitos RC y RL. En ellas, se pueden modificar los valores de cada uno de los componentes, así como visualizar gráficamente la evolución de algunas métricas que pueden ser interesantes de analizar: carga del condensador, diferencia de potencial en la resistencia, energía almacenada, diferencia de potencial en el condensador/inductor, ...

Además, se incluye un apartado de teoría, en el que se explica de manera simple estos fenómenos. En ellos, se hace un análisis matemático de la situación, obteniendo así las expresiones correspondientes que lo modelan y que además, son utilizadas para obtener los resultados de dichas simulaciones.


# ¿Cómo instalar e iniciar la aplicación?
Para poder instalar la aplicación localmente, es necesario disponer de <strong>NodeJS</strong>, un entorno en tiempo de ejecución de <i>JavaScript</i>, permitiendo la creación de aplicaciones, módulos o librerías haciendo uso de este lenguaje, teniendo este como primer objetivo ser ejecutado en el navegador. 

(Para descargar la última versión de NodeJS ir a https://nodejs.org/en/download/)

Una vez la instalación está completa y hallamos descargado el código fuente en nuestra máquina local, debemos de situarnos en el directorio padre descargado, y en él, ejecutar los siguientes comandos:

<strong>`npm install --force`</strong> : Instalación de todas las dependencias. La opción <i>--force</i> es usada para poder instalar librerías con conflictos (en caso de que los hubiese), ya que dependiendo del sistema operativo utilizado puede salir este error o no. 

Una vez hecho esto, la aplicación se encuentra lista para ser lanzada, escribiendo sobre el mismo directorio el comando <strong> `npm start` </strong> y, acto seguido, se abrirá una ventana de nuestro navegador con la aplicación (por defecto en http://localhost:3000).

Ⓒ2022 David Gómez Pérez







