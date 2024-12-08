import express from 'express';
import { createArea, createDefaultsAreas, getAllAreas } from '../controllers/area.controller.js';

const areaRouter = express.Router();

areaRouter.get("/getall", getAllAreas);
areaRouter.post("/create", createArea);
areaRouter.get("/initDefault", createDefaultsAreas);

export default areaRouter;
