import { categoriesInitials } from "../config/initialData/category.init.js";
import AccountModel from "../models/account.model.js";
import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";
import PayMethodModel from "../models/payMethod.model.js";
import { payMethodsInitials } from "../config/initialData/payMethods.init.js";
import { areasInitials } from "../config/initialData/area.init.js";
import { accountsInitials } from "../config/initialData/account.init.js";
import { Op } from "sequelize";

export const getAllDefaults = async (req, res) => {
    console.log("get all defaults");
    const where = { default: true, is_active: true };
    try {
        const accountDefaultsList = await AccountModel.findAll({ where });
        const areasDefaultsList = await AreaModel.findAll({ where });
        const categoriesDefaultsList = await CategoryModel.findAll(
            {
                where,
                include: [
                    {
                        model: AreaModel,
                        required: true,
                        attributes: ['id', 'name'],

                    }
                ]

            }
        );

        res.status(200).send({
            success: true,
            result: {
                accountDefaultsList,
                areasDefaultsList,
                categoriesDefaultsList
            },
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
export const createDefaults = async (req, res) => {
    const inizializatedArea = await AreaModel.findOne({
        where: {
            default: true
        }
    });
    const inizializatedAccount = await AccountModel.findOne({
        where: {
            default: true
        }
    });
    if (inizializatedArea && inizializatedAccount) {
        return res.status(400).send({ success: false, message: 'Valores por defecto ya fueron creados' });
    }
    try {
        const areasInitialsPromises = areasInitials.map(async (area) => {
            const areaCreated = await AreaModel.create(area);
            return areaCreated.dataValues;
        });
        const areasCreated = await Promise.all(areasInitialsPromises);
        const categoriesInitialsPromises = categoriesInitials.map(async (categorie) => {
            const areaFinded = await areasCreated?.find((area) => area.name === categorie.area);
            categorie.areaId = areaFinded?.id;
            const categoryCreated = await CategoryModel.create(categorie);
            return categoryCreated.dataValues;
        });
        const categoriesCreated = await Promise.all(categoriesInitialsPromises);

        const accountsInitialsPromises = accountsInitials.map(async (account) => {
            const accountCreated = await AccountModel.create(account);
            return accountCreated.dataValues;
        });
        const accountsCreated = await Promise.all(accountsInitialsPromises);
        const payMethodsInitialsPromises = payMethodsInitials.map(async (payMethod) => {
            const accountFinded = await accountsCreated?.find((account) => account.name === payMethod.account);
            payMethod.accountId = accountFinded?.id;
            const payMethodCreated = await PayMethodModel.create(payMethod);
            return payMethodCreated.dataValues;
        });
        const payMethodsCreated = await Promise.all(payMethodsInitialsPromises);

        // let accounts = await AccountModel.bulkCreate(accessSync);
        // let payMethods = await PayMethodModel.bulkCreate(payMethodsInitials);

        res.status(200).send({
            success: true,
            result: [
                { Areatotal: areasCreated.length },
                { categoriesTotal: categoriesCreated.length },
                { accountsTotal: accountsCreated.length },
                { payMethodsTotal: payMethodsCreated.length }
            ],
            message: 'Valores por defecto insertados con exito'
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const createAreasCategoriesForUnit = async (req, res) => {

    const unitId = req.body.unitId;
    const areasList = req.body.areasList || [];
    const categoriesList = req.body.categoriesList || [];
    const areasToCreate = await AreaModel.findAll(
        {
            where: {
                id: {
                    [Op.in]: areasList
                }
            }
        }
    );
    const categoriesToCreate = await CategoryModel.findAll(
        {
            where: {
                id: {
                    [Op.in]: categoriesList
                }
            }
        }
    );
    try {

        const areasToCreatePromises = areasToCreate.map(async (area) => {
            const areaUnit = { ...area?.dataValues, id: null, unitId: unitId, default: false };
            const areaCreated = await AreaModel.create(areaUnit);
            return areaCreated.dataValues;
        });
        const areasCreated = await Promise.all(areasToCreatePromises);
        const categoriesToCreatePromises = categoriesToCreate.map(async (category) => {
            const areaCreatedFinded = areasToCreate?.find((area) => area?.dataValues?.id === category?.dataValues?.areaId);
            const areaToSave = await areasCreated?.find((area) => area.name === areaCreatedFinded?.name);
            const areaId = areaToSave?.id;
            const categoryUnit = { ...category?.dataValues, id: null, unitId: unitId, default: false, areaId };
            const categoryCreated = await CategoryModel.create(categoryUnit);
            return categoryCreated.dataValues;
        })
        const categoriesCreated = await Promise.all(categoriesToCreatePromises);
        res.status(200).send({ success: true, result: { areasCreated, categoriesCreated }, message: 'Valores por defecto insertados con exito' });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}

export const createAccountsPayMethodsForUnit = async (req, res) => {

    const unitId = req.body.unitId;
    const accountsList = req.body.accountsList || [];
    // const payMethodsList = req.body.payMethodsList || [];
    const accountsToCreate = await AccountModel.findAll(
        {
            where: {
                id: {
                    [Op.in]: accountsList
                }
            },
            include: [
                {
                    model: PayMethodModel,
                    required: true,
                }
            ]
        }
    );

    try {
        const accountsToCreatePromises = accountsToCreate.map(async (account) => {
            const accountUnit = { ...account?.dataValues, id: null, unitId: unitId, default: false };
            const accountCreated = await AccountModel.create(accountUnit)
                .then(async (accountToPayMethodCreate) => {
                    const payMethodsCreatedPromises = account.pay_methods.map(async (payMethod) => {
                        const payMethodUnit = {
                            id: null,
                            name: payMethod?.dataValues?.name,
                            method: payMethod?.dataValues?.method,
                            type: payMethod?.dataValues?.type,
                            default: false,
                            is_active: true,
                            accountId: accountToPayMethodCreate.dataValues.id
                        };
                        const payMethodCreated = await PayMethodModel.create(payMethodUnit);
                        return payMethodCreated;
                    });
                    // console.log("payMethodsCreatedPromises", payMethodsCreatedPromises);
                    return await Promise.all(payMethodsCreatedPromises);
                })
            return accountCreated;
        });
        const accountsCreated = await Promise.all(accountsToCreatePromises);
        res.status(200).send({ success: true, result: {payMethodsCreated: accountsCreated }, message: 'Valores por defecto insertados con exito' });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}