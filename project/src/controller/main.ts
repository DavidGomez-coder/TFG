import { Application, Request, Response } from "express"


module.exports = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        console.log("[SERVER] : BIENVENIDO");
        res.send("HOLA MUNDO");
    })
}