import { Circuit } from "../circuit/Circuit";

/**
 * @fileoverview Este fichero implementa una simulación sobre un circuito. 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

export abstract class CircuitSimulation {

    private circuit: Circuit;
    private step: number;
    private simulation_time: number;

    constructor (circuit: Circuit){
        this.circuit = circuit;
        this.step = 0.1;
        this.simulation_time = 0;
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

    getSimulationTime(): number {
        return this.simulation_time;
    }

    setSimulationTime(simTime: number): void{
        this.simulation_time = simTime;
    }

    getStep(): number {
        return this.step;
    }

    setStep(step: number): void{
        this.step = step;
    }

    abstract getResults (): any;
}