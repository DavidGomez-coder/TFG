/**
 * @fileoverview Este fichero implementa el funcionamiento de una fuente. En este caso, 
 * , una fuente solamente dispondrá de un valor
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { cellMuls } from "../constants/CellData";
import { Component } from "./Component";

export class Cell extends Component{

    constructor(id: string, value: number){
        super("Cell", id, value);
        this.multiplier = "V"
        this.setComponentValue();
    }

    setValue(value: number): void {
        this.value = value;
        this.setComponentValue();
    }
    setMultiplier(multiplier: string): void {
        this.multiplier = multiplier;
        this.setComponentValue();
    }
    setComponentValue(): void {
        this.componentValue = this.value * <number>cellMuls.get(this.multiplier);
    }

}