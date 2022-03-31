import { Console } from "console";
import { Application, NextFunction, Request, Response } from "express"
import { send } from "process";

import { json } from "stream/consumers";
import { Circuit } from "../model/circuit/Circuit";
import { ComponentsIds } from "../model/circuit/ComponentsIds";
import { ComponentFactory } from "../model/component.factory/ComponentFactory";
import { Component } from "../model/component.items/Component";
import { Resistor } from "../model/component.items/Resistor";
import { SecretGenerator } from "../utilities/SecretGenerator";




module.exports = (app: Application) => {

    app.get('/r', (req: Request, res: Response) => {
        let R: Resistor = ComponentFactory.createResistor("R0",2,"x1");
        let circuit: Circuit = new Circuit();
       let l = (JSON.parse(req.session.circuitSimulation))
        for (let i in l.components){
            let type: string = l.components[i].type;
            let id: string = l.components[i].id;
            let value: string = l.components[i].value;
            //REVISAR CIRCUIT FACTORY
            let cComponent: Component = new Component(l.components[i].type, l.components[i].id, l.components[i].value);
            if (type === ComponentsIds.RESISTOR_ID){
                cComponent = <Resistor>cComponent;
                
            }

            circuit.addComponent(cComponent);
        }
        circuit.updateComponent(R);

        //console.log(circuit)
        req.session.circuitSimulation = JSON.stringify(circuit);
        res.json(req.session.circuitSimulation);
    });

    app.get('/', (req: Request, res: Response) => {
        console.log("[SERVER] : BIENVENIDO");
        //JSON.stringfy(object)  --> objeto -> json
        //JSON.parse(jsonObject) --> json -> objecto
        let c = new Component("Cell", "C0", 12);
        let c2 = new Component("Resistor", "R0", 24);
        let cir : Circuit = new Circuit();
        cir.addComponent(c);
        cir.addComponent(c2);
        //req.session.circuit = cir.toJSON();
       // console.log("TO JSON: " + cir.toJSON());

        //console.log(req)
        //console.log(cirJ.C0);
        //res.send(Object.fromEntries(cir));
        //console.log(JSON.stringify(cir.getComponents()))
        //console.log(cir.getComponents());
        //console.log(JSON.stringify(cir));

       // let cr = JSON.parse(JSON.stringify(cir));
        //console.log(cr)
       // let cs: CircuitSimulation = <CircuitSimulation>SimulationFactory.createSimpleRcSim();
        req.session.circuitSimulation = JSON.stringify(cir);
        console.log(req.session.circuitSimulation);
        res.json(req.sessionID)
    })

    
}