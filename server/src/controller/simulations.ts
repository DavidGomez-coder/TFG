
import { Application, NextFunction, Request, Response } from "express"


import { Circuit } from "../model/circuit/Circuit";
import { CircuitFactory } from "../model/circuit/CircuitFactory";
import { RcSimulation } from "../model/simulations/RcSimulation";
import { RlSimulation } from "../model/simulations/RlSimulation";





module.exports = (app: Application) => {
    /**
     * Devuelve los resultados de una simulación RC
     */
    app.get('/RC-sim-results', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /RC-sim-results from ${req.sessionID}`)
        try {
            let circuit: Circuit = new Circuit();
            if (<string>req.session.circuitSimulation == undefined){
                console.log(`[SERVER]: GET /RC-sim-results undefined circuit from ${req.sessionID}`);
                res.status(400); // bad request                
            }
            circuit.setComponents(JSON.parse(<string>req.session.circuitSimulation).components);
            let rcSim: RcSimulation = new RcSimulation(circuit);
            res.send(rcSim.getResults());
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
      app.get('/RL-sim-results', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /RL-sim-results from ${req.sessionID}`)
        try {
            let circuit: Circuit = new Circuit();
            if (<string>req.session.circuitSimulation == undefined){
                console.log(`[SERVER]: GET /RL-sim-results undefined circuit from ${req.sessionID}`);
                res.status(400); // bad request                
            }
            circuit.setComponents(JSON.parse(<string>req.session.circuitSimulation).components);
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