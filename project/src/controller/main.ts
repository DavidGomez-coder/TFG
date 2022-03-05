import { Application, Request, Response } from "express"
import { json } from "stream/consumers";
import { Component } from "../model/component.items/Component";


module.exports = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        console.log("[SERVER] : BIENVENIDO");
        //JSON.stringfy(object)  --> objeto -> json
        //JSON.parse(jsonObject) --> json -> objecto
        let c = new Component("Cell", "C0", 12);
        let c2 = new Component("Cell", "C1", 24);
        

        console.log(JSON.stringify(c));

        let cr = JSON.parse(JSON.stringify(c));
        console.log(cr)
        res.sendStatus(200);
    });
}