import AccountModel from "../models/account.model.js";
import UnitModel from "../models/unit.model.js";

export const accountCreateEditService = async ({
    id,
    name,
    balance,
    currency,
    type,
    is_active,
    default: is_default,
    deleted,
    unitId,
}) => {
    let account = new AccountModel();
    
    try {
        const unit = await UnitModel.findByPk(unitId);

        if (!unit) {
            throw new Error("Unidad no encontrada");
        }
        if (id) {
            account = await AccountModel.findByPk(id);
            account.name = name?.trim() ?? account?.name;
            account.balance = balance || account?.balance || 0;
            account.currency = currency || 'Pesos';
            account.type = type || 'cash';
            account.is_active = is_active !== undefined ? is_active : true;
            account.deleted = deleted !== undefined ? deleted : false;
            account.default = is_default !== undefined ? is_default : false;
            account.unitId = unitId;
            
        } else {
            account.name = name.trim();
            account.balance = balance || 0;
            account.currency = currency || 'Pesos';
            account.type = type || 'in';
            account.unitId = unitId;
        }
        let accountSaved = await account.save()
            .catch((error) => {
                throw error;
            });
        return accountSaved;
    } catch (error) {
        throw new Error("Error al crear el account", error);
    }
}