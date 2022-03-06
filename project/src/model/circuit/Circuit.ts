/**
 * @fileoverview En este ficheor se implementa la clase circuito. Un circuito, se compone de una
 * lista de componenentes.
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { count } from "console";
import { Component } from "../component.items/Component";

export class Circuit {
   private components: Component[];

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
    * @param {Component []}components Nuevos componentes
    */
   setComponentes(components: Component[]){
       this.components = components;
   }

   /**
    * 
    * @param {number} id Identificador del componente a buscar 
    * @returns {number} Devuelte el índice del componente 
    */
   getComponentById(id: string): Component {
        //TODO 
   }

   getComponentByDefinition(component: Component): Component {
       let id = component.getId();
       return this.getComponentById(id);
   }

   addComponent(component: Component){
       this.components.push(component);
   }


   //private functions
   private getComponentPositionById(id: string): Component {
       //TO-DO
   }

   

}