import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { Application, NextFunction, Request, Response } from "express"


//importamos el fichero que contiene las variables de entorno
dotenv.config();

//comporobar si existe las variables de entorno
if (!process.env.PORT || !process.env.SESSION_SECRET){
    process.exit(1);
}

const PORT : number = parseInt(process.env.PORT as string, 10);

const app : express.Application = express();


//middleware express-session
app.use(session({
    secret: <string>process.env.SESSION_SECRET,
    resave : true,
    saveUninitialized : true
}));

//controllers
require("./controller/main.ts")(app);
require("./controller/simulations.ts")(app);
require("./controller/updateComponents.ts")(app);

app.use(helmet());
app.use(cors());
app.use(express.json());








app.listen(PORT, () => {
    console.log(`[SERVER] : Started and listening at ${PORT}`);
})