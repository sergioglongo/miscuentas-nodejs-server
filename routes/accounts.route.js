import express from 'express';
import { createEditAccount, getAccountById, getAllAccounts, getAllAccountsByUnitId } from '../controllers/account.controller.js';

const accountRouter = express.Router();

accountRouter.get("/getAll", getAllAccounts);
accountRouter.get("/getAllByUnitId/:unitId", getAllAccountsByUnitId);
accountRouter.get("/getById/:id", getAccountById);
accountRouter.post("/createEdit", createEditAccount);


export default accountRouter;
