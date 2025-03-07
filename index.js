import express from 'express';
import db from './db.js';
import dotenv from 'dotenv';
import mainRoute from './routes/index.routes.js';
import cors from 'cors';

//version 0.1.1
dotenv.config();
// try {
//     process.loadEnvFile();
// } catch (error) {
//     console.log('No .env file found, using environment variables');
// }

const app = express();
app.use(cors());
app.use(express.json());

async function database() {
    try {
        await db.sync({ force: false })
            .then(() => {
                console.log('Database synchronized successfully');
                console.log('Connected to database on port', process.env.PORT);
            })
            .catch((error) => {
                console.error('Database synchronization error:', error?.original || error);
                throw error; // Propagate the error
            });
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error; // Propagate the error to handle it in the main try-catch
    }
}

async function startServer() {
    try {
        await database(); // Wait for database initialization
        
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1); // Exit if we can't start the server or connect to the database
    }
}

app.get("/", (req, res) => {
    res.send("This service is up and running...");
});

app.use("/api/", mainRoute);

app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

startServer();

export default app;