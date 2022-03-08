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


export class CircuitFactory {

    //ids asociados a los componentes de los circuitos
    static CAPACITOR_ID: string = "C0";
    static INDUCTOR_ID: string  = "L0";
    static CELL_ID: string      = "V0";
    static RESISTOR_ID: string   = "R0";
    static SWITCH_ID: string    = "S0";

    /**
     * 
     * @param {string} type Tipo del circuito que se quiere utilizar.  
     * @returns {Circuit | null} Circuito resultante. Si el tipo @param {string} type no está definido
     *                           , entonces devolverá null. En caso contrario, devuelve un circuito.
     */
    static createCircuit (type: string): Circuit | null {
        let circuit: Circuit = new Circuit();
        
        let cell: Cell = ComponentFactory.createCell(this.CELL_ID, 5);
        let resistor: Resistor = ComponentFactory.createResistor(this.RESISTOR_ID, 10, "x1");
        let swi: Switch = ComponentFactory.createSwitch(this.SWITCH_ID, 1);

        circuit.addComponent(cell);
        circuit.addComponent(resistor);
        circuit.addComponent(swi);

        if (type === "RL"){
            let inductor: Inductor = ComponentFactory.createInductor(this.INDUCTOR_ID, 50, "miliH");
            circuit.addComponent(inductor);
            return circuit;
        }else if (type === "RC"){
            let capacitor: Capacitor = ComponentFactory.createCapacitor(this.CAPACITOR_ID, 50, "miliF");
            circuit.addComponent(capacitor);
            return circuit;
        }

        return null;
    }
}