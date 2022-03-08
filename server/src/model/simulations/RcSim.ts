/**
 * @fileoverview Implementación de una simulación del circuito RC simple (FUENTE-RESISTENCIA-CONDENSADOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { CircuitSimulation } from "./CircuitSimulation";

export class RcSim extends CircuitSimulation {
    constructor(){
        super(<Circuit>CircuitFactory.createCircuit("RC"));
    }
}