/**
 * @fileoverview Implementación de una resistencia de 4 bandas. 
 *      - BANDAS 1 y 2. Colores asociados al valor entero de la resistencia.
 *      - BANDA 3.  Banda asociada al multiplicador (permite obtener valores menores que 0 y mayores que 99)
 *      - BANDA 4.  Tolerancia de la resistencia. Por defecto, esta tendrá una tolerancia del +-1%, aunque esta 
 *                  no tendrá relevancia, ya que se usará siempre el valor teórico de la misma (bandas 1,2 y 3).
 * 
 *      - VALUE: Capacidad resistiva del componente. Su unidad de medida es el ohmio ()
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Component } from "./Component";
import { valueBands, multiplerBands, multiplierValues} from "../constants/ResistorData";

export class Resistor extends Component {

    private colorBands: string[];

    constructor(id: string, value: number, multiplier: string){
        super("Resistor", id, -1);
        this.multiplier = multiplier;
        this.value = value;
        this.colorBands = this.calculateColorBands(value, multiplier);
        this.setComponentValue();
    }

    setComponentValue(): void {
        this.componentValue = this.calculateValue(this.value, this.multiplier);
    }

    setValue(value: number): void {
        this.value = value;
        this.setComponentValue();
        this.setColorBands(this.calculateColorBands(this.value, this.multiplier));
    }
    
    setMultiplier(multiplier: string): void {
        this.multiplier = multiplier;
        this.setComponentValue();
        this.setColorBands(this.calculateColorBands(this.value, this.multiplier));
    }
    

    /** 
     * @returns {string[]} colorBands
     */
    getColorBands(): string[] {
        return this.colorBands;
    }

    /**
     * @param {string[]} colorBands colorBands 
     */
    setColorBands(colorBands: string[]): void {
        this.colorBands = colorBands;
    }

    /**
     * 
     * @param {number} value Valor conjunto de las 2 primeras bandas 
     * @param {string} multiplier Valor asociado a la banda multiplicadora de la resistencia
     * @returns {number} Valor teórico de la resistencia
     */
    private calculateValue(value: number, multiplier: string): number {
        return value * <number>multiplierValues.get(multiplier);
    }

    /**
     * Método usado para calcular los colores de las 4 bandas según el valor y el multiplicador 
     * @param {number} value Valor conjunto de las dos primeras bandas 
     * @param {string} multiplier Valor asociado a la banda multiplicadora de la resistencia 
     * @returns {string[]} Array con los colores de las 4 bandas. (La banda de la tolerancia es constante)
     */
    private calculateColorBands(value: number, multiplier: string): string[] {
        let colors: string[] = ["","","","#B22222"];
        //cálculo de las bandas asociadas al valor
        if (value === 0){
            colors[0] = <string>valueBands.get(0);
            colors[1] = <string>valueBands.get(0);
        }else if (value>0 && value<10){
            colors[0] = <string>valueBands.get(0);
            colors[1] = <string>valueBands.get(Math.trunc(value));
        }else{
            let first_digit: number = Math.trunc(value/10);
            let secnd_digit: number = Math.trunc(value%10);
            colors[0] = <string>valueBands.get(first_digit);
            colors[1] = <string>valueBands.get(secnd_digit);
        }

        //banda asociada al multiplicador
        colors[2] = <string>multiplerBands.get(multiplier);
        return colors;
    }
}