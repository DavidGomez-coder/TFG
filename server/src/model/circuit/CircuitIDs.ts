/**
 * @fileoverview Fichero que contiene los IDs utilizados en la elaboracion de los circuitos
 * predefinidos RC y RL (ya que este proyecto no está orientado a la construcción de circuitos, no es necesario llevar a cabo
 * una generación de identificadores, por lo que estos pueden ser estáticos y no tienen por qué tener que ser modificados)
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

export class CircuitIds {

     //ids asociados a los componentes de los circuitos
     static CAPACITOR_ID: string = "C0";
     static INDUCTOR_ID: string  = "L0";
     static CELL_ID: string      = "V0";
     static RESISTOR_ID: string  = "R0";
     static SWITCH_ID: string    = "S0";
}