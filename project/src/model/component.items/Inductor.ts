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
        this.setValue(this.calculateValue(value, multiplier));
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