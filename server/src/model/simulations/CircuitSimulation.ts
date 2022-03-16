/**
 * @fileoverview Implementacion logica de la simulacion. Una simulacion se compone de tres elementos fundamentales.
 *              - CIRCUITO. Es el circuito sobre el que se va a realizar la simulación: RC o RL
 *              - tT. Es el tiempo transcurrido desde el inicio de la simulacion hasta que se finaliza (este puede ser infinito)
 *              - t0. Es el tiempo transcurrido desde el último cambio en el circuito. 
 *                  -> Inicialmente tT = t0 = 0. Cuando el circuito sufre un cambio (cambio de valor en un componente, cambio de estado), entonces
 *                     tT = x, mientras que t0 = 0. Este valor t0 es el utilizado para calcular las propiedades (diferencia de potenciales, energía almacenada,
 *                     intensidad de corriente, ...)
 *              - STATUS. Indica el estado de la simulación. Estos pueden ser:
 *                        -> Paused. Simulación pausada. El tiempo no avanza.
 *                        -> Running. Simulación ejecutándose. El tiempo avanza, y por lo tanto, se calculan nuevos valores.
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";

enum Status {
    STOPPED = 0,
    RUNNING = 1
}

export class CircuitSimulation {

    protected circuit: Circuit; //circuito a simular
    protected status: Status;   //estado de la simulacion 
    protected max_time: number;  //tiempo total empleado en la simulacion (4 veces la constante de tiempo, inicialmente 0)

    constructor (circuit: Circuit){
        this.circuit = circuit;
        this.status = Status.STOPPED;
        this.max_time = 0;
    }


    /**
     * @returns {Circuit} Circuito de la simulacion
     */
    getCircuit (): Circuit {
        return this.circuit;
    }

    /**
     * @param {Circuit} circuit Nuevo circuito de la simulacion
     */
    setCircuit (circuit: Circuit): void {
        this.circuit = circuit;
        this.status = Status.STOPPED;
    }

    /**
     * @returns {Status} Estado de la simulacion
     */
    getStatus(): Status {
        return this.status;
    }

    /**
     * Cambia el estado de la simulacion dependiendo del estado en el que se encuentre.
     */
    changeStatus(): void {
        if (this.status === Status.STOPPED)
            this.status = Status.RUNNING;
        else
            this.status = Status.STOPPED;
    }

    /**
     * @returns {number} Tiempo durante el que se ejecuta la simulacion
     */
    getMaxTime (): number {
        return this.max_time;
    }

    /**
     * @param {number} max_time Nuevo tiempo durante el que se ejecuta la simulacion
     */
    setMaxTime (max_time: number): void {
        this.max_time = max_time;
    }
}
