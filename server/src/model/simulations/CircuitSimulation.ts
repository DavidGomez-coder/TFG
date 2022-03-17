/**
 * @fileoverview Implementacion logica de la simulacion. Una simulacion se compone de tres elementos fundamentales.
 *              - CIRCUITO. Es el circuito sobre el que se va a realizar la simulación: RC o RL
 *              - tT. Es el tiempo total por el que se va a realizar la  simulación. En caso de los circuitos RC y RL, este tiempo
 *                    será 4 veces su constante de tiempo.
 *              - STATUS. Indica como afecta el estado del interruptor al resto del sistema. Si el interruptor está cerrado (s=1), entonces
 *                        la simulación se orientará al almacenamiento de energía. Por otro lado, si el interruptor está abierto (s=0) se procederá
 *                        a la disipación de dicha energía. En el primer caso, se supondrá que la energía almacenada para t=0 es 0 (E(0) = 0), mientras que
 *                        cuando el interruptor se posiciona para la disipación de energía del condensador o del inductor, entonces esta energía será máxima 
 *                        (condensador con máxima carga e inductor con máxima energía almacenada)
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { throwStatement } from "@babel/types";
import { Circuit } from "../circuit/Circuit";
import { ComponentsIds } from "../circuit/ComponentsIds";
import { Switch } from "../component.items/Switch";



export class CircuitSimulation {

   protected circuit: Circuit;
   protected tT: number = -1; //esta propiedad se define cuando se construya la simulación correspondiente (RC o RL)
   protected status: number;

   constructor (circuit: Circuit){
       this.circuit = circuit;
       this.status = <number>circuit.getComponentById(ComponentsIds.SWITCH_ID)?.getValue();
   }

   /**
    * @returns {Circuit} circuit
    */
   getCircuit(): Circuit {
       return this.circuit;
   }

   /**
    * @param {Circuit} circuit 
    */
   setCircuit(circuit: Circuit): void {
       this.circuit = circuit;
   }

   /**
    * @returns {number} Tiempo de la simulacion
    */
   getMaxTime(): number {
       return this.tT;
   }

   /**
    * Metodo usado para actualizar el tiempo maximo de la simulacion de un circuito
    * @param {number} maxTime 
    */
   updateMaxTime(maxTime: number): void {
       this.tT = maxTime;
   }

   /**
    * @returns {number} number
    */
   getStatus(): number {
       return this.status;
   }

   /**
    * @param {number} status 
    */
   setStatus(status: number): void {
       this.status = status;
   }

   /**
    * Cambia el estado actual de la simulacion por otro
    *   -> alterna entre ALMACENAMIENTO-DISIPACION de energía
    */
   changeStatus(): void {
        let sC: Switch = <Switch>this.circuit.getComponentById(ComponentsIds.SWITCH_ID);
        sC.changeValue();
        this.circuit.updateComponent(sC);
        this.status = <number>this.circuit.getComponentById(ComponentsIds.SWITCH_ID)?.getValue();
   }

}
