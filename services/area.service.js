import AreaModel from "../models/areas.model.js";

export const areaCreateService = async ({
    name,
    description,
    color,
    icon,
    type,
    deleted,
    default: is_default,
}) => {
    const area = new AreaModel();

    try {
        area.name = name.trim();
        area.description = description.trim() || null;
        area.color = color || null;
        area.icon = icon || null;
        area.type = type || 'in';
        area.deleted = deleted || false;
        area.default = is_default || false;
        await area.save();
        return area;
    } catch (error) {
        throw new Error("Error al crear el area");
    }
}

export const areaDefaultsCreateService = async () => {
    
}
// Inserta datos por defecto en la tabla de usuarios