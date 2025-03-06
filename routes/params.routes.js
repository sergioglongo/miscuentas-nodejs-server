import express from 'express';
import { createAccountsPayMethodsForUnit, createAreasCategoriesForUnit, createDefaults, getAllDefaults } from '../controllers/params.controller.js';

const paramsRouter = express.Router();

paramsRouter.post("/initialize", createDefaults);
paramsRouter.get("/getAllDefaultsList", getAllDefaults);
paramsRouter.post("/createAreasCategoriesForUnit", createAreasCategoriesForUnit);
paramsRouter.post("/createAccountsPayMethodsForUnit", createAccountsPayMethodsForUnit);

export default paramsRouter;