import { Sequelize } from "sequelize";
import AccountModel from "../models/account.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import UnitModel from "../models/unit.model.js";
import { translatePayMethod } from "../tools/translate.js";
import { payMethodCreateEditService } from "./payMethod.service.js";
import { transactionCreateEditService } from "./transaction.service.js";

export const accountCreateEditService = async ({
    id,
    name,
    balance,
    currency,
    type,
    is_active,
    default: is_default,
    deleted,
    unitId,
    pay_methods = [],
}) => {
    let account = new AccountModel();

    try {
        console.log("unidada que llega en crear cuenta", unitId);

        const unit = await UnitModel.findByPk(unitId);

        if (!unit) {
            throw new Error("Unidad no encontrada");
        }
        if (id) {
            account = await AccountModel.findByPk(id);
            account.name = name?.trim() ?? account?.name;
            account.balance = balance || account?.balance || 0;
            account.currency = currency || 'Pesos';
            account.type = type || 'cash';
            account.is_active = is_active ?? true;
            account.deleted = deleted ?? false;
            account.default = is_default ?? false;
            account.unitId = unitId;

        } else {
            account.name = name.trim();
            account.balance = balance || 0;
            account.currency = currency || 'Pesos';
            account.type = type || 'cash';
            account.unitId = unitId;
        }
        let accountSaved = await account.save()
            .catch((error) => {
                throw error;
            });

        await managePayMethods(accountSaved, pay_methods);

        return accountSaved;
    } catch (error) {
        throw new Error("Error al crear el account", error);
    }
}

const managePayMethods = async (account, pay_methods) => {
    try {
        const payMethodsInAccount = await PayMethodModel.findAll({
            where: {
                accountId: account.id,
                type: { [Sequelize.Op.and]: [{ [Sequelize.Op.ne]: 'adjustment' }, { [Sequelize.Op.ne]: 'cash' }] }
            },
            attributes: ['method', 'deleted', 'type'],
            group: ['method'],
            distinct: true
        });
        const payMethods = await Promise.all(payMethodsInAccount.map(async (payMethod) => {
            return payMethod.dataValues
        }))
        console.log("payMethodsInAccount", payMethods);
        console.log("pay_methods", pay_methods);
        //pay_methods = ["debit","credit"]
        //payMethods = [{"method":"debit","deleted":false,"type":"out"}
        //              {"method":"credit","deleted":false,"type":"out"}
        //              {"method":"transfer","deleted":true,"type":"out"}]
        pay_methods.map(async (payMethod) => {
            const payMethodExist = payMethods.find((payMethodInDb) => payMethodInDb.method === payMethod)
            if (!payMethodExist) {
                console.log("No esta en la db, asi que hay que crearlo", payMethod);
                await payMethodCreateEditService({
                    accountId: account.id,
                    name: `${account.name} ${translatePayMethod(payMethod)}`,
                    method: payMethod,
                    type: 'out',
                    deleted: false
                })
                    .catch((error) => {
                        console.log("Error al crear el metodo de pago", error);

                    })
                if (payMethod === 'other' || payMethod === 'transfer') {
                    await payMethodCreateEditService({
                        accountId: account.id,
                        name: `${account.name} ${translatePayMethod(payMethod)}`,
                        method: payMethod,
                        type: 'in',
                        deleted: false
                    })
                        .catch((error) => {
                            console.log("Error al crear el metodo de pago", error);

                        })
                }
            } else {
                if (payMethodExist.deleted) {
                    console.log("Esta en la db pero figura como eliminada, asi que hay que cambiar estado de delete a false tanto en in como en out si es debit o transfer, sino solo out", payMethodExist);
                    await PayMethodModel.update({
                        deleted: false
                    }, {
                        where: {
                            method: payMethod,
                            accountId: account.id
                        }
                    })
                        .catch((error) => {
                            console.log("Error al actualizar el metodo de pago a no borrado", error);
                        })
                } else {
                    console.log("Esta en la db, asi que no hay que crearlo", payMethodExist);
                }
            }

        })
        payMethods.forEach(async (payMethod) => {
            if (!pay_methods.includes(payMethod.method)) {
                if (payMethod.deleted) {
                    console.log("No esta en la lista pay_methods pero figura como eliminada, asi que no hay que hacer nada", payMethod);
                } else {
                    console.log("No esta en la lista de pay_methods pero si esta en la db, asi que hay que pasarla a deleted", payMethod);
                    await PayMethodModel.update({
                        deleted: true
                    }, {
                        where: {
                            method: payMethod.method,
                            accountId: account.id
                        }
                    })
                        .catch((error) => {
                            console.log("Error al actualizar el metodo de pago a borrado", error);
                        })
                }
            }
        })
        const adjustmentInAccount = await PayMethodModel.findOne({
            where: {
                accountId: account.id,
                type: 'adjustment'
            },
            attributes: ['method', 'deleted', 'type'],
        });
        if (!adjustmentInAccount) {
            await payMethodCreateEditService({
                accountId: account.id,
                name: `${account.name} Ajuste`,
                method: 'other',
                type: 'adjustment',
                // deleted: true
            })
                .catch((error) => {
                    console.log("Error al crear el metodo de pago", error);
                })
        }
    }
    catch (error) {
        throw new Error("Error al gestionar los metodos", error);
    }
}

export const manageAccounts = async (unit) => {
    try {
        const accountsInUser = await AccountModel.findOne({
            where: {
                unitId: unit.id,
                type: 'cash'
            },
            attributes: ['id', 'name', 'deleted', 'type'],
        });
        // const accounts = await Promise.all(accountsInUser.map(async (account) => {
        //     return account.dataValues
        // }))
        console.log("accountsInUser", !!accountsInUser);
        // console.log("accounts", accounts);
        if (!accountsInUser) {
            return await accountCreateEditService({
                name: `Efectivo`,
                unitId: unit.id
            })
                .then(async (account) => {
                    console.log("creada cuenta efectivo de unidad", unit.name, account.dataValues.id);
                    return await payMethodCreateEditService({
                        name: 'Efectivo',
                        type: 'in',
                        accountId: account?.dataValues?.id
                    })
                        .then(async (paymethodIn) => {
                            await payMethodCreateEditService({
                                name: 'Efectivo',
                                type: 'out',
                                accountId: account?.dataValues?.id
                            })
                                .then(async (paymethodOut) => {
                                    return { success: true, message: 'Cuenta efectivo creada', }
                                })
                        })
                })
                .catch((error) => {
                    console.log("Error al crear el metodo de pago", error);
                    throw new Error("Error al crear la cuenta efectivo", error);;
                })


        } else {
            return { success: false, message: 'Cuentas efectivo existente', }
        }
    }
    catch (error) {
        throw new Error({ success: false, message: "Error al gestionar las cuentas efectivo", error });
    }
}

export const adjustAccountBalance = async (accountId, amount, description, type) => {
    try {
        const account = await AccountModel.findByPk(accountId);
        return await PayMethodModel.findAll({
            where: {
                type: 'adjustment',
                method: 'other',
                accountId: accountId,
            }
        })
            .then(async (payMethod) => {
                if (payMethod[0].dataValues) {
                    let today = new Date();
                    today.setHours(0, 0, 0, 0);

                    return await transactionCreateEditService({
                        description: description ?? "Ajuste de cuenta " + account.name,
                        amount: Math.abs(parseFloat(amount)),
                        discount: 0,
                        type,
                        date: today,
                        unitId: account.unitId,
                        categoryId: null,
                        payMethodId: payMethod[0].dataValues.id
                    })
                        .catch((error) => {
                            console.log("Error al crear la transaccion", error);
                            throw error;
                        });
                } else {
                    console.log("payMethodAdjustment no trae", payMethod);
                    throw new Error("Error al obtener el metodo de pago para crear ajuste");
                }
            })
            .catch((error) => {
                console.log("Error al obtener el metodo de pago", error);
                throw error;
            })

    } catch (error) {
        throw new Error("Error al ajustar el balance", error);
    }
}