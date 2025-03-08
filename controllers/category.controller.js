import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";
import { categoryCreateEditService } from "../services/category.service.js";

export const getAllCategories = async (req, res) => {
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

export const getAllCategoriesBody = async (req, res) => {
    try {
        const { type, unitId, is_active, deleted, areaId } = req.body;
        // const unitId = req.params.unitId;
        // const type = req.params.type;
        // const where = type ? { type, unitId: parseInt(unitId) } : { unitId: parseInt(unitId) };
       const where = {
           ...areaId && { id: parseInt(areaId) },
           ...(deleted !== undefined && { deleted }),
           ...(is_active !== undefined && { is_active })
        };
        const whereArea = {
            ...(unitId && { unitId: parseInt(unitId) }),
            ...(type && { type }),
        }

        const lista = await CategoryModel.findAll({
            where,
            include: [
                {
                    model: AreaModel,
                    required: true,
                    attributes: ['id', 'name', 'type', 'color'],
                    where: whereArea
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
export const getCategoriesByAreaId = async (req, res) => {
    try {
        const { areaId } = req.params;
        const categories = await CategoryModel.findAll({
            attributes: ['id', 'name', 'description', 'color', 'icon', 'is_active'],
            where: { areaId, deleted: false },
        });
        if (categories) {
            res.status(200).send({
                success: true,
                result: categories,
                message: 'Categorias obtenidas con exito',
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Categorias no encontradas',
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

