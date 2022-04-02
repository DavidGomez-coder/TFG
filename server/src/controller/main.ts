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

    app.get('/simRequest/RC', (req: Request, res: Response) => {

    });

    app.get('/', (req: Request, res: Response) => {
        console.log(`[SERVER]: welcome ${req.sessionID}`);
        res.redirect("http://localhost:3000")
    })

    
}