import { Circuit } from "../circuit/Circuit";

/**
 * @fileoverview Este fichero implementa una simulación sobre un circuito. 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

export class CircuitSimulation {

    private circuit: Circuit;

    constructor (circuit: Circuit){
        this.circuit = circuit;
    }

    /**
     * @returns {Circuit} circuit
     */
    getCircuit(): Circuit {
        return this.circuit;
    }

    /**
     * @param {Circuit} circuit
     */
    setCircuit(circuit: Circuit){
        this.circuit = circuit;
    }
}