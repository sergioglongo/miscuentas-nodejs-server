import moment from "moment";
import AccountModel from "../models/account.model.js";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";

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
        if (!category) {
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
        let diference = 0;
        if (id) {
            transaction = await TransactionModel.findByPk(id);
            transaction.description = description?.trim() ?? transaction?.description;
            if(transaction.amount !== amount) {
                if(transaction.type === 'in') {
                    diference = 0 - transaction.amount
                } else {
                    diference = transaction.amount
                }
            }
            transaction.amount = amount ?? transaction?.amount;
            transaction.discount = discount ?? transaction?.discount;
            transaction.type = type || transaction?.type || 'in';
            transaction.date = date || transaction?.date;
            transaction.deleted = deleted || transaction?.deleted || false;
            transaction.unitId = unitId || transaction?.unitId;
            transaction.payMethodId = payMethodId || transaction?.payMethodId;
            transaction.categoryId = categoryId || transaction?.categoryId;
        } else {
            transaction.description = description.trim();
            transaction.amount = amount || 0;
            transaction.discount = discount || 0;
            transaction.type = type || 'out';
            transaction.date = date;
            transaction.deleted = false;
            transaction.unitId = unitId;
            transaction.categoryId = categoryId;
            transaction.payMethodId = payMethodId;
        }
        if (transaction.type === 'in') {
            newBalance = (account.balance ? parseFloat(account.balance) : 0) + (amount ? parseFloat(amount) : 0)
        } else {
            newBalance = (account.balance ? parseFloat(account.balance) : 0) - (amount ? parseFloat(amount) : 0)
        }
        account.update({ balance: newBalance + diference });
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