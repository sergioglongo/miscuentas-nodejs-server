import AreaModel from "../models/areas.model.js";

export const areaCreateEditService = async ({
    id,
    name,
    description,
    color,
    icon,
    type,
    is_active,
    deleted,
    default: is_default,
    unitId,
}) => {
    let area = new AreaModel();

    try {
        if(id){
            area= await AreaModel.findByPk(id);
            area.name = name.trim() ?? area.name;
            area.description = description.trim() ?? area.description;
            area.color = color ?? area.color;
            area.icon = icon ?? area.icon;
            area.type = type ?? area.type;
            area.is_active = is_active ?? area.is_active;
            area.deleted = deleted ?? area.deleted;
            area.default = is_default ?? area.default;
            area.unitId = unitId;
        } else {
            area.name = name.trim();
            area.description = description.trim() || null;
            area.color = color || null;
            area.icon = icon || null;
            area.type = type || 'in';
            area.deleted = deleted ?? false;
            area.default = is_default ?? false;
            area.unitId = unitId;
        }
        await area.save();
        return area;
    } catch (error) {
        console.log("error creando/editando area", error);
        throw new Error("Error al crear/editar area");
    }
}

export const areaDefaultsCreateService = async () => {
    
}
// Inserta datos por defecto en la tabla de usuarios