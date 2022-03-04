import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

if (!process.env.PORT){
    process.exit(1);
}

const PORT : number = parseInt(process.env.PORT as string, 10);

const app : express.Application = express();

require("./controller/main.ts")(app);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`[SERVER] : Started and listening at ${PORT}`);
})