/**
 * @fileoverview Implementación de un inductor
 *               - VALUE: valor asociado a la inductancia. Su unidad de medida es el henrio (H)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { inductorMuls } from "../constants/InductorData";
import { Component } from "./Component";

export class Inductor extends Component {


    constructor (id: string, value: number, multiplier: string) {
        super("Inductor", id, -1);
        this.value = this.calculateValue(value, multiplier);
        this.multiplier = multiplier;
        this.setComponentValue();
    }


    setValue(value: number): void {
        this.value = value;
        this.setComponentValue()
    }

    setMultiplier(multiplier: string): void {
        this.multiplier = multiplier;
        this.setComponentValue();
    }
    
    setComponentValue(): void {
        this.componentValue = this.calculateValue(this.value, this.multiplier);
    }



    //metodos privados

    /**
     * 
     * @param {number} value Valor sin multiplicador
     * @param {string} multipler Multiplicador del inductor
     * @returns {number} valor real del componente
     */
    private calculateValue(value: number, multipler: string): number {
        return value*<number>inductorMuls.get(multipler);
    }
}