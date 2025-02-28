import { Op } from "sequelize";
import AccountModel from "../models/account.model.js";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import TransactionModel from "../models/transaction.model.js";
import UnitModel from "../models/unit.model.js";
import AreaModel from "../models/areas.model.js";
import moment from "moment";

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
    console.log("data que llega a transaction CreateEditService", { description, amount, discount, type, date, deleted, unitId, categoryId, payMethodId, date });

    try {
        const unit = await UnitModel.findByPk(unitId);
        const category = await CategoryModel.findByPk(categoryId) || null;
        const payMethod = await PayMethodModel.findByPk(payMethodId);
        const account = await AccountModel.findByPk(payMethod?.accountId);

        if (!unit) {
            console.log("Unidad no encontrada");
            throw new Error("Unidad no encontrada");
        }
        if (!category && categoryId) {
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
            transaction.categoryId = categoryId || transaction?.categoryId || null;

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
            if (type === 'out') {
                amountSigned = 0 - parseFloat(amount) || 0
            } else {
                amountSigned = parseFloat(amount) || 0
            }
            transaction.description = description?.trim();
            transaction.amount = amount || 0;
            transaction.discount = discount || 0;
            transaction.type = type || 'out';
            transaction.date = date ? new Date(date) : new Date();
            // transaction.date.setUTCHours(0, 0, 0, 0);
            transaction.deleted = false;
            transaction.unitId = unitId;
            transaction.categoryId = categoryId || null;
            transaction.payMethodId = payMethodId;
            newBalance = (account.balance ? parseFloat(account.balance) : 0) + amountSigned
            // console.log("transaction to save", transaction);
            // console.log("account balance parsefloat", parseFloat(account.balance), "amountsigned", amountSigned);
            // console.log("newBalance", newBalance);

            account.update({ balance: newBalance })
                .catch((error) => {
                    console.log("error al actualizar balance", error);

                })
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

export const TransactionsByUnitAndAccount = async ({
    unitId,
    account,
    type,
    dateFrom,
    dateTo
}) => {
    const dateFromHour = moment(dateFrom).startOf('day').subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const dateToHour = moment(dateTo).endOf('day').add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');

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
                    // required: true,
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
                    // [Op.between]: [dateFrom, dateTo]
                    [Op.between]: [dateFromHour || moment().startOf('month').toDate(), dateToHour || moment().toDate()]
                }
            },
            order: [
                ['date', 'ASC'] // o 'DESC' si lo deseas en orden descendente
            ],
        });

        return lista;
    } catch (error) {
        console.log("error al obtener transacciones", error);
        throw new Error("Error al obtener las transacciones", error);
    }
}

export const transactionDeleteService = async (id) => {
    try {
        let newBalance = 0;

        if (id) {
            const transactionFinded = await TransactionModel.findByPk(id);
            const payMethod = await PayMethodModel.findByPk(transactionFinded?.payMethodId);
            const account = await AccountModel.findByPk(payMethod?.accountId);

            let amountSigned = (transactionFinded.type === 'in')
                ? parseFloat(transactionFinded.amount) || 0
                : 0 - parseFloat(transactionFinded.amount) || 0
            newBalance = (account.balance ? parseFloat(account.balance) : 0) - amountSigned;
            account.update({ balance: newBalance });
            let transaction = await TransactionModel.destroy({ where: { id } });
            if (transaction) {
                return {
                    success: true,
                    message: "Transaction deleted",
                    transaction,
                }
            } else {
                throw new Error("Error al borrar la transaccion");
            }
        } else {
            throw new Error("Error al obtener la transaccion a borrar", error);
        }
    } catch (error) {
        console.log("error al eliminar transaccion", error);
        throw new Error("Error al eliminar la transaccion", error);
    }
}