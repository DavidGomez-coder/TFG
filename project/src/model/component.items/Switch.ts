/**
 * @fileoverview Implementación del componente Interruptor. Existen dos posibles valores para
 * para este componente:
 *      - VALUE = 0. El componente cierra el circuito de forma que tanto la resistencia como el condensador o el inductor
 *                   no reciban energía de la fuente (estado de disipación de energía)
 *      - VALUE = 1. El componente cierra el circuito de tal forma que el resto de los componentes reciban energía de la 
 *                   fuente (estado de almacenamiento de energía).
 */

import { Component } from "./Component";

export class Switch extends Component {

    constructor(id: string, value: number){
        super("Switch", id, value);
    }
}