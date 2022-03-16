/**
 * @fileoverview Implementación de una simulación del circuito RC simple (FUENTE-RESISTENCIA-CONDENSADOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { CircuitIds } from "../circuit/CircuitIDs";
import { Capacitor } from "../component.items/Capacitor";
import { Resistor } from "../component.items/Resistor";
import { CircuitSimulation } from "./CircuitSimulation";

export class RcSim extends CircuitSimulation {

    //parametros constantes usados durante la simulacion
    private R: number;      //valor de la resistencia (Ohmios)
    private C: number;      //capacidad del condensador (Faradios)
    private V: number;      //valor de la fuente (Voltios)
    private S: number;      //estado del interruptor 


    private timeConstRC: number ;

    constructor (){
        super(<Circuit>CircuitFactory.createCircuit("RC"));
        this.R =<number>this.circuit.getComponentById(CircuitIds.RESISTOR_ID)?.getValue();
        this.C = <number>this.circuit.getComponentById(CircuitIds.CAPACITOR_ID)?.getValue();
        this.V = <number>this.circuit.getComponentById(CircuitIds.CELL_ID)?.getValue();  
        this.S = <number>this.circuit.getComponentById(CircuitIds.SWITCH_ID)?.getValue(); 
        this.timeConstRC = this.R * this.C;

        this.updateTimeConstRC(this.R,this.C);
    }

    //modificar circuito 

    /**
     * Método que actualiza el valor de la constante de tiempo RC
     * @param {number} R Valor de la resistencia
     * @param {number} C Capacidad del condensador
     */
    updateTimeConstRC (R: number, C: number): void {
        this.timeConstRC = R*C;
        this.setMaxTime(R*C);
    }

    /**
     * Método actualiza dentro del circuito el valor de la nueva resistencia
     * @param {number} resistor_value Nuevo valor de la resistencia sin el multiplicador aplicado 
     * @param {number} resistor_multiplier Nuevo multiplicador de la resistencia
     */
    updateResistor(resistor_value: number, resistor_multiplier: string): void {
        let resistor: Resistor = new Resistor(CircuitIds.RESISTOR_ID, resistor_value, resistor_multiplier);
        this.circuit.updateComponent(resistor);
        this.R = resistor.getValue();
        this.updateTimeConstRC(this.R, this.C);

    }



    //calcular valores en estado de almacenamiento de energia

    //calcular valores en estado de disipacion de energia

}