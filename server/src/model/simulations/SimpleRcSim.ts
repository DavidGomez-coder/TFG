/**
 * @fileoverview Implementación de una simulación del circuito RC simple (FUENTE-RESISTENCIA-CONDENSADOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { ComponentsIds } from "../circuit/ComponentsIds";
import { Capacitor } from "../component.items/Capacitor";
import { Cell } from "../component.items/Cell";
import { Resistor } from "../component.items/Resistor";
import { CircuitSimulation } from "./CircuitSimulation";

export class SimpleRcSim extends CircuitSimulation {

    private R: number;
    private C: number;
    private V: number;

    constructor(){
        super(<Circuit>CircuitFactory.createCircuit("RC"));
        this.R = <number>this.circuit.getComponentById(ComponentsIds.RESISTOR_ID)?.getValue();
        this.C = <number>this.circuit.getComponentById(ComponentsIds.CAPACITOR_ID)?.getValue();
        this.V = <number>this.circuit.getComponentById(ComponentsIds.CELL_ID)?.getValue();
        this.updateMaxTime(this.R * this.C);
    }

    /**
     * @param {number} value Nuevo valor de la resistencia sin el multiplicador aplicado 
     * @param {string} multiplier Multiplicador de la resistencia
     */
    updateResistor(value: number, multiplier: string): void {
        let nResistor: Resistor = new Resistor(ComponentsIds.RESISTOR_ID, value, multiplier);
        this.circuit.updateComponent(nResistor);
        this.updateR(nResistor.getValue());
        this.updateMaxTime(this.R * this.C);
    }    

    /**
     * @param {number} value Nuevo valor de la capacidad del condensador sin el multiplicador aplicado
     * @param {string} multipler Multiplicador del condensador
     */
    updateCapacitor(value: number, multipler: string): void{
        let nCapacitor: Capacitor = new Capacitor(ComponentsIds.CAPACITOR_ID, value, multipler);
        this.circuit.updateComponent(nCapacitor);
        this.updateC(nCapacitor.getValue());
        this.updateMaxTime(this.R * this.C);
    }

    /**
     * @param {number} value Nuevo valor de la pila
     */
    updateCellVal(value: number): void {
        let nCell: Cell = new Cell (ComponentsIds.CELL_ID, value);
        this.circuit.updateComponent(nCell);
        this.updateV(nCell.getValue());
    }

    //obtener parametros en estado de almacenamiento de energia

    //obtener parametros en estado de disipacion de energia


    /**
     * METODOS PRIVADOS usados para la actualización de las variables privadas correspondientes a la resistencia, capacidad del
     * condensador y valor de la fuente
     */

    private updateR(value: number): void {
        this.R = value;
    }

    private updateC(value: number): void {
        this.C = value;
    }

    private updateV(value: number): void {
        this.V = value;
    }
}