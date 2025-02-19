import express from 'express';
import { createEditTransaction, deleteTransactionById, getAllTransactions, getAllTransactionsBody, getAllTransactionsByUnitAndAccount, getAllTransactionsByUnitId, getTransactionById } from '../controllers/transaction.controller.js';

const transactionsRouter = express.Router();

transactionsRouter.get("/getAll", getAllTransactions);
transactionsRouter.post("/getAllBody", getAllTransactionsBody);
transactionsRouter.get("/getAllByUnitId/:unitId/:type", getAllTransactionsByUnitId);
transactionsRouter.post("/getAllByUnitAndAccount", getAllTransactionsByUnitAndAccount);
transactionsRouter.get("/getAllByUnitId/:unitId", getAllTransactionsByUnitId);
transactionsRouter.get("/getById/:id", getTransactionById);
transactionsRouter.post("/createEdit", createEditTransaction);
transactionsRouter.delete("/deleteById/:id", deleteTransactionById);


export default transactionsRouter;
