/**
 * @fileoverview Implementación de una simulación del circuito RL simple (FUENTE-RESISTENCIA-INDUCTOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { CircuitIds } from "../circuit/CircuitIDs";
import { ComponentFactory } from "../component.factory/ComponentFactory";
import { CircuitSimulation } from "./CircuitSimulation";

export class RlSim extends CircuitSimulation {
    
    private R: number = <number>this.circuit.getComponentById(CircuitIds.RESISTOR_ID)?.getValue();
    private L: number = <number>this.circuit.getComponentById(CircuitIds.INDUCTOR_ID)?.getValue();
    private V: number = <number>this.circuit.getComponentById(CircuitIds.CELL_ID)?.getValue();
    private S: number = <number>this.circuit.getComponentById(CircuitIds.SWITCH_ID)?.getValue();

    private constTimeRL = this.L/this.R;


    constructor (){
        super(<Circuit>CircuitFactory.createCircuit("RL"));
    }

    //modificar circuito

    //calcular valores en estado de almacenamiento de energia

    //calcular valores en estado de disipacion de energia
}
