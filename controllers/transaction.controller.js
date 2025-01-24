import PayMethodModel from "../models/payMethod.model.js";
import { accountCreateEditService } from "../services/account.service.js";
import UnitModel from "../models/unit.model.js";
import AccountModel from "../models/account.model.js";
import { payMethodCreateEditService } from "../services/payMethod.service.js";
import TransactionModel from "../models/transaction.model.js";
import { transactionCreateEditService, TransactionsByUnitAndAccount } from "../services/transaction.service.js";
import CategoryModel from "../models/category.model.js";
import AreaModel from "../models/areas.model.js";

export const getAllTransactions = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await TransactionModel.findAll({ where });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAllTransactionsByUnitId = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const type = req.params.type;
        const lista = await TransactionModel.findAll({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: ['name'],
                    where: { id: unitId }
                },
                {
                    model: PayMethodModel,
                    required: true,
                    attributes: ['name', 'method'],
                    where: type ? { type } : null
                },
                {
                    model: CategoryModel,
                    required: true,
                    attributes: ['name'],
                    include: [
                        {
                            model: AreaModel,
                            required: true,
                            attributes: ['id', 'name'],
                        }
                    ]
                }
            ],
            order: [
                ['date', 'DESC'] // o 'DESC' si lo deseas en orden descendente
            ],
        });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function getAllTransactionsByUnitAndAccount(req, res, next) {
    let data = req.body;
    console.log("data que llega", data);
    
    try {
        let transaction = await TransactionsByUnitAndAccount(data);
        let { account } = data;
        const accountData = await AccountModel.findByPk(account);
        if (transaction) {
            return res.json({
                success: true,
                message: "Get all Transactions by account",
                transaction,
                account: accountData
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}
export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await TransactionModel.findByPk(id, ({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: ['name'],
                },
                {
                    model: PayMethodModel,
                    required: true,
                    attributes: ['name', 'method'],
                },
                {
                    model: CategoryModel,
                    required: true,
                    attributes: ['name'],
                    include: [
                        {
                            model: AreaModel,
                            required: true,
                            attributes: ['id', 'name'],
                        }
                    ]
                }
            ],
            where: { id }

        })
        );
        if (transaction) {
            res.status(200).send({
                success: true,
                result: transaction,
                message: 'Transaccion obtenida con exito',
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Transaccion no encontrada',
            });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function createEditTransaction(req, res, next) {
    let data = req.body;
    try {
        let transaction = await transactionCreateEditService(data);
        if (transaction) {
            return res.json({
                success: true,
                message: "Transaction created",
                transaction,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}

