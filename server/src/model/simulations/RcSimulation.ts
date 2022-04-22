/**
 * @fileoverview implementación de la simulación de circuitos RC simples
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitSimulation } from "./CircuitSimulation";


export class RcSimulation extends CircuitSimulation {


    getResults() : any {
        return "RES1"
    }
}