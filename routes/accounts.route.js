import express from 'express';
import { adjustAccount, createEditAccount, getAccountById, getAllAccounts, getAllAccountsByUnitId } from '../controllers/account.controller.js';

const accountRouter = express.Router();

accountRouter.get("/getAll", getAllAccounts);
accountRouter.get("/getAllByUnitId/:unitId", getAllAccountsByUnitId);
accountRouter.post("/getAllByUnitId/:unitId", getAllAccountsByUnitId);
accountRouter.get("/getById/:id", getAccountById);
accountRouter.post("/createEdit", createEditAccount);
accountRouter.post("/adjustBalance", adjustAccount);


export default accountRouter;
