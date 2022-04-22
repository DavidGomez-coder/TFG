
import { Application, NextFunction, Request, Response } from "express"


import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { RcSimulation } from "../model/simulations/RcSimulation";
import { RlSimulation } from "../model/simulations/RlSimulation";





module.exports = (app: Application) => {


    app.get('/', (req: Request, res: Response) => {
        console.log(`[SERVER]: Welcome ${req.session.id}`)
        console.log(req.session.circuitSimulation)
        res.redirect('/clear-circuit');
        
        //res.redirect("http://localhost:3000")
    })

    /**
     * Instancia el circuito como un circuito RC
     */
    app.get('/create-simple-RC', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /create-simple-RC from ${req.sessionID}`);
        let c: Circuit = <Circuit>CircuitFactory.createCircuit("RC");
        req.session.circuitSimulation = JSON.stringify(c);
        res.send(c);
    });

    /**
     * Instancia el circuito como un circuito RL
     */
    app.get('/create-simple-RL', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /create-simple-RL from ${req.sessionID}`);
        let c: Circuit = <Circuit>CircuitFactory.createCircuit("RL");
        req.session.circuitSimulation = JSON.stringify(c);
        res.send(c);
    })

    /**
     * Limpia el circuito de la sesión
     */
    app.get('/clear-circuit', (req: Request, res: Response) => {
        req.session.circuitSimulation = undefined;
        res.sendStatus(200);
    })

    /**
     * Devuelve el circuito de la sessión actual
     */
    app.get('/circuit', (req: Request, res: Response) => {
        console.log(`[SERVER] : GET /circuit from ${req.sessionID}`);
        try {
            let circuit: Circuit = new Circuit()
            if (<string>req.session.circuitSimulation == undefined){
                console.log(`[SERVER]: GET /circuit undefined from ${req.sessionID}`);
                res.status(400); // bad request
            }
            circuit.setComponents(JSON.parse(<string>req.session.circuitSimulation).components);
            console.log(circuit.getComponents());
            res.send(circuit);
        }catch (e: any){
            if (e instanceof Error){
                console.log(`[SERVER]: ERROR > ${e.message}`);
            }
            res.sendStatus(400);
        }
        
    });



    
}