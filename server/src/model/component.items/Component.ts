/**
 * @fileoverview En este fichero se implementa la lógica que requiere la clase padre componente. Cada uno de los
 * componentes definidos, requieren de los siguientes parámetros:
 *      - ID. Se trata de un identificador único que se asocia a cada uno de los componentes. Este 
 *            parámetro es utilizado dentro del circuito, para poder manipular cada uno de los componentes
 *            de forma individual.
 *      - VALOR. Es el valor o estado en el que se encuentra el componente. Como no es posible indicar las unidades
 *               del valor dependiendo del componente, se utiliza el parámetro TIPO, el cuál nos ayuda a identificar dichas 
 *               unidades dependiendo de éste.
 *      - TIPO. El tipo es definido para una mejor representación del mismo, pudiendo diferenciar entre sí dentro de un formato 
 *              JSON cada uno de los tipos, y así mejorar la transferencia y el uso de estos datos.
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */


/**
 * @class Clase componente.
 */
export class Component {
    protected type:  string;
    protected id:    string;
    protected value: number;

    /**
     * @constructor
     * @param {string} type 
     * @param {string} id 
     * @param {value}  value 
     */
    constructor (type: string, id: string, value: number){
        this.type = type;
        this.id = id;
        this.value = value;
    }

    /**
     * @returns {string} TIPO
     */
    getType(): string {
        return this.type;
    }


    /**
     * @returns {string} ID
     */
    getId(): string {
        return this.id;
    }

    /**
     * @returns {number} VALOR
     */
    getValue(): number {
        return this.value;
    }

    /**
     * @param {string} type nuevo TIPO 
     */
    setType(type: string): void {
        this.type = type;
    }

    /**
     * @param {string} id nuevo ID
     */
    setId(id: string): void {
        this.id = id;
    }


    /**
     * @param {number} value nuevo VALOR 
     */
    setValue(value: number): void {
        this.value = value;
    }


    /**
     * Método usado para comparar si un componente es igual o no a la instancia actual
     * @param {Component} component Componente con el que comparar
     * @returns {boolean} True si se trata del mismo componente, false en caso contrario
     */
    equals(component: Component): boolean{
        return this.getId() === component.getId() && this.getType() === component.getType();
    }


}