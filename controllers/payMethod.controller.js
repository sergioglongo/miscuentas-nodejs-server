import PayMethodModel from "../models/payMethod.model.js";
import { accountCreateEditService } from "../services/account.service.js";
import UnitModel from "../models/unit.model.js";
import AccountModel from "../models/account.model.js";
import { payMethodCreateEditService } from "../services/payMethod.service.js";

export const getAllPayMethods = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await PayMethodModel.findAll({ where });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAllPayMethodsByUnitIdDeprecated = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const type = req.params.type;
        const deleted = req.params.deleted;

        const where = {
            ...type && { type },
            ...deleted && { deleted }
        };

        const lista = await PayMethodModel.findAll({
            include: [
                {
                    model: AccountModel,
                    required: true,
                    attributes: ['name'],
                    where: { unitId }
                }
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
export const getAllPayMethodsByUnitId = async (req, res) => {
    try {
        let data = req.body;
        console.log("data que llega", data);

        const where = {
            ...(data.type && { type: data.type }),
            ...(data.deleted !== undefined && { deleted: data.deleted }),
            ...(data.is_active !== undefined && { is_active: data.is_active })
        };
        console.log("where", where);

        const lista = await PayMethodModel.findAll({
            include: [
                {
                    model: AccountModel,
                    required: true,
                    attributes: ['name'],
                    where: { unitId: data.unitId }
                }
            ],
            where,
            order: [['name', 'ASC']]
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
export const getPayMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await PayMethodModel.findByPk(id, { include: ['account'] });
        if (account) {
            res.status(200).send({
                success: true,
                result: account,
                message: 'Metodo obtenido con exito',
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Metodo no encontrado',
            });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function createEditPayMethod(req, res, next) {
    let data = req.body;
    try {
        let account = await payMethodCreateEditService(data);
        if (account) {
            return res.json({
                success: true,
                message: "Method created",
                account,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}

