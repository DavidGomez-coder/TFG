import { Application, NextFunction, Request, Response } from "express"


import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { RcSimulation } from "../model/simulations/RcSimulation";
import { RlSimulation } from "../model/simulations/RlSimulation";



module.exports = (app: Application) => {
    app.get('/update', (req: Request, res: Response) => {
        let s: string = `RESISTOR: ${res.getHeader('resistor')}, CAPACITOR: ${res.getHeader('capacitor')}`
        res.send(req.headers);
    });


    
}