import AccountModel from "../models/account.model.js";
import PayMethodModel from "../models/payMethod.model.js";

export const payMethodCreateEditService = async ({
    id,
    name,
    method,
    type,
    excluded,
    is_active,
    default: is_default,
    deleted,
    accountId,
}) => {
    let payMethod = new PayMethodModel();
    try {
        const account = await AccountModel.findByPk(accountId);

        if (!account) {
            throw new Error("Cuenta no encontrada");
        }
        if (id) {
            payMethod = await PayMethodModel.findByPk(id);
            payMethod.name = name?.trim() ?? payMethod?.name;
            payMethod.method = method ?? payMethod?.method;
            payMethod.is_active = is_active ?? payMethod?.is_active ?? true;
            payMethod.type = type || payMethod?.type || 'in';
            payMethod.deleted = deleted ?? payMethod?.deleted ?? false;
            payMethod.default = is_default ?? payMethod?.default ?? false;
            payMethod.accountId = accountId || payMethod?.accountId;
        } else {
            payMethod.name = name.trim();
            payMethod.method = method || 'cash';
            payMethod.type = type || 'in';
            payMethod.excluded = excluded ?? false;
            payMethod.deleted = deleted || false;
            payMethod.is_active = is_active ?? true;
            payMethod.default = is_default ?? false;
            payMethod.accountId = accountId;
        }
        let payMethodSaved = await payMethod.save()
            .catch((error) => {
                throw error;
            });
        return payMethodSaved;
    } catch (error) {
        console.log("Error al crear el metodo de pago en catch de payMethodCreateEditService", error);
        
        throw new Error("Error al crear el metodo de pago", error);
    }
}