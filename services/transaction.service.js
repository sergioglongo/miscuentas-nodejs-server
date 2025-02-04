import { Op } from "sequelize";
import AccountModel from "../models/account.model.js";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";
import AreaModel from "../models/areas.model.js";

export const transactionCreateEditService = async ({
    id,
    description,
    amount,
    discount,
    type,
    date,
    deleted,
    unitId,
    categoryId,
    payMethodId,
}) => {
    let transaction = new TransactionModel();
    console.log("data que llega", { description, amount, discount, type, date, deleted, unitId, categoryId, payMethodId, date });

    try {
        const unit = await UnitModel.findByPk(unitId);
        const category = await CategoryModel.findByPk(categoryId);
        const payMethod = await PayMethodModel.findByPk(payMethodId);
        const account = await AccountModel.findByPk(payMethod?.accountId);

        if (!unit) {
            console.log("Unidad no encontrada");
            throw new Error("Unidad no encontrada");
        }
        if (!category && categoryId !== null) {
            console.log("Categoria no encontrada");
            throw new Error("Categoria no encontrada");
        }
        if (!payMethod) {
            console.log("Metodo de pago no encontrado");
            throw new Error("Metodo de pago no encontrado");
        }
        if (!account) {
            console.log("Cuenta no encontrada");
            throw new Error("Cuenta no encontrada");
        }
        let newBalance = 0;
        let amountSigned = (type === 'in')
            ? parseFloat(amount) || 0
            : 0 - parseFloat(amount) || 0

        if (id) {
            transaction = await TransactionModel.findByPk(id);
            transaction.description = description?.trim() ?? transaction?.description;
            const amountOld = transaction?.amount
            let amountOldSigned = (transaction.type === 'in')
                ? parseFloat(transaction.amount) || 0
                : 0 - parseFloat(transaction.amount) || 0
            transaction.amount = amount ?? transaction?.amount;
            transaction.discount = discount ?? transaction?.discount;
            transaction.type = type || transaction?.type || 'in';
            transaction.date = new Date(date) || transaction?.date;
            transaction.deleted = deleted ?? transaction?.deleted ?? false;
            transaction.unitId = unitId || transaction?.unitId;
            const payMethodIdOld = transaction?.payMethodId
            transaction.payMethodId = payMethodId || transaction?.payMethodId;
            transaction.categoryId = categoryId || transaction?.categoryId;
            
            if (transaction.payMethodId === payMethodIdOld) {
                if (transaction.amount !== amountOld) {
                    newBalance = (account.balance ? parseFloat(account.balance) : 0) + amountSigned - amountOldSigned
                    account.update({ balance: newBalance });
                }
            } else {
                const payMethodOld = await PayMethodModel.findByPk(payMethodIdOld);
                const accountOld = await AccountModel.findByPk(payMethodOld?.accountId);
                newBalance = (account.balance ? parseFloat(account.balance) : 0) + amountSigned
                const newBalanceOld = (accountOld.balance ? parseFloat(accountOld.balance) : 0) - amountOldSigned
                account.update({ balance: newBalance });
                accountOld.update({ balance: newBalanceOld });
            }
        } else {
            if (transaction.type === 'out') {
                amountSigned = 0 - parseFloat(amount) || 0
            } else {
                amountSigned = parseFloat(amount) || 0
            }
            transaction.description = description.trim();
            transaction.amount = amount || 0;
            transaction.discount = discount || 0;
            transaction.type = type || 'out';
            transaction.date = new Date(date);
            transaction.deleted = false;
            transaction.unitId = unitId;
            transaction.categoryId = categoryId;
            transaction.payMethodId = payMethodId;
            newBalance = (account.balance ? parseFloat(account.balance) : 0) + amountSigned
            account.update({ balance: newBalance });
        }

        let transactionSaved = await transaction.save()
            .catch((error) => {
                throw error;
            });
        const transactionFull = {
            ...transactionSaved,
            unit: unit,
            category: category,
            payMethod: payMethod
        }
        return transactionFull;
    } catch (error) {
        console.log("error en transaccion", error);
        throw new Error("Error al crear la transaccion", error);
    }
}

export const TransactionsByUnitAndAccount = async({
    unitId,
    account,
    type,
    dateFrom,
    dateTo
}) => {
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
                    include: [
                        {
                            model: AccountModel,
                            required: true,
                            attributes: ['id', 'name', 'type'],
                            where: { id: account }
                        }
                    ],
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
                },
            ],
            where: {
                date: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            order: [
                ['date', 'DESC'] // o 'DESC' si lo deseas en orden descendente
            ],
        });

        return lista;
    } catch (error) {
        console.log("error al obtener transacciones", error);
        throw new Error("Error al obtener las transacciones", error);
    }
}