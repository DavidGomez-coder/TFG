/**
 * @fileoverview implementación de la simulación de circuitos RL simples
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { ComponentsIds } from "../circuit/ComponentsIds";
import { Capacitor } from "../component.items/Capacitor";
import { Cell } from "../component.items/Cell";
import { Inductor } from "../component.items/Inductor";
import { Resistor } from "../component.items/Resistor";
import { Switch } from "../component.items/Switch";
import { CircuitSimulation } from "./CircuitSimulation";
import { SimpleRLCircuitResult } from "./SimpleRLCircuitResult";

export class RlSimulation extends CircuitSimulation{

    /**
     * Método que devuelve los resultados de la simulación
     * @returns {SimpleRLCircuitResult[] | undefined} Resultados de la simulación
     */
    getResults() : SimpleRLCircuitResult[] | undefined  {
        let resistor: Resistor = <Resistor>this.getCircuit().getComponentById(ComponentsIds.RESISTOR_ID);
        let inductor: Inductor = <Inductor>this.getCircuit().getComponentById(ComponentsIds.INDUCTOR_ID);
        let cell: Cell = <Cell>this.getCircuit().getComponentById(ComponentsIds.CELL_ID);
        let swi: Switch = <Switch>this.getCircuit().getComponentById(ComponentsIds.SWITCH_ID);

        if (<Capacitor>this.getCircuit().getComponentById(ComponentsIds.CAPACITOR_ID) != undefined){
            throw new Error(`[SERVER]: ERROR SimpleRlSimulation over a circuit with a capacitor`);
        }

        if (inductor == undefined){
            throw new Error(`[SERVER]: ERROR SimpleRlSimulation over a circuit without an inductor`);
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
        let time_constant: number = inductor.getComponentValue()/resistor.getComponentValue();
        if (swi.getComponentValue() === 1){ // ALMACENAMIENTO DE ENERGÍA
            return this.simulationOnCharge(4*time_constant, cell, inductor, resistor);
        }else if (swi.getComponentValue() === 0 || cell.getComponentValue() === 0){ // DISIPACIÓN DE ENERGÍA
            return this.simulationOnDischarge(4*time_constant, cell, inductor, resistor);
        }
        return undefined;
    }


    /**
     * Resultados de la simulación en estado de almacenamiento de energía
     * @param {number} maxTime Tiempo de duración de la simulación 
     * @param {Cell} cell 
     * @param {Inductor} inductor 
     * @param {Resistor} resistor 
     * @returns {SimpleRLCircuitResult[]} Resultados
     */
    private simulationOnCharge(maxTime: number, cell: Cell, inductor: Inductor, resistor: Resistor): SimpleRLCircuitResult[]{
        let time_results: SimpleRLCircuitResult[] = [];
        for (let t=0; t<=maxTime; t+=this.getStep()){
            let I: number = (cell.getComponentValue()/resistor.getComponentValue())*(1-Math.pow(Math.E, (-t*resistor.getComponentValue())/(inductor.getComponentValue())));
            let Vr: number = resistor.getComponentValue()*I;
            let Vl: number = resistor.getComponentValue()*cell.getComponentValue()*(1-Math.pow(Math.E, (-t*resistor.getComponentValue())/(inductor.getComponentValue())));
            let E: number = (1/2)*inductor.getComponentValue()*Math.pow(I,2);
            let fem: number = -Vl;
            let phi: number = inductor.getComponentValue()*I;
            let partial_res: SimpleRLCircuitResult = new SimpleRLCircuitResult(t, Vl, Vr, I, E, fem, phi)
            time_results.push(partial_res); 
        }
        return time_results;
    }

    
    /**
     * Resultados de la simulación en estado de disipación de energía
     * @param {number} maxTime Tiempo de duración de la simulación 
     * @param {Cell} cell 
     * @param {Inductor} inductor 
     * @param {Resistor} resistor 
     * @returns {SimpleRLCircuitResult[]} Resultados
     */
    private simulationOnDischarge(maxTime: number, cell: Cell, inductor: Inductor, resistor: Resistor): SimpleRLCircuitResult[]{
        let time_results: SimpleRLCircuitResult[] = [];
        let i_max: number = cell.getComponentValue()/resistor.getComponentValue();
        for (let t=0; t<=maxTime; t+=this.getStep()){
            let I: number = i_max*Math.pow(Math.E, (-t*resistor.getComponentValue())/(inductor.getComponentValue()));
            let Vr: number = resistor.getComponentValue()*I;
            let Vl: number = -resistor.getComponentValue()*i_max*Math.pow(Math.E, (-t*resistor.getComponentValue())/(inductor.getComponentValue()));
            let E: number = (1/2)*inductor.getComponentValue()*Math.pow(I,2);
            let fem: number = -Vl;
            let phi: number = inductor.getComponentValue()*I;
            let partial_res: SimpleRLCircuitResult = new SimpleRLCircuitResult(t, Vl, Vr, I, E, fem, phi)
            time_results.push(partial_res); 
        }
        return time_results;
    }
    
}
