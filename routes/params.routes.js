import express from 'express';
import { createAreasCategoriesForUnit, createDefaults } from '../controllers/params.controller.js';

const paramsRouter = express.Router();

paramsRouter.post("/initialize", createDefaults);
paramsRouter.post("/createAreasCategoriesForUnit", createAreasCategoriesForUnit);

export default paramsRouter;