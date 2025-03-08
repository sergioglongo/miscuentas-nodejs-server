import express from 'express';
import { createEditCategory, getAllCategories, getAllCategoriesBody, getCategoriesByAreaId, getCategoryById } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

categoryRouter.get("/getAll", getAllCategories);
categoryRouter.post("/getAllBody", getAllCategoriesBody);
categoryRouter.get("/getCategoriesByAreaId/:areaId", getCategoriesByAreaId);
categoryRouter.get("/getById/:id", getCategoryById);
categoryRouter.post("/createEdit", createEditCategory);


export default categoryRouter;
