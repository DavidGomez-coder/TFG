
import { Application, NextFunction, query, Request, Response } from "express"
const fs = require('fs')



module.exports = (app: Application) => {


    app.get('/RCTheory', (req: Request, res: Response) => {
        console.log(`[SERVER]: GET /RCTheory ${req.session.id}`)

        fs.readFile("theory_files/RCTheory.teo", (err: Error, data: any) => {
            if (err) throw err;
            let sentData = {
                "file" : data.toString()
            }
            res.send(sentData)
        })
        
       // res.sendStatus(400); //bad request
        
    })
    
}