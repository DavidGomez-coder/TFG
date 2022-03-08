/**
 * @fileoverview Implementación de una simulación del circuito RL simple (FUENTE-RESISTENCIA-INDUCTOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { CircuitSimulation } from "./CircuitSimulation";

export class RlSim extends CircuitSimulation {
    constructor (){
        super(<Circuit>CircuitFactory.createCircuit("RL"));
    }
}
