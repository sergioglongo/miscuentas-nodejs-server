import AccountModel from "../models/account.model.js";
import { accountCreateEditService, adjustAccountBalance } from "../services/account.service.js";
import UnitModel from "../models/unit.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import { Op } from "sequelize";

export const getAllAccounts = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await AccountModel.findAll({ where });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAllAccountsByUnitId = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const { is_active } = req.body;
        const where = is_active !== undefined ? { is_active } : null;
        const lista = await AccountModel.findAll({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: ['name', 'description', 'photo'],
                    where: { id: unitId }
                },
                {
                    model: PayMethodModel,
                    required: false,
                    attributes: ['id', 'name', 'method', 'type'],
                    where: { deleted: false }
                },
            ],
            where
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

export const getAllAccountsForTransfer = async (req, res) => {
    try {
        const { is_active, unitId } = req.body;
        // const where = is_active !== undefined ? { is_active } : null;
        const where = {
            ...(is_active !== undefined && { is_active }),
            ...unitId && { unitId },
            // ...deleted && { deleted }
        };
        const listIn = await AccountModel.findAll({
            include: [
                {
                    model: PayMethodModel,
                    required: true,
                    attributes: [],
                    where: { 
                        deleted: false,
                        is_active: true,
                        type: 'in',
                        [Op.or]: [
                            { method: 'transfer' },
                            { method: 'cash' },
                          ]
                     }
                },
            ],
            where,
        });
        const listOut = await AccountModel.findAll({
            include: [
                {
                    model: PayMethodModel,
                    required: true,
                    attributes: [],
                    where: { 
                        deleted: false,
                        is_active: true,
                        type: 'out',
                        [Op.or]: [
                            { method: 'transfer' },
                            { method: 'cash' },
                            
                          ],
                          
                     }
                },
            ],
            where,
        });
        res.status(200).send({
            success: true,
            result: {
                listIn,
                listOut,
                listInCount: listIn?.length || 0,
                listOutCount: listOut?.length || 0
            }
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await AccountModel.findByPk(id, {
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: ['name', 'description', 'photo'],
                },
                {
                    model: PayMethodModel,
                    required: false,
                    attributes: ['id', 'name', 'method', 'type'],
                    where: { deleted: false }
                }
            ],
        });
        if (account) {
            res.status(200).send({
                success: true,
                result: account,
                message: 'Cuenta obtenida con exito',
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Cuenta no encontrada',
            });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function createEditAccount(req, res, next) {
    let data = req.body;
    try {
        let account = await accountCreateEditService(data);
        if (account) {
            return res.json({
                success: true,
                message: "Account created",
                account,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}

export async function adjustAccount(req, res, next) {
    let data = req.body;
    const { amount, type, accountId, description } = data;
    try {
        // let account = await accountCreateEditService(data);
        const account = await adjustAccountBalance(accountId, amount, description, type );
        if (account) {
            return res.json({
                success: true,
                message: "Account adjusted",
                account,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}