/**
 * @fileoverview Implementación de una simulación del circuito RC simple (FUENTE-RESISTENCIA-CONDENSADOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { Capacitor } from "../component.items/Capacitor";
import { CircuitSimulation } from "./CircuitSimulation";

export class RcSim extends CircuitSimulation {

    //parametros constantes usados durante la simulacion
    private R: number = <number>this.circuit.getComponentById(CircuitFactory.RESISTOR_ID)?.getValue();      //valor de la resistencia (Ohmios)
    private C: number = <number>this.circuit.getComponentById(CircuitFactory.CAPACITOR_ID)?.getValue();     //capacidad del condensador (Faradios)
    private V: number = <number>this.circuit.getComponentById(CircuitFactory.CELL_ID)?.getValue();          //valor de la fuente (Voltios)
    private S: number = <number>this.circuit.getComponentById(CircuitFactory.SWITCH_ID)?.getValue();        //estado del interruptor 


    private timeConstRC: number = this.R*this.C;

    constructor (circuit: Circuit){
        super(circuit);
        this.setMaxTime(this.timeConstRC)
    }

    //modificar circuito

    //calcular valores en estado de almacenamiento de energia

    //calcular valores en estado de disipacion de energio

}