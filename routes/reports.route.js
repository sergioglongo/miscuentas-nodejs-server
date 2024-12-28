import express from 'express';
import { getAllIncomes, getAllPayments, reportAccountsResumeByUnitId, reportAreasResumeByUnitId } from '../controllers/reports.controller.js';

const reportsRouter = express.Router();

reportsRouter.get("/getAllPayments", getAllPayments);
reportsRouter.get("/getAllIncomes", getAllIncomes);
reportsRouter.post("/reportAreasResumeByUnitId", reportAreasResumeByUnitId);
reportsRouter.post("/reportAccountsResumeByUnitId", reportAccountsResumeByUnitId);


export default reportsRouter;