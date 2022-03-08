/**
 * @fileoverview Implementación de una simulación del circuito RC simple (FUENTE-RESISTENCIA-CONDENSADOR)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { timeStamp } from "console";
import { Circuit } from "../circuit/Circuit";
import { CircuitFactory } from "../circuit/CircuitFactory";
import { Capacitor } from "../component.items/Capacitor";
import { CircuitSimulation } from "./CircuitSimulation";

export class RcSim extends CircuitSimulation {

    private charging: boolean;

    //VARIABLES PRIVADAS DE NO ACCESO DESDE EL EXTERIOR
    private C: number  = <number>this.circuit.getComponentById(CircuitFactory.CAPACITOR_ID)?.getValue();
    private V: number  = <number>this.circuit.getComponentById(CircuitFactory.CELL_ID)?.getValue();
    private R: number  = <number>this.circuit.getComponentById(CircuitFactory.RESISTOR_ID)?.getValue();
    private q0: number = <number>(<Capacitor>this.circuit.getComponentById(CircuitFactory.CAPACITOR_ID)).getQ0();
    private Ss: number = <number>this.circuit.getComponentById(CircuitFactory.SWITCH_ID)?.getValue();

    constructor(){
        super(<Circuit>CircuitFactory.createCircuit("RC"));
        this.charging = true;        
    }

    /**
     * @returns {boolean} True, si el condensador está cargando, False en otro caso
     */
    isChargin (): boolean {
        return this.Ss === 1;
    }


    /**
     * @returns {number} Carga del condensador en el instante T0 de la simulacion
     */
    getCharge (): number {
        return this.isChargin() ? this.qOnCharge(this.getT0()) : this.qOnDischarge(this.getT0());
    }

    /**
     * @returns {number} Diferencia de potencial entre los bornes del condensador en el instante T0 de la simulacion
     */
    getVc(): number {
        return this.isChargin() ? this.VcOnCharge(this.getT0()) : this.VcOnDischarge(this.getT0());
    }
    
    /**
     * @returns {number} Intensidad del circuito 
     */
    getI(): number {
        return this.isChargin() ? this.IonCharge(this.getT0()) : this.IonDischarge(this.getT0());
    }
    
    /**
     * @returns {number} Diferencia de potencial entre los bornes de la resisntencia en el instante T0 de la simulacion
     */
    getVr(): number {
        return this.isChargin() ? this.VrOnCharge(this.getT0()) : this.VrOnDischarge(this.getT0());
    }

    /**
     * @returns {number} Energía almacenada en el condensador en el instante T0
     */
    getEnergy(): number {
        return this.isChargin() ? this.energyOnCharge(this.getT0()) : this.energyOnDischarge(this.getT0());
    }


    //MÉTODOS PRIVADOS ASOCIADOS A LA CARGA DEL CONDENSADOR

    /**
     * @param {number} t Tiempo
     * @returns {number} Carga del condensador en el instante t cuando el condensador
     */
    private qOnCharge (t: number): number{
        return this.C*this.V*(1-Math.pow(Math.E, -t*(this.R*this.C)));
    }

    /**
     * @param {number} t Tiempo
     * @returns {number} Diferencia de potencial de los bornes del condensador en estado de carga
     */
    private VcOnCharge (t: number): number {
        return this.qOnCharge(t)/this.C;
    }


    /**
     * @param {number} t Tiempo
     * @returns {number} Intensidad de corriente en el circuito mientras el condensador está en estado de carga
     */
    private IonCharge(t: number): number {
        return (this.V/this.R)*Math.pow(Math.E, -t*(this.R*this.C));
    }


    /**
     * @param {number} t Tiempo
     * @returns {number} Diferencia de potencial en los bornes de la resistencia cuando el condensador está en 
     *                   estado de carga
     */
    private VrOnCharge (t: number): number {
        return this.IonCharge(t)*this.R;
    }


    /**
     * @param {number}  Tiempo
     * @returns {number} Energía almacenada actual del condensador en estado de carga
     */
    private energyOnCharge (t: number): number {
        return (1/2)*this.C*Math.pow(this.VcOnCharge(t),2);
    }

    //METODOS PRIVADOS ASOCIADOS A LA DESCARGA DEL CONDENSADOR

    /**
     * @param {number} t Tiempo
     * @returns {number} Carga del condensador en estado de descarga
     */
    private qOnDischarge (t: number): number {
        return this.q0*Math.pow(Math.E, -t*(this.R*this.C));
    }


    /**
     * @param {number} t 
     * @returns {number} Diferencia de potencial en los bornes del condensador en estado de descarga
     */
    private VcOnDischarge (t: number): number {
        return this.qOnDischarge(t)/this.C;
    }


    /**
     * @param {number} t Tiempo 
     * @returns {number} Intensidad de corriente cuando el condensador está en proceso de descarga
     */
    private IonDischarge (t: number): number {
        return (-this.q0/this.C)*Math.pow(Math.E, -t*(this.R*this.C));
    }


    /**
     * @param {number} t Tiempo 
     * @returns {number} Diferencia de potencial en los bornes de la resistencia en estado de descarga
     */
    private VrOnDischarge (t:number): number {
        return this.IonDischarge(t)*this.R;
    }


    /**
     * @param {numnber} t Tiempo
     * @returns {number} Energía almacenada en el condensador cuando este se está descargando
     */
    private energyOnDischarge (t: number): number {
        return (1/2)*this.C*Math.pow(this.VcOnDischarge(t),2); 
    }
}