import mongoose from "mongoose";
import app from "./config/database.config";
import cron from "node-cron";
import dotenv from  'dotenv'
import path from 'path';
import {afterOneDayWipeServer} from "./controller/url.controller";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT;
const MONGO_URI = String(process.env.MONGOURL)

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Conectado ao MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

        cron.schedule('0 0 * * * *',async () => {
            console.log("Executando limpeza de URLs expiradas...");
            await afterOneDayWipeServer();
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar ao MongoDB:", error);
    });