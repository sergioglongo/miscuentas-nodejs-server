import AccountEntity from "../models/accountEntities.model.js";
import AccountModel from "../models/accounts.model.js";
import AccountTypeModel from "../models/accountTypes.model.js";
import AreaModel from "../models/areas.model.js";
import CategoryModel from "../models/categories.model.js";
import TransactionModel from "../models/transactions.model.js";
import TransferModel from "../models/transfers.model.js";
import UserModel from "../models/users.model.js";
import UserGroupModel from "../models/usersGroup.model.js";
import UserUserGroupModel from "../models/userUserGroup.model.js";
import { userSignInByPasswordOrGoogle } from "../services/user.service.js";

export const getAllUser = async (req, res) => {
    try {
        const where = { ...req.query };
        const lista = await UserModel.findAll({ where });
        const cuentas = await AccountEntity.findAll();
        const types = await AccountTypeModel.findAll();
        const accounts = await AccountModel.findAll();
        const categories = await CategoryModel.findAll();
        const areas = await AreaModel.findAll();
        const transaction = await TransactionModel.findAll();
        const transfers = await TransferModel.findAll();
        const usergroups = await UserGroupModel.findAll();
        const userusergroup = await UserUserGroupModel.findAll();
        res.status(200).send(lista);

    } catch (error) {
        res.status(500).send({ error: error });
    }
}
export const signIn = async(req, res, next) => {
    try {
      let userSignIn = await userSignInByPasswordOrGoogle(req.body);
      if (userSignIn) {
        return res.status(200).json({
          message: "User logged",
          user: userSignIn,
        });
      } else {
        res.status(409).send({
          message: "User not found",
        });
      }
    } catch (error) {
      let errorMessage = error.message;
  
      res.status(500).send({ message: errorMessage, error: error });
    }
  }