import express from 'express';
import db from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import mainRoute from './routes/index.routes.js';
import cors from 'cors';

//version 0.0.1
dotenv.config();
const baseURL = (process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.SERVER_PORT}` : `${process.env.SERVER_HOST}`) + '';

const app = express();
app.use(cors());
app.use(express.json());

async function database() {
    try {
        await db.sync({ force: true })
            .then(() => {
                console.log('La base de datos ha sido sincronizada');
            })
            .catch((error) => {
                console.error('Error al sincronizar la base de datos:', error);
            });
        console.log('Conectado a la base de datos en puerto', process.env.PORT);
    } catch (error) {
        console.log(error);
    }
}

try {
    app.listen({ port: process.env.PORT });
    database();
} catch (error) {
    console.log(error);
}

app.get("/", (req, res) => {
    res.send("This service is up and running...");
});

app.use("/api/", mainRoute);

app.use('/uploads', express.static(path.resolve("./uploads", 'uploads')));
// const __dirname = path.resolve();
// app.use('/media', express.static(path.join(__dirname, 'media_downloads')));