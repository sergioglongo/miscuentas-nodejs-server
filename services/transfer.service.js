import { Op } from "sequelize";
import AccountModel from "../models/account.model.js";
import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransferModel from "../models/transfer.model.js";
import UnitModel from "../models/unit.model.js";
import { transactionCreateEditService } from "./transaction.service.js";

export const transferCreateEditService = async ({
    id,
    description,
    amount,
    date,
    deleted,
    accountOutId,
    accountInId,
}) => {
    let transfer = new TransferModel();
    console.log("data que llega a transfer", { description, amount, date, accountOutId, accountInId });

    try {
        const accountOut = await AccountModel.findByPk(accountOutId);
        const accountIn = await AccountModel.findByPk(accountInId);
        if (!accountOut || !accountIn) {
            console.log("Cuenta no encontrada");
            throw new Error("Cuenta no encontrada");
        }
        const payMethodOut = await PayMethodModel.findOne({ 
            where: { 
                accountId: accountOutId, 
                type: 'out',
                [Op.or]: [{ method: 'transfer' },{ method: 'cash' }]
            } });
        const payMethodIn = await PayMethodModel.findOne({ 
            where: { 
                accountId: accountInId, 
                type: 'in',
                [Op.or]: [{ method: 'transfer' },{ method: 'cash' }]
            } });
        // console.log("payMethodOut", payMethodOut, "payMethodIn", payMethodIn);

        if (!payMethodOut || !payMethodIn) {
            console.log("Metodo de pago de no encontrado", payMethodIn, payMethodOut);
            throw new Error("Metodo de pago no encontrado");
        }
        const categoryIn = await CategoryModel.findOne({
            where: { name: 'Transferencia' },
            include: [{
                model: AreaModel,
                required: true,
                attributes: ['id', 'name'],
                where: { type: 'in' },
                include: [{
                    model: UnitModel,
                    required: true,
                    attributes: ['name'],
                    where: { name: 'main', is_active: false }
                }]
            }]
        });
        const categoryOut = await CategoryModel.findOne({
            where: { name: 'Transferencia' },
            include: [{
                model: AreaModel,
                required: true,
                attributes: ['id', 'name'],
                where: { type: 'out' },
                include: [{
                    model: UnitModel,
                    required: true,
                    attributes: ['name'],
                    where: { name: 'main', is_active: false }
                }]
            }]
        });
        const transactionOutData = {
            description: `Transf. a cuenta ${accountIn.name}`,
            amount: amount || 0,
            date,
            type: 'out',
            categoryId: categoryOut?.dataValues?.id,
            unitId: accountOut.unitId,
            payMethodId: payMethodOut.id,
        }
        const transactionOut = await transactionCreateEditService(transactionOutData);

        const transactionInData = {
            description: `Transf. desde cuenta ${accountOut.name}`,
            amount: amount || 0,
            date,
            type: 'in',
            categoryId: categoryIn?.dataValues?.id,
            unitId: accountIn.unitId,
            payMethodId: payMethodIn.id,
        }
        const transactionIn = await transactionCreateEditService(transactionInData);

        if (!transactionOut || !transactionIn) {
            console.log("Transaccion no encontrada");
            throw new Error("Transaccion no encontrada");
        }

        transfer.description = description?.trim() || 'Transferencia entre cuentas';
        transfer.amount = amount || 0;
        transfer.date = date || new Date();
        transfer.deleted = false;
        transfer.unitId = accountIn.unitId;
        transfer.transactionInId = transactionOut.dataValues.id;
        transfer.transactionOutId = transactionIn.dataValues.id;


        let transferSaved = await transfer.save()
            .catch((error) => {
                throw error;
            });
        const transferFull = {
            ...transferSaved,
            transactionOut: transactionOut.dataValues,
            transactionIn: transactionIn.dataValues
        }
        // console.log("transferFull:", transferFull);
        return transferFull;
    } catch (error) {
        console.log("error en transferencia", error);
        throw new Error("Error al crear la transferencia", error);
    }
}