/**
 * @fileoverview implementación de la simulación de circuitos RL simples
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

export class RlSimulation extends CircuitSimulation{

    getResults() : undefined  {
        return undefined;
    }


    
}
