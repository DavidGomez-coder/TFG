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


    // -------------------------------------------------------------
    //              METODOS USADOS POR EL CONTROLADOR 
    // -------------------------------------------------------------

    /**
     * @param {number} value Nuevo valor de la resistencia sin el multiplicador aplicado 
     * @param {string} multiplier Multiplicador de la resistencia
     */
    updateResistor(value: number, multiplier: string): void {
        let nResistor: Resistor = new Resistor(ComponentsIds.RESISTOR_ID, value, multiplier);
        this.circuit.updateComponent(nResistor);
        this.updateR(nResistor.getValue());
    }    

    /**
     * @param {number} value Nuevo valor de la capacidad del condensador sin el multiplicador aplicado
     * @param {string} multipler Multiplicador del condensador
     */
    updateCapacitor(value: number, multipler: string): void{
        let nCapacitor: Capacitor = new Capacitor(ComponentsIds.CAPACITOR_ID, value, multipler);
        this.circuit.updateComponent(nCapacitor);
        this.updateC(nCapacitor.getValue());
    }

    /**
     * @param {number} value Nuevo valor de la pila
     */
    updateCellVal(value: number): void {
        let nCell: Cell = new Cell (ComponentsIds.CELL_ID, value);
        this.circuit.updateComponent(nCell);
        this.updateV(nCell.getValue());
    }

    // -------------------------------------------------------------
    // PROPIEDADES DE LOS ELEMENTOS DEL CIRCUITO (CARGA Y DESCARGA)
    // -------------------------------------------------------------
    
    /**
     * @param {number} t 
     * @returns {number} carga del condensador en el instante t (Culombios)
     */
    getCapacitorCharge(t: number): number {
        return this.status == 1 ? this.getCapacitorChargeOnCharge(t) : this.getCapacitorChargeOnDischarge(t);
    }   

    /**
     * @param {number} t  
     * @returns {number} Dpp en el condensador en el instante t (Voltios)
     */
    getDppVc(t: number): number {
        return this.status == 1 ? this.getCapacitorVcOnCharge(t) : this.getCapacitorVcOnDischarge(t);
    }

    /**
     * @param {number} t 
     * @returns {number} Intensidad de corriente en el circuito en el instante t (Amperios) 
     */
    getI(t: number): number {
        return this.status == 1 ? this.getCurrentOnCharge(t) : this.getCurrentOnDischarge(t);
    }

    /**
     * @param {number} t 
     * @returns {number} Dpp en la resistencia en el instante t (Ohmios)
     */
    getDppVr(t: number): number {
        return this.status == 1 ? this.getVrOnCharge(t) : this.getVrOnDischarge(t);
    }

    /** 
     * @param {number} t 
     * @returns {number} Energía almacenada en el condensador en el instante t
     */
    getCapacitorEnergy (t: number): number {
        return this.status == 1 ? this.getEnergyOnCharge(t) : this.getEnergyOnDischarge(t);
    }

    // -------------------------------------------------------------
    //              PROPIEDADES EN ALMACENAMIENTO DE ENERGÍA 
    // -------------------------------------------------------------

    /**
     * @param {number} t Instante t 
     * @returns {number} Carga del condensador en el instante t mientras carga energía
     */
    private getCapacitorChargeOnCharge(t: number): number {
        return this.C * this.V*(1-Math.pow(Math.E,(-t/(this.R * this.C))));
    }

    /**
     * @param {number} t Instante t 
     * @returns {number} Dpp en el condensador en el instante t mientras carga energía
     */
    private getCapacitorVcOnCharge(t: number): number {
        return this.getCapacitorChargeOnCharge(t)/this.C;
    }

    /**
     * @param {number} t Instante t 
     * @returns {number} Intensidad del circuito en el instante t mientras el condensador carga energía
     */
    private getCurrentOnCharge(t: number): number{
        return (this.V/this.R) * Math.pow(Math.E, (-t/(this.R * this.C)));
    }

    /**
     * @param {number} t Instante t 
     * @returns {number} Dpp en la resistencia en el instante t mientras el condensador carga energía
     */
    private getVrOnCharge(t: number): number {
        return this.getCurrentOnCharge(t) * this.R;
    }

    /**
     * @param {number} t 
     * @returns {number} Energía almacenada en el condensador mientra está en carga
     */
    private getEnergyOnCharge (t: number): number {
        return (1/2)*this.C*Math.pow(this.getCapacitorVcOnCharge(t),2);
    }

    // -------------------------------------------------------------
    //              PROPIEDADES EN DISIPACIÓN DE ENERGÍA 
    // -------------------------------------------------------------

    /**
     * @param {number} t Instante t 
     * @returns {number} Carga del condensador cuando este se encuentra en estado de descarga 
     */
    private getCapacitorChargeOnDischarge (t: number): number {
        let q0 = this.C * this.V; //carga máxima que soporta el condensador
        return q0 * Math.pow(Math.E, (-t / (this.R *this.C)));
    }

    /**
     * @param {number} t Instante t
     * @returns {number} Dpp en el condensador cuando este se encuentra en estado de descarga
     */
    private getCapacitorVcOnDischarge (t: number): number {
        return this.getCapacitorChargeOnDischarge(t) / this.C;
    }

    /**
     * @param {number} t Instante t
     * @returns {number} Intensidad en el circuito cuando el condensador se encuentra en estado de descarga
     */
    private getCurrentOnDischarge (t: number): number {
        let q0 = this.C * this.V; //carga máxima que soporta el condensador
        return (-q0)/(this.C*this.R)*Math.pow(Math.E, (-t/(this.C*this.R))); 
    }

    /**
     * @param {number} t Instante t
     * @returns {number} Dpp en la resistencia cuando el condensador se encuentra en estado de descarga
     */
    private getVrOnDischarge (t: number): number {
        return this.R * this.getCurrentOnDischarge(t);
    }

    /**
     * @param {number} t 
     * @returns {number} Energía almacenada en el condensador mientra está en descarga
     */
    private getEnergyOnDischarge (t: number): number {
        return (1/2)*this.C*Math.pow(this.getCapacitorVcOnDischarge(t),2);
    }

    // -------------------------------------------------------------
    //                             OTROS 
    // -------------------------------------------------------------

    private updateR(value: number): void {
        this.R = value;
        this.updateMaxTime(this.R * this.C);
    }

    private updateC(value: number): void {
        this.C = value;
        this.updateMaxTime(this.R * this.C);
    }

    private updateV(value: number): void {
        this.V = value;
    }
}