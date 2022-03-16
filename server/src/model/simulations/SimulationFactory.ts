/**
 * @fileoverview Implemetación de un generador de simulaciones, dependiendo del tipo de circuito que queramos construir.
 * 
 * @author David Gómez Pérez <dpgv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { CircuitSimulation } from "./CircuitSimulation";
import { RcSim } from "./RcSim";

export class SimulationFactory {


    /**
     * @param {string} type Tipo del circuito a simular 
     * @returns {CircuitSimulation} Simulación según el tipo de circuito
     */
    static createSimulation (type: string): CircuitSimulation | null {
        if (type === "RL"){
            let circuit: Circuit = <Circuit>CircuitFactory.createCircuit("RL");
            return new RcSim(circuit);
        }else if (type === "RC"){
            let circuit: Circuit = <Circuit>CircuitFactory.createCircuit("RC");
            return new CircuitSimulation(circuit);
        }

        return null;
    }
}