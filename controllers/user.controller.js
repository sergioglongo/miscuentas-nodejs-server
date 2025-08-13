import { usersInitials } from "../config/initialData/user.init.js";
import AccountModel from "../models/account.model.js";
import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/category.model.js";
import TransactionModel from "../models/transaction.model.js";
import TransferModel from "../models/transfer.model.js";
import UsersModel from "../models/user.model.js";
import UserModel from "../models/user.model.js";
import Unit from "../models/unit.model.js";
import UserUnitModel from "../models/userUnit.model.js";
import { signService, userCreateEditService } from "../services/user.service.js";
import PayMethodModel from "../models/payMethod.model.js";
import { unitCreateEditService } from "../services/unit.service.js";
import { manageAccounts } from "../services/account.service.js";

export const getAllUser = async (req, res) => {
  try {
    const where = { ...req.query };
    const lista = await UserModel.findAll({ where });

    res.status(200).send({ success: true, result: lista, count: lista.length || 0 });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}
export const signIn = async (req, res, next) => {
  try {
    let userSignIn = await signService(req.body);
    if (userSignIn) {
      if( userSignIn.success){
        return res.status(200).json(userSignIn);
      } else {
        return res.status(400).json({
          success: false,
          message: "Datos incorrectos",
        })
      }
    }
  } catch (error) {
    let errorMessage = error.message;
    res.status(500).send({ success: false, message: errorMessage });
  }
}
export const signUp = async (req, res, next) => {
  const data = req.body;
  const unitName = req.body.name;
  try {
    console.log("Datos que llegan", data);
    
    const user = await userCreateEditService(data);
    if (!user) {
      throw new Error("Error creating user");
    }
    const dataWithUser = {
      name: unitName,
      userid: user.id,
      type: 'owner',
      permissions: { admin: true, user: true, guest: true },
      is_main_unit: true
    }
    const unit = await unitCreateEditService(dataWithUser);
    if (!unit) {
      throw new Error("Error creating unit");
    }

    return res.json({
      success: true,
      message: "User and unit created",
      user: user,
      unit: unit,
    });

  } catch (error) {
    console.log(error);
    let error_message = error.message;
    res.status(500).send({ success: false, message: error_message, error: error });
  }
}
export async function createEditUser(req, res, next) {
  let data = req.body;

  try {
    let user = await userCreateEditService(data);
    if (user) {
      return res.json({
        success: true,
        message: "User created",
        user,
      });
    }
  } catch (error) {
    console.log(error);

    let error_message = error.message;

    res.status(500).send({ success: false, message: error_message, error: error });
  }
}

export const createDefaultsUsers = async (req, res) => {
  try {
    let areas = await UsersModel.bulkCreate(usersInitials);

    res.status(200).send({
      success: true,
      result: areas,
      message: 'Usuarios por defecto insertados con exito'
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}