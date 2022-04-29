
import { Application, NextFunction, Request, Response } from "express"


import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { RcSimulation } from "../model/simulations/RcSimulation";
import { RlSimulation } from "../model/simulations/RlSimulation";





module.exports = (app: Application) => {


    app.get('/', (req: Request, res: Response) => {
        console.log(`[SERVER]: Welcome ${req.session.id}`)
        console.log(req.session.simulationObject)
        req.session.simulationObject = undefined;
        req.session.save();
        res.sendStatus(200);
        
        //res.redirect("http://localhost:3000")
    })

    /**
     * Instancia el circuito como un circuito RC
     */
    app.get('/circuit/create/simpleRC', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /create/simpleRC from ${req.sessionID}`);
        let c: Circuit = <Circuit>CircuitFactory.createCircuit("RC");
        req.session.simulationObject = JSON.stringify(c);
        req.session.save();
        res.send(c);
    });

    /**
     * Instancia el circuito como un circuito RL
     */
    app.get('/circuit/create/simpleRL', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /circuit/create/simpleRL from ${req.sessionID}`);
        let c: Circuit = <Circuit>CircuitFactory.createCircuit("RL");
        req.session.simulationObject = JSON.stringify(c);
        req.session.save();
        res.send(c);
    })
    
}