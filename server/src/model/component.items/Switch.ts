/**
 * @fileoverview Implementación del componente Interruptor. Existen dos posibles valores para
 * para este componente:
 *      - VALUE = 0. El componente cierra el circuito de forma que tanto la resistencia como el condensador o el inductor
 *                   no reciban energía de la fuente (estado de disipación de energía)
 *      - VALUE = 1. El componente cierra el circuito de tal forma que el resto de los componentes reciban energía de la 
 *                   fuente (estado de almacenamiento de energía).
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Component } from "./Component";

export class Switch extends Component {

    constructor(id: string, value: number){
        super("Switch", id, value);
    }

    /**
     * Cambia el valor actual del interruptor por otro
     */
    changeValue(): void {
        if (this.value === 0)
            this.setValue(1);
        else
            this.setValue(0);
    }
}