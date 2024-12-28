import express from 'express';
import { createEditTransaction, getAllTransactions, getAllTransactionsByUnitId, getTransactionById } from '../controllers/transaction.controller.js';

const transactionsRouter = express.Router();

transactionsRouter.get("/getAll", getAllTransactions);
transactionsRouter.get("/getAllByUnitId/:unitId/:type", getAllTransactionsByUnitId);
transactionsRouter.get("/getAllByUnitId/:unitId", getAllTransactionsByUnitId);
transactionsRouter.get("/getById/:id", getTransactionById);
transactionsRouter.post("/createEdit", createEditTransaction);


export default transactionsRouter;
