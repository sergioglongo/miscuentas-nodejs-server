import sequelize from 'sequelize';
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";
import AreaModel from '../models/areas.model.js';
import moment from "moment";
import AccountModel from '../models/account.model.js';

export const getAllPaymentsByUnitId = async (unitId) => {
    try {
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

export const getAllIncomesByUnitId = async (unitId) => {

    try {
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
                    where: type == 'in'
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

export const PaymentsResumeByArea = async (unitId, initDate, endDate, type) => {

    try {
        const lista = await TransactionModel.findAll({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: [],
                    where: { id: unitId }
                },
                {
                    model: PayMethodModel,
                    required: true,
                    attributes: [],
                },
                {
                    model: CategoryModel,
                    as: 'category',
                    required: true,
                    attributes: ['id'],
                    include: [
                        {
                            model: AreaModel,
                            as: 'area',
                            required: true,
                            attributes: ['id', 'name', 'color', 'icon','type'],
                            where: type ? { type, unitId } : { unitId}
                            // group: ['name'],
                        }
                    ]
                }
            ],
            where: {
                date: {
                    [sequelize.Op.between]: [initDate || moment().startOf('month').toDate(), endDate || moment().toDate()]
                }
            },
            group: ['category.area.name'],
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'total_amount',],
                [sequelize.col('category.area.type'), 'type']
            ],
            order: [
                ['total_amount', 'DESC']
            ]
        });
        // console.log("lista de areas", lista);
        const listaIn = lista.filter(item => item.dataValues.type == 'in');
        const listaOut = lista.filter(item => item.dataValues.type == 'out');
        
        let totalIn = 0;
        listaIn.map((item) => totalIn += parseFloat(item.dataValues.total_amount));
        let totalOut = 0;
        listaOut.map((item) => totalOut += parseFloat(item.dataValues.total_amount));
        const total = {in: totalIn, out: totalOut};
        const reportIn = Object.values(listaIn);
        const reportOut = Object.values(listaOut);
        const listaReturn = {report : {in: {reportIn, total: totalIn}, out: {reportOut, total: totalOut}}, total};
        return listaReturn;
    } catch (error) {
        console.log("error", error);

        return error;
    }
}

export const AccountsResumeByUnitId = async (unitId) => {

    try {
        const lista = await AccountModel.findAll({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: [],
                    where: { id: unitId }
                },
            ],
            where: {
                is_active: true
            },
            // where: {
            //     date: {
            //         [sequelize.Op.between]: [initDate || moment().startOf('month').toDate(), endDate || moment().toDate()]
            //     }
            // },
            attributes: [
                'name', 'balance', 'type', 'id', 'currency'
            ]
            // group: ['category.area.name'],
            // attributes: [
            //     [sequelize.fn('sum', sequelize.col('amount')), 'total_amount',],
            // ]
        });

        return lista;
    } catch (error) {
        console.log("error", error);

        return error;
    }
}