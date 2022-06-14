
import { Application, NextFunction, Request, Response } from "express"
import { json } from "stream/consumers";


import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { ComponentsIds } from "../model/circuit/ComponentsIds";
import { Capacitor } from "../model/component.items/Capacitor";
import { Cell } from "../model/component.items/Cell";
import { Component } from "../model/component.items/Component";
import { Inductor } from "../model/component.items/Inductor";
import { Resistor } from "../model/component.items/Resistor";
import { Switch } from "../model/component.items/Switch";
import { RcSimulation } from "../model/simulations/RcSimulation";
import { RlSimulation } from "../model/simulations/RlSimulation";





module.exports = (app: Application) => {
    /**
     * Devuelve los resultados de una simulación RC
     */
    app.get('/circuit/sim/simpleRc', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /circuit/sim/simpleRc from ${req.sessionID}`)
        try {
            let circuit: Circuit = new Circuit();
            if (<string>req.query.circuit == undefined){
                console.log(`[SERVER] : GET /circuit/sim/simpleRc  circuit is undefined from ${req.sessionID}`);
                res.sendStatus(400);
            }

            if (<string>req.query.simulation_periods == undefined){
                console.log(`[SERVER] : GET /circuit/sim/simpleRc  simulation_periods is undefined from ${req.sessionID}`);
                res.sendStatus(400);
            }

            let jsonC = JSON.parse(atob(<string>req.query.circuit));

            circuit.setComponents(toComponents(jsonC.components));

            let cell: Cell = <Cell>circuit.getComponentById(ComponentsIds.CELL_ID);
            let capacitor: Capacitor = <Capacitor>circuit.getComponentById(ComponentsIds.CAPACITOR_ID);
            let resistor: Resistor = <Resistor>circuit.getComponentById(ComponentsIds.RESISTOR_ID);
            let swi: Switch = <Switch>circuit.getComponentById(ComponentsIds.SWITCH_ID);
            
            let rcSim: RcSimulation = new RcSimulation(circuit);
            rcSim.setSimulationPeriods(parseInt(<string>req.query.simulation_periods))
            let simulationResults = rcSim.getResults();
            let max_data = {
                "qmax" : (capacitor.getComponentValue()*cell.getComponentValue()),
                "emax" : ((1/2)*capacitor.getComponentValue()*Math.pow(cell.getComponentValue(),2)),
                "Vcmax": cell.getComponentValue() ,
                "imax" : (cell.getComponentValue() / resistor.getComponentValue()),
                "Vrmax" : cell.getComponentValue(),
                "RC_constant" : resistor.getComponentValue() * capacitor.getComponentValue(),
                "RC_time_markers" : rcSim.getSimulationTime() === 0 ? [] : getSimulationRCMarkers(rcSim.getSimulationTime(), capacitor.getComponentValue()*resistor.getComponentValue(), rcSim.getSimulationPeriods())
            }
            let result = {
                "limits" : max_data,
                "simulation" : simulationResults,
                "simulation_periods" : rcSim.getSimulationPeriods()
            }
            res.send(result);
        }catch (e: any){
            if (e instanceof Error){
                console.log(`[SERVER]: ERROR > ${e.message}`);
            }
            res.sendStatus(400);
        }
    });

     /**
     * Devuelve los resultados de una simulación RC
     */
      app.get('/circuit/sim/simpleRl', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /circuit/sim/simpleRl from ${req.sessionID}`)
        try {
            let circuit: Circuit = new Circuit();
            if (<string>req.query.circuit == undefined){
                console.log(`[SERVER] : GET /circuit/sim/simpleRc  circuit is undefined from ${req.sessionID}`);
                res.sendStatus(400);
            }
            
            let jsonC = JSON.parse(atob(<string>req.query.circuit));

            circuit.setComponents(toComponents(jsonC.components));
            let rlSim: RlSimulation = new RlSimulation(circuit);
            res.send(rlSim.getResults());
        }catch (e: any){
            if (e instanceof Error){
                console.log(`[SERVER]: ERROR > ${e.message}`);
            }
            res.sendStatus(400);
        }
    });  
}

function getSimulationRCMarkers (simulation_time: number, rc_value: number, simulation_periods: number) {
    let rc_times = simulation_time / rc_value;
    let time_markers = []
    let i: number = 1;
    while (i <= simulation_periods +1){
        time_markers.push(rc_value*i)
        i++;
    }

    return time_markers;
}

/**
 * Método que transforma una lista de componentes en formato JSON a una lista de objetos tipo Componente
 * @param {[]} jsonComponents Lista de componentes en formato JSON
 * @returns Devuelve una lista de objetos componentes
 */
 function toComponents (jsonComponents: []): Component[]{
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