/**
 * @fileoverview En este ficheor se implementa la clase circuito. Un circuito, se compone de una
 * lista de componenentes.
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { ComponentFactory } from "../component.factory/ComponentFactory";
import { Component } from "../component.items/Component";
import { Resistor } from "../component.items/Resistor";

/**
 * @class Clase circuito
 */
export class Circuit {
   private components: Component[];


   /**
    * @constructor Inicializa los componentes como una lista vacía
    */
   constructor (){
       this.components = [];
   }

   /**
    * @returns Componentes del circuito
    */
   getComponents(): Component[] {
       return this.components;
   }

   /**
    * Reemplaza la lista de componentes del circuito por otra nueva
    * @param {Component []} components Nuevos componentes
    */
   setComponents(components: Component[]): void{
        this.components = components;    
   }

   /**
    * Método que añade un nuevo componente al circuito
    * @param {Component} component Nuevo componente
    */
   addComponent(component: Component): void{
        this.components.push(component);
    }


    /**
     * Método que elimina un componente del circuito
     * @param {string} id Id del elemento a borrar 
     */
    deleteComponent(id: string): void {
        this.components = this.components.filter((elem: Component) => {
            return elem.getId() !== id;
        });
    }

   /**
    * @param {number} id Identificador del componente a buscar 
    * @returns {number} Devuelte el índice del componente 
    */
   getComponentById(id: string): Component | undefined {
        let pos = this.getComponentPositionById(id);
        if (pos >= 0){
            return this.components[pos];
        }
        return undefined;

    }


    /**
     * Este método actualiza el valor de un componente
     * @param {Component} component Nuevo componente
     */
    updateComponent (component: Component): void {
        let pos = this.getComponentPositionById(component.getId());
        if (pos >= 0){
            if (this.components[pos].equals(component)){
                this.components[pos] = component;
            }
        }
    }



   //private functions
   /**
    * Método usado para devolver la posición en la que se encuentra el componente
    * con id pasado como parámetro
    * @param {string} id Identificador del componente
    * @returns {number} Posición del elemento a buscar. Devuelve -1 si el componente no ha 
    *                   sido encontrado
    */
   private getComponentPositionById(id: string): number {
        let count = 0;
        let find = false;
        while (!find && count < this.components.length){
            if (this.components[count].getId() === id){
                find = true;
                return count;
            }
            count++;
        }
       return -1;
   }

   

}