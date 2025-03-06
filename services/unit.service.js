import UnitModel from "../models/unit.model.js";
import UserUnitModel from "../models/userUnit.model.js";

export const unitCreateEditService = async ({
    id,
    name,
    description,
    photo,
    is_premium,
    is_active,
    deleted,
    userid,
    permissions,
    is_main_unit,
    type,
}) => {
    let unit = new UnitModel();
    let unitsaved;
    console.log("data que llega antes de try", {id, name, description, photo, is_premium, is_active, deleted, userid, permissions, is_main_unit, type});
    
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
            unitsaved =await unit.save();
        } else {
            console.log("data que llega", {name, description, photo, is_premium, is_active, deleted, userid, permissions, is_main_unit, type});
            
            unit.name = name?.trim();
            unit.description = description?.trim() ?? '';
            unit.photo = photo || null;
            unit.is_premium = is_premium ?? false;
            unit.last_change_date = new Date();
            unit.is_active = is_active ?? true;
            unit.deleted = deleted ?? false;
            unitsaved =await unit.save();
            let userUnit = new UserUnitModel();
            userUnit.userId = userid;
            userUnit.type = type || 'guest';
            userUnit.unitId = unitsaved.id;
            userUnit.permissions = JSON.stringify(permissions) || JSON.stringify({owner: true, user: true, guest: true});
            userUnit.is_main_unit = is_main_unit ?? false;
            await userUnit.save();
        }
        return unitsaved;
    } catch (error) {
        console.log("error creando/editando unidad", error);
        
        throw new Error("Error creando/editando unidad", error);
    }
}