import moment from "moment";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";
import { AccountsResumeByUnitId, PaymentsResumeByArea } from "../services/reports.service.js";

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
                    where: { type: 'out' }
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
                    where: { type: 'in' }
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
    const { unitId, startDate, endDate, type } = req.body;

    try {
        if (!unitId) throw new Error("UnitId es requerido");
        const result = await PaymentsResumeByArea(unitId, startDate, endDate, type);
        res.status(200).send({
            success: true,
            result: result.report,
            total: result.total
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
export const reportAreasdMonthToMonthByUnitId = async (req, res) => {
    const { unitId, type, cantMeses } = req.body;
    const meses = [];
    const fechaActual = moment();

    for (let i = 0; i < cantMeses; i++) {
        const fecha = fechaActual.clone().subtract(i, 'months');
        const mes = fecha.locale('es').format('MMMM');
        const numeroMes = fecha.format('M');
        const anio = fecha.format('YYYY');
        meses.push({
            startDate: fecha.startOf('month').toDate(),
            endDate: fecha.endOf('month').toDate(),
            mes,
            numeroMes,
            anio
        });
    }

    try {
        if (!unitId) throw new Error("UnitId es requerido");
        const report = await Promise.all(meses.map(async (mes) => {
            const paymentsResume = await PaymentsResumeByArea(unitId, mes.startDate, mes.endDate, type);
            paymentsResume.mes = mes.mes;
            paymentsResume.anio = mes.anio;
            return paymentsResume;
        }));

        res.status(200).send({
            success: true,
            result: report
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
export const reportAccountsResumeByUnitId = async (req, res) => {
    const { unitId } = req.body;
    try {
        if (!unitId) throw new Error("UnitId es requerido");
        const report = await AccountsResumeByUnitId(unitId);
        res.status(200).send({
            success: true,
            result: report
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

