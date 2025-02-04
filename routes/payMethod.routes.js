import express from 'express';
import { createEditPayMethod, getAllPayMethods, getAllPayMethodsByUnitId, getAllPayMethodsByUnitIdDeprecated, getPayMethodById } from '../controllers/payMethod.controller.js';

const payMethodRouter = express.Router();

payMethodRouter.get("/getAll", getAllPayMethods);
payMethodRouter.post("/getAllByUnitId", getAllPayMethodsByUnitId);
payMethodRouter.get("/getAllByUnitId/:unitId", getAllPayMethodsByUnitIdDeprecated);
payMethodRouter.get("/getAllByUnitId/:unitId/:type", getAllPayMethodsByUnitIdDeprecated);
payMethodRouter.get("/getAllByUnitId/:unitId/:type/:deleted", getAllPayMethodsByUnitIdDeprecated);
payMethodRouter.get("/getById/:id", getPayMethodById);
payMethodRouter.post("/createEdit", createEditPayMethod);


export default payMethodRouter;
