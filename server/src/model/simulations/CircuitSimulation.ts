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

export class CircuitSimulation {
    private circuit: Circuit;
    private t0: number;
    private tT: number;
    private status: string;

    /**
     * 
     * @param {Circuit} circuit Circuito sobre el que se realiza la simulación (RC o RL)
     */
    constructor (circuit: Circuit){
        this.circuit = circuit;
        this.t0 = 0;
        this.tT = 0;
        this.status = "Paused";
    }

    //GETTERS-SETTERS
    getCircuit (): Circuit {
        return this.circuit;
    }

    setCircuit (circuit: Circuit): void {
        this.circuit = circuit;
    }

    getT0(): number {
        return this.t0;
    }

    setT0(t0: number): void{
        this.t0 = t0;
    }

    getT(): number {
        return this.tT;
    }

    setT(t: number): void {
        this.tT = t;
    }

    getStatus(): string {
        return this.status;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    //otros métodos

    /**
     * Método utilizado para poner en marcha la simulación. Cambio del estado por "Runnin".
     */
    resumeSimulation(): void {
        this.status = "Running";
    }

    /**
     * Método usado para pausar la simulación. Cambio del estado por "Paused"
     */
    pauseSimulation(): void {
        this.status = "Paused";
    }

    /**
     * Método usado para reiniciar la simulación. Los tiempos t0 y tT se ponen a 0, y 
     * el estado a "Paused".
     */
    restartSimulation(): void {
        this.t0 = 0;
        this.tT = 0;
        this.status = "Paused";
    }

}
