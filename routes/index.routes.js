import express from 'express';
import usersRouter from './users.routes.js';
import areaRouter from './area.routes.js';
import { createDefaults } from '../controllers/params.controller.js';
import unitsRouter from './unit.routes.js';

const mainRoute = express.Router();

mainRoute.use("/users", usersRouter);
mainRoute.use("/unit", unitsRouter);
mainRoute.use("/area", areaRouter);
mainRoute.get("/initialize",createDefaults);

export default mainRoute;