import express from 'express';
import usersRouter from './users.routes.js';

const mainRoute = express.Router();

mainRoute.use("/users", usersRouter);

export default mainRoute;