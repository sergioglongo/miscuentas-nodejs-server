import express from 'express';
import { createEditCategory, getAllCatepories, getAllCateporiesByUnitId, getCategoriesByAreaId, getCategoryById } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

categoryRouter.get("/getAll", getAllCatepories);
categoryRouter.get("/getAllByUnitId/:unitId", getAllCateporiesByUnitId);
categoryRouter.get("/getAllByUnitId/:unitId/:type", getAllCateporiesByUnitId);
categoryRouter.get("/getCategoriesByAreaId/:areaId", getCategoriesByAreaId);
categoryRouter.get("/getById/:id", getCategoryById);
categoryRouter.post("/createEdit", createEditCategory);


export default categoryRouter;
