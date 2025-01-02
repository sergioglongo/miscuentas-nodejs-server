import express from 'express';
import { createEditArea, getAllAreas, getAllAreasByUnitId, getAreaById } from '../controllers/area.controller.js';

const areaRouter = express.Router();

areaRouter.get("/getAll", getAllAreas);
areaRouter.get("/getAllByUnitId/:unitId", getAllAreasByUnitId);
areaRouter.get("/getAllByUnitId/:unitId/:type", getAllAreasByUnitId);
areaRouter.get("/getById/:id", getAreaById);
areaRouter.post("/createEdit", createEditArea);

export default areaRouter;