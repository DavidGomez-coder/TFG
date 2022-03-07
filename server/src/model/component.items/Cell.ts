/**
 * @fileoverview Este fichero implementa el funcionamiento de una fuente. En este caso, 
 * , una fuente solamente dispondrá de un valor
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { Component } from "./Component";

export class Cell extends Component{

    constructor(id: string, value: number){
        super("Cell", id, value);
    }

}