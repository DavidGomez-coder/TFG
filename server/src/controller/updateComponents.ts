/**
 * @fileoverview Controlador para hacer update de los componentes de un circuito usando las querys de una ruta (GET)
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Application, NextFunction, Request, Response } from "express"

import { Circuit } from "../model/circuit/Circuit";
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
        try {
            let circuit: Circuit = new Circuit();
            if (<string>req.session.simulationObject == undefined){
                console.log(`[SERVER] : GET /update-circuit undefined from ${req.sessionID}`);
                res.sendStatus(400);
            }
            circuit.setComponents(toComponents(JSON.parse(<string>req.session.simulationObject).components));

            // UPDATE RESISTOR ?
            if (req.query.resistor_value != undefined){
                let multiplier: string = "";
                if (req.query.resistor_multiplier != undefined){
                    multiplier = <string>req.query.resistor_multiplier;
                }else{
                    multiplier = <string>(<Resistor>circuit.getComponentById(ComponentsIds.RESISTOR_ID))?.getMultiplier();
                }
                let resistor: Resistor = ComponentFactory.createResistor(ComponentsIds.RESISTOR_ID, parseFloat(<string>req.query.resistor_value), multiplier);
                circuit.updateComponent(resistor);
            }

            // UPDATE CAPACITOR ?
            if (req.query.capacitor_value != undefined){
                let multiplier: string = "";
                if (req.query.capacitor_multiplier != undefined){
                    multiplier = <string>req.query.capacitor_multiplier;
                }else {
                    multiplier = <string>(<Capacitor>circuit.getComponentById(ComponentsIds.CAPACITOR_ID))?.getMultiplier();
                }
                let capacitor: Capacitor = ComponentFactory.createCapacitor(ComponentsIds.CAPACITOR_ID, parseFloat(<string>req.query.capacitor_value), multiplier);
                circuit.updateComponent(capacitor);
            }

            // UPDATE INDUCTOR ?
            if (req.query.inductor_value != undefined){
                let multiplier: string = "";
                if (req.query.inductor_multiplier != undefined){
                    multiplier = <string>req.query.inductor_multiplier;
                }else {
                    multiplier = <string>(<Inductor>circuit.getComponentById(ComponentsIds.INDUCTOR_ID))?.getMultiplier();
                }
                let inductor: Inductor = ComponentFactory.createInductor(ComponentsIds.INDUCTOR_ID, parseFloat(<string>req.query.inductor_value), multiplier);
                circuit.updateComponent(inductor);
            }

            // UPDATE CELL ?
            if (req.query.cell_value != undefined) {
                let multipler: string = "";
                if (req.query.cell_multiplier != undefined){
                    multipler = <string>req.query.cell_multiplier;
                }else {
                    multipler = <string>(<Cell>circuit.getComponentById(ComponentsIds.CELL_ID))?.getMultiplier();;
                }
                let cell: Cell = ComponentFactory.createCell(ComponentsIds.CELL_ID, parseFloat(<string>req.query.cell_value));
                cell.setMultiplier(multipler);
                circuit.updateComponent(cell);
            }

            // UPDATE SWITCH
            if (req.query.switch_value != undefined){
                let swi: Switch = <Switch>circuit.getComponentById(ComponentsIds.SWITCH_ID);
                swi.changeValue()
            }
            req.session.simulationObject = JSON.stringify(circuit); // actualizamos variable de sesión
            res.send(circuit)
        }catch (e: any){
            if (e instanceof Error){
                console.log(`[SERVER]: ERROR > ${e.message}`);
            }
            res.sendStatus(400);
        }
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