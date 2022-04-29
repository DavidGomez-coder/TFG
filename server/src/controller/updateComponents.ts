/**
 * @fileoverview Controlador para hacer update de los componentes de un circuito usando las querys de una ruta (GET)
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Application, NextFunction, Request, Response } from "express"

import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { ComponentsIds } from "../model/circuit/ComponentsIds";
import { ComponentFactory } from "../model/component.factory/ComponentFactory";
import { Capacitor } from "../model/component.items/Capacitor";
import { Cell } from "../model/component.items/Cell";
import { Component } from "../model/component.items/Component";
import { Inductor } from "../model/component.items/Inductor";
import { Resistor } from "../model/component.items/Resistor";
import { Switch } from "../model/component.items/Switch";




module.exports = (app: Application) => {

    // Este controlador hace un update de los componentes del circuito almacenado en la sesión con los
    // valores que se pasan como parámetro
    app.get('/circuit/update', (req: Request, res: Response) => {
        console.log(`[SERVER] : GET /update-circuit from ${req.sessionID}`);
        if (req.query.circuit == undefined){
            console.log(`[SERVER] : ERROR A circuit should be pass`);
            res.sendStatus(400);
        }
        let decoded: string = atob(<string>req.query.circuit)
        console.log("DECODED STRING: " + decoded)
        res.send(200)
    });

    
}


/**
 * Método que transforma una lista de componentes en formato JSON a una lista de objetos tipo Componente
 * @param {[]} jsonComponents Lista de componentes en formato JSON
 * @returns Devuelve una lista de objetos componentes
 */
 function toComponents (jsonComponents: []){
    let result: Component[] = []
    jsonComponents.forEach((val: any) => {
        if (val.type === "Resistor"){
            let resistor: Resistor = new Resistor(ComponentsIds.RESISTOR_ID, 0, "*");
            resistor.setValue(val.value);
            resistor.setMultiplier(val.multiplier);
            resistor.setColorBands(val.colorBands);
            result.push(resistor);
        }else if (val.type === "Cell"){
            let cell: Cell = new Cell(ComponentsIds.CELL_ID, 0);
            cell.setValue(val.value);
            result.push(cell);
        }else if (val.type === "Switch") {
            let swi: Switch = new Switch(ComponentsIds.SWITCH_ID, 0);
            swi.setValue(val.value);
            result.push(swi);
        }else if (val.type === "Capacitor"){
            let capacitor: Capacitor = new Capacitor(ComponentsIds.CAPACITOR_ID, 0, "*");
            capacitor.setValue(val.value);
            capacitor.setMultiplier(val.multiplier)
            result.push(capacitor);
        }else if (val.type === "Inductor"){
            let inductor: Inductor = new Inductor(ComponentsIds.INDUCTOR_ID, 0, "*");
            inductor.setMultiplier(val.multiplier);
            inductor.setValue(val.value);
            result.push(inductor);
        }
    })
    return result;
}