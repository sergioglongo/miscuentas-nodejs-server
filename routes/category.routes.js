import express from 'express';
import { createEditCategory, getAllCatepories, getAllCateporiesBody, getCategoriesByAreaId, getCategoryById } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

categoryRouter.get("/getAll", getAllCatepories);
categoryRouter.post("/getAllBody", getAllCateporiesBody);
categoryRouter.get("/getCategoriesByAreaId/:areaId", getCategoriesByAreaId);
categoryRouter.get("/getById/:id", getCategoryById);
categoryRouter.post("/createEdit", createEditCategory);


export default categoryRouter;
