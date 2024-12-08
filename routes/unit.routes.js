import express from 'express';
import { createEditUnit, getUnitById, getUnitsByUserId } from '../controllers/unit.controller.js';

const unitsRouter = express.Router();

unitsRouter.post("/createEdit", createEditUnit);
unitsRouter.get("/getUnitById/:id", getUnitById);
unitsRouter.get("/getUnitsByUserId/:id", getUnitsByUserId);

export default unitsRouter;