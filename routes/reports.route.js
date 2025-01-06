import express from 'express';
import { getAllIncomes, getAllPayments, reportAccountsResumeByUnitId, reportAreasdMonthToMonthByUnitId, reportAreasResumeByUnitId } from '../controllers/reports.controller.js';

const reportsRouter = express.Router();

reportsRouter.get("/getAllPayments", getAllPayments);
reportsRouter.get("/getAllIncomes", getAllIncomes);
reportsRouter.post("/reportAreasResumeByUnitId", reportAreasResumeByUnitId);
reportsRouter.post("/reportAreasMonthToMonthByUnitId", reportAreasdMonthToMonthByUnitId);
reportsRouter.post("/reportAccountsResumeByUnitId", reportAccountsResumeByUnitId);


export default reportsRouter;