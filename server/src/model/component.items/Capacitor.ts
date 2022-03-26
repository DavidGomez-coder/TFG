/**
 * @fileoverview Implementación de un condensador. 
 *               - VALUE: capacidad disponible en el condensador. Su unidad de medida son los
 *                        faradios (F)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Component } from "./Component";
import { capacitorMults } from "../constants/CapacitorData";

export class Capacitor extends Component {

    constructor (id: string, value: number, multiplier: string){
        super("Capacitor", id, -1);
        this.setValue(this.calculateValue(value, multiplier));
    }

    //metodos privados

    /**
     * 
     * @param {number} value Valor sin multiplicador
     * @param {string} multipler Multiplicador del condensador
     * @returns {number} valor real del componente
     */
    private calculateValue (value: number, multipler: string): number {
        return value * <number>capacitorMults.get(multipler);
    }



}