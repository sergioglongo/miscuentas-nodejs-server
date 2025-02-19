import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";

export const categoryCreateEditService = async ({
    id,
    name,
    description,
    color,
    icon,
    deleted,
    is_active,
    default: is_default,
    areaId,
}) => {
    let category = new CategoryModel();
    try {
        const area = await AreaModel.findByPk(areaId);

        if (!area) {
            throw new Error("Area no encontrada");
        }
        if (id) {
            category = await CategoryModel.findByPk(id);
            category.name = name?.trim() ?? category?.name;
            category.description = description?.trim() || category?.description || '';
            category.color = color ?? null;
            category.icon = icon ?? null;
            category.is_active = is_active ?? true;
            category.deleted = deleted ?? false;
            category.default = is_default ?? false;
            category.areaId = areaId;
        } else {
            category.name = name.trim();
            category.description = description?.trim() || '';
            category.color = color || null;
            category.icon = icon || null;
            category.areaId = areaId;
        }
        let category_saved = await category.save()
            .catch((error) => {
                throw error;
            });
        return category_saved;
    } catch (error) {
        throw new Error("Error al crear el category", error);
    }
}