/**
 * @fileoverview implementación de la simulación de circuitos RC simples
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { ComponentsIds } from "../circuit/ComponentsIds";
import { Capacitor } from "../component.items/Capacitor";
import { Cell } from "../component.items/Cell";
import { Inductor } from "../component.items/Inductor";
import { Resistor } from "../component.items/Resistor";
import { Switch } from "../component.items/Switch";
import { CircuitSimulation } from "./CircuitSimulation";
import { SimpleRCCircuitResult } from "./SimpleRCCircuitResult";


export class RcSimulation extends CircuitSimulation {

    /**
     * Devuelve los resultados de la simulación de un circuito RC simple
     * @returns {SimpleCircuitResults[] | undefined} Resultados
     */
    getResults() : SimpleRCCircuitResult[]|undefined {
        let resistor: Resistor = <Resistor>this.getCircuit().getComponentById(ComponentsIds.RESISTOR_ID);
        let capacitor: Capacitor = <Capacitor>this.getCircuit().getComponentById(ComponentsIds.CAPACITOR_ID);
        let cell: Cell = <Cell>this.getCircuit().getComponentById(ComponentsIds.CELL_ID);
        let swi: Switch = <Switch>this.getCircuit().getComponentById(ComponentsIds.SWITCH_ID);
        
        if (<Inductor>this.getCircuit().getComponentById(ComponentsIds.INDUCTOR_ID) != undefined){
            throw new Error(`[SERVER]: ERROR SimpleRcSimulation over a circuit with an inductor`)
        }

        if (capacitor == undefined){
            throw new Error(`[SERVER]: ERROR SimpleRcSimulation over a circuit without a capacitor`)
        }

        if (resistor == undefined){
            throw new Error(`[SERVER]: ERROR SimpleRcSimulation over a circuit without a resistor`) 
        }

        if (cell == undefined){
            throw new Error(`[SERVER]: ERROR SimpleRcSimulation over a circuit without a cell`) 
        }

        if (swi == undefined){
            throw new Error(`[SERVER]: ERROR SimpleRcSimulation over a circuit without a switch`) 
        }


        
        // START TO GET VALUES
        let time_constant: number = resistor.getComponentValue() * capacitor.getComponentValue();

        if (swi.getComponentValue() === 1){ // CARGA DE CONDENSADOR
            return this.simulationOnCharge(4*time_constant, cell, capacitor, resistor);
        }else if (swi.getComponentValue() === 0 || cell.getComponentValue() === 0){ // DESCARGA DEL CONDENSADOR
            return this.simulationOnDischarge(4*time_constant, cell, capacitor, resistor);
        }

        return undefined;
    }

    /**
     * Resultados de la simulación en estado de carga 
     * @param {number} maxTime Tiempo por el que se va a ejecutar la simulación
     * @param {number} cell  Fuente
     * @param {number} capacitor Condensador
     * @param {number} resistor  Resistencia
     * @returns {SimpleCircuitResult[]} Resultados de la simulación
     */
    private simulationOnCharge(maxTime: number, cell: Cell, capacitor: Capacitor, resistor: Resistor): SimpleRCCircuitResult[]{
        let time_results: SimpleRCCircuitResult[] = [];
        for (let t=0; t<=maxTime; t+=this.getStep()) {
            let q : number = capacitor.getComponentValue()*cell.getComponentValue()*(1-Math.pow(Math.E, (-t)/(resistor.getComponentValue()*capacitor.getComponentValue())));
            let Vc: number = q/capacitor.getComponentValue();
            let I : number = (cell.getComponentValue()/resistor.getComponentValue())*Math.pow(Math.E, (-t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
            let Vr: number = I*resistor.getComponentValue();
            let E: number = (1/2)*capacitor.getComponentValue()*Math.pow(Vc, 2);

            let partial_res: SimpleRCCircuitResult = new SimpleRCCircuitResult(t, q, Vc, Vr, I, E);
            time_results.push(partial_res);
        }
        return time_results;
    }

    /**
     * Resultados de la simulación en estado de descarga 
     * @param {number} maxTime Tiempo por el que se va a ejecutar la simulación
     * @param {number} cell  Fuente
     * @param {number} capacitor Condensador
     * @param {number} resistor  Resistencia
     * @returns {SimpleCircuitResult[]} Resultados de la simulación
     */
    private simulationOnDischarge (maxTime: number, cell: Cell, capacitor: Capacitor, resistor: Resistor): SimpleRCCircuitResult[] {
        let time_results: SimpleRCCircuitResult[] = [];
        let q_max: number = capacitor.getComponentValue()*cell.getComponentValue();
        for (let t=0; t<=maxTime; t+=this.getStep()){
            let q: number  = q_max*Math.pow(Math.E, (-t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
            let Vc: number = q/capacitor.getComponentValue();
            let I: number  = (-q_max)/(resistor.getComponentValue()*capacitor.getComponentValue())*Math.pow(Math.E, (-t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
            let Vr: number = I*resistor.getComponentValue();
            let E: number = (1/2)*capacitor.getComponentValue()*Math.pow(Vc, 2);

            let partial_res: SimpleRCCircuitResult = new SimpleRCCircuitResult(t, q, Vc, Vr, I, E);
            time_results.push(partial_res);
        }
        return time_results;
    }
}