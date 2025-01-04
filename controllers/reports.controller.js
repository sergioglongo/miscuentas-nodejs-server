import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";
import { AccountsResumeByUnitId, PaymentsByArea } from "../services/reports.service.js";

export const getAllPayments = async (req, res) => {
    try {
        const lista = await TransactionModel.findAll({
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
                    where: {type: 'out'}
                },
                {
                    model: CategoryModel,
                    required: true,
                    attributes: ['name'],
                }
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
export const getAllIncomes = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await TransactionModel.findAll({
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
                    where: {type: 'in'}
                },
                {
                    model: CategoryModel,
                    required: true,
                    attributes: ['name'],
                }
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

export const reportAreasResumeByUnitId = async (req, res) => {
    const {unitId, startDate, endDate, type} = req.body;
    try {
        const report = await PaymentsByArea(unitId, startDate, endDate, type);
        res.status(200).send({
            success: true, 
            result: report
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const reportAccountsResumeByUnitId = async (req, res) => {
    const {unitId, startDate, endDate} = req.body;
    try {
        const report = await AccountsResumeByUnitId(unitId, startDate, endDate);
        res.status(200).send({
            success: true, 
            result: report
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}