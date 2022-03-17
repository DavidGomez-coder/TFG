/**
 * @fileoverview Implemetación de un generador de simulaciones, dependiendo del tipo de circuito que queramos construir.
 * 
 * @author David Gómez Pérez <dpgv2000@gmail.com>
 */

import { CircuitSimulation } from "./CircuitSimulation";
import { SimpleRcSim } from "./SimpleRcSim";
import { SimpleRlSim } from "./SimpleRlSim";


export class SimulationFactory {
    /**
     * Metodo para crear simulaciones de circuitos RC simples
     * @returns {CircuitSimulation | null} Simulacion de circuito RC simple
     */
    static createSimpleRcSim (): CircuitSimulation | null {
        return new SimpleRcSim();
    }


    /**
     * Metodo para crear simulaciones de circuitos RL simples
     * @returns {CircuitSimulation | null} Simulacion circuito RL simple
     */
    static createSimpleRlSim (): CircuitSimulation | null {
        return new SimpleRlSim();
    }
}