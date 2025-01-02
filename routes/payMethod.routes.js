import express from 'express';
import { createEditPayMethod, getAllPayMethods, getAllPayMethodsByUnitId, getPayMethodById } from '../controllers/payMethod.controller.js';

const payMethodRouter = express.Router();

payMethodRouter.get("/getAll", getAllPayMethods);
payMethodRouter.get("/getAllByUnitId/:unitId", getAllPayMethodsByUnitId);
payMethodRouter.get("/getAllByUnitId/:unitId/:type", getAllPayMethodsByUnitId);
payMethodRouter.get("/getById/:id", getPayMethodById);
payMethodRouter.post("/createEdit", createEditPayMethod);


export default payMethodRouter;
