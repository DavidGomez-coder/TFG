import { Console } from "console";
import { Application, NextFunction, Request, Response } from "express"
import { send } from "process";

import { json } from "stream/consumers";
import { Circuit } from "../model/circuit/Circuit";
import { Component } from "../model/component.items/Component";
import { SecretGenerator } from "../utilities/SecretGenerator";




module.exports = (app: Application) => {

    app.get('/', (req: Request, res: Response) => {
        console.log("[SERVER] : BIENVENIDO");
        //JSON.stringfy(object)  --> objeto -> json
        //JSON.parse(jsonObject) --> json -> objecto
        let c = new Component("Cell", "C0", 12);
        let c2 = new Component("Cell", "C1", 24);
        let cir : Circuit = new Circuit();
        //cir.addComponent(c);
        //cir.addComponent(c2);
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
        res.json(req.sessionID)
    })

    
}