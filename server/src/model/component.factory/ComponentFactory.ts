/**
 * @fileoverview Este fichero implementa un ComponentFactory. Esto permite, de forma estática, 
 *               construir cualquier componente sin tener que declarar un constructor previo.
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Capacitor } from "../component.items/Capacitor";
import { Cell } from "../component.items/Cell";
import { Inductor } from "../component.items/Inductor";
import { Resistor } from "../component.items/Resistor";
import { Switch } from "../component.items/Switch";


export class ComponentFactory {

    constructor(){}

    static createCell (id: string, value: number): Cell{
        return new Cell(id, value);
    }

    static createSwitch (id: string, value: number): Switch {
        return new Switch(id, value);
    }

    static createResistor (id: string, value: number, multiplier: string): Resistor {
        return new Resistor(id, value, multiplier);
    }

    static createCapacitor (id: string, value: number, multipler: string): Capacitor {
        return new Capacitor(id, value, multipler);
    }

    static createInductor (id: string, value: number,  multipler: string): Inductor {
        return new Inductor(id, value, multipler);
    }
}