import UnitModel from "../models/unit.model.js";

export const unitCreateEditService = async ({
    id,
    name,
    description,
    photo,
    is_premium,
    is_active,
    deleted,
}) => {
    let unit = new UnitModel();
    
    try {
        if(id) {
            unit = await UnitModel.findByPk(id);
            unit.name = name?.trim() ?? unit.name;
            unit.description = description?.trim() ?? unit.description;
            unit.photo = photo ?? unit.photo;
            unit.is_premium = is_premium ?? unit.is_premium;
            unit.last_change_date = new Date();
            unit.is_active = is_active ?? unit.is_active;
            unit.deleted = deleted ?? unit.deleted;
        } else {
            unit.name = name?.trim();
            unit.description = description?.trim() || null;
            unit.photo = photo || null;
            unit.is_premium = is_premium || false;
            unit.last_change_date = new Date();
            unit.is_active = is_active || true;
            unit.deleted = deleted || false;
        }
        await unit.save();
        return unit;
    } catch (error) {
        console.log("error creando la unidad", error);
        
        throw new Error("Error al crear la unidad", error);
    }
}