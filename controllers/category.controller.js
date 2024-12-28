import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";
import { categoryCreateEditService } from "../services/category.service.js";

export const getAllCatepories = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await CategoryModel.findAll({ where });

        res.status(200).send({
            success: true,
            result: lista,
            count: lista?.length || 0
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAllCateporiesByUnitId = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const lista = await CategoryModel.findAll({
            include: [
                {
                    model: AreaModel,
                    required: true,
                    attributes: ['name', 'type', 'color'],
                    where: { unitId }
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

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByPk(id, { include: ['area'] });
        if (category) {
            res.status(200).send({
                success: true,
                result: category,
                message: 'Category obtenida con exito',
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Category no encontrada',
            });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export async function createEditCategory(req, res, next) {
    let data = req.body;
    try {
        let category = await categoryCreateEditService(data);
        if (category) {
            return res.json({
                success: true,
                message: "Category created",
                category: category,
            });
        }
    } catch (error) {
        console.log(error);
        let error_message = error.message;

        res.status(500).send({ success: false, message: error_message, error: error });
    }
}

