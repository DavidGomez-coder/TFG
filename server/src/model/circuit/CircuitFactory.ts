/**
 * @fileoverview Fichero para la creación de circuitos predefinidos. Actualmente solo se encuentran implementados los circuitos
 *               RC y RL.
 * 
 * @author David Gómez Pérez <dpgv2000@gmail.com>
 */

import { ComponentFactory } from "../component.factory/ComponentFactory";
import { Capacitor } from "../component.items/Capacitor";
import { Cell } from "../component.items/Cell";
import { Inductor } from "../component.items/Inductor";
import { Resistor } from "../component.items/Resistor";
import { Switch } from "../component.items/Switch";
import { Circuit } from "./Circuit";
import { ComponentsIds } from "./ComponentsIds";



export class CircuitFactory {

   

    /**
     * 
     * @param {string} type Tipo del circuito que se quiere utilizar.  
     * @returns {Circuit | null} Circuito resultante. Si el tipo @param {string} type no está definido
     *                           , entonces devolverá null. En caso contrario, devuelve un circuito.
     */
    static createCircuit (type: string): Circuit | null {
        let circuit: Circuit = new Circuit();
        
        let cell: Cell = ComponentFactory.createCell(ComponentsIds.CELL_ID, 5);
        let resistor: Resistor = ComponentFactory.createResistor(ComponentsIds.RESISTOR_ID, 10, "x1");
        let swi: Switch = ComponentFactory.createSwitch(ComponentsIds.SWITCH_ID, 1);

        circuit.addComponent(cell);
        circuit.addComponent(resistor);
        circuit.addComponent(swi);

        if (type === "RL"){
            let inductor: Inductor = ComponentFactory.createInductor(ComponentsIds.INDUCTOR_ID, 50, "miliH");
            circuit.addComponent(inductor);
            return circuit;
        }else if (type === "RC"){
            let capacitor: Capacitor = ComponentFactory.createCapacitor(ComponentsIds.CAPACITOR_ID, 99, "microF");
            circuit.addComponent(capacitor);
            return circuit;
        }

        return null;
    }
}