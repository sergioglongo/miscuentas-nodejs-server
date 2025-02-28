import express from 'express';
import { createEditTransfer, getAllTransfers } from '../controllers/transfer.controller.js';

const transfersRouter = express.Router();

transfersRouter.get("/getAll", getAllTransfers);
// transfersRouter.get("/getById/:id", getTransactionById);
transfersRouter.post("/createEdit", createEditTransfer);
// transfersRouter.delete("/deleteById/:id", deleteTransactionById);


export default transfersRouter;