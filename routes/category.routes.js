import express from 'express';
import { createEditCategory, getAllCatepories, getAllCateporiesByUnitId, getCategoryById } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

categoryRouter.get("/getAll", getAllCatepories);
categoryRouter.get("/getAllByUnitId/:unitId", getAllCateporiesByUnitId);
categoryRouter.get("/getAllByUnitId/:unitId/:type", getAllCateporiesByUnitId);
categoryRouter.get("/getById/:id", getCategoryById);
categoryRouter.post("/createEdit", createEditCategory);


export default categoryRouter;
