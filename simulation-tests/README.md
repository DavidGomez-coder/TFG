# Simulation-tests
"Simulation-tests" es un script elaborado en python cuyo propósito es facilitar la comparación entre los resultados generados con la aplicación principal con los que deberían de obtenerse. Para el su uso, se debe de tener instaladas las dedendencias indicadas en [requirements.txt](requirements.txt).

```$ pip install -r requirements.txt```

Para ejecutar y ver los resultados, basta con ejecutar el siguiente comando (dentro del directorio __simulation-tests__)

```$ python3 main.py [arguments]```

, dónde los argumentos son los que siguen:

|Comando | Abreviación | Descripción | Obligatorio |
|--------|-------------|-------------|-------------|
| --time |    -t       |  Establece la duración de la simulación     |    :red_circle:       |         
| --simulationType | -st | Tipo de simulación. Puede tomar los valores "RC" o "RL" |  :green_circle: |
|--incrementValue  | -inc| Escala de tiempo para el cálculo de resultados. Por defecto es 0.001. | :red_circle: |
| --capacitor | -c | Valor en Faradios del condensador. Solo es utilizado cuando el tipo del circuito a simular es RC. Por defecto su valor es de 0.005F. | :red_circle: | 