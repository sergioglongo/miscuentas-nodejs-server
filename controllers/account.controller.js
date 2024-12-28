import AccountModel from "../models/account.model.js";
import { accountCreateEditService } from "../services/account.service.js";
import UnitModel from "../models/unit.model.js";

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
        const lista = await AccountModel.findAll({
            include: [
                {
                    model: UnitModel,
                    required: true,
                    attributes: ['name', 'description', 'photo'],
                    where: { id: unitId }
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

export const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await AccountModel.findByPk(id, { include: ['unit'] });
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

