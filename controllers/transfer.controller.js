import TransferModel from "../models/transfer.model.js";
import { transferCreateEditService } from "../services/transfer.service.js";

export const getAllTransfers = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await TransferModel.findAll({ where });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function createEditTransfer(req, res, next) {
    let data = req.body;
    try {
        let transfer = transferCreateEditService(data);
        if (transfer) {
            return res.json({
                success: true,
                message: "Transfer created",
                transfer,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}