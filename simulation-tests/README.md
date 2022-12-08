# Simulation-tests
"Simulation-tests" es un script elaborado en python cuyo propósito es facilitar la comparación entre los resultados generados con la aplicación principal con los que deberían de obtenerse. Para el su uso, se debe de tener instaladas las dedendencias indicadas en [requirements.txt](requirements.txt).

```$ pip install -r requirements.txt```

Para ejecutar y ver los resultados, basta con ejecutar el siguiente comando (dentro del directorio __simulation-tests__)

```$ python3 main.py [arguments]```

, dónde los argumentos son los que siguen:

|Comando | Abreviación | Descripción | Obligatorio |
|--------|-------------|-------------|-------------|
| --time |    -t       |  Establece la duración de la simulación.     |    :red_circle:       |         
| --simulationType | -st | Tipo de simulación. Puede tomar los valores "RC" o "RL". |  :green_circle: |
|--incrementValue  | -inc| Escala de tiempo para el cálculo de resultados. Por defecto es 0.001. | :red_circle: |
| --capacitor | -c | Valor en Faradios del condensador. Solo es utilizado cuando el tipo del circuito a simular es RC. Por defecto su valor es de 0.005F. | :red_circle: | 
| --resistor | -r | Valor en Ohmios de la resistencia. Por defecto su valor es de 3Ω | :red_circle: | 
| --voltage | -v | Valor en Voltios de la fuente de alimentación. Por defecto su valor es de 5V. | :red_circle: | 
| --inductor | -i | Valor en Henrios de la inductancia de la bobina. Solo es utilizado cuando el tipo del circuito a simular es RL. Por defecto, su valor es de 10H. | :red_circle: | 
|--conditionValue | -condV | Establece la condición de parada de la simulación. Si el circuito a simular es el RC, este valor hará referencia a la carga del condensador. En caso del circuito RL, a la intensidad de corriente.* | :red_circle: | 
| --conditionPercent | -condP | Establece la condición de parada de la simulación. Si el circuito a simular es el RC, este valor hará referencia al porcentaje de carga del condensador (0-100). En caso del circuito RL, a la intensidad de corriente.* | :red_circle: |

<strong>*</strong><i>En caso de que el valor de la carga o intensidad supere su valor máximo permitido (o en caso de indicar el porcentaje, este sea menor que cero o mayor que cien), se mostrára un mensaje de error indicando la carga o intensidad de corriente máximas permitidas para el circuito a simular.</i>