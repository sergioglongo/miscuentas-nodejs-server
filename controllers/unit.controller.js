import UnitModel from "../models/unit.model.js";
import UserModel from "../models/user.model.js";
import UserUnitModel from "../models/userUnit.model.js";
import { unitCreateEditService } from "../services/unit.service.js";

export const getAllUnits = async (req, res) => {
  try {
    const where = { ...req.query };
    const lista = await UnitModel.findAll({ where });

    res.status(200).send({
      success: true,
      result: lista,
      message: 'Unidades obtenidas con exito',
      count: lista?.length || 0
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

export async function getUnitById(req, res, next) {
  const unitId = req.params.id;
  try {
    const unit = await UnitModel.findByPk(unitId);

    res.status(200).send({
      success: true,
      result: unit,
      message: 'Unidade obtenida con exito',
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

export async function getUnitsByUserId(req, res, next) {
  const userId = req.params.id;
  try {
    const units = await UnitModel.findAll({
      include: [
        {
          model: UserModel, where: { id: userId },
        },
        
      ],
    });
    const userUnits = await UserUnitModel.findAll({
      where: { userId },
    })
    res.status(200).send({
      success: true,
      result: units,
      message: 'Unidades de usuario ' + userId + ' obtenidas con exito',
      count: units?.length || 0,
      userUnits
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

export async function createEditUnit(req, res, next) {
  let data = req.body;

  try {
    let unit = await unitCreateEditService(data);

    if (unit) {
      return res.json({
        success: true,
        message: "unit created",
        unit,
      });
    }
  } catch (error) {
    console.log(error);

    let error_message = error.message;

    res.status(500).send({ success: false, message: error_message, error: error });
  }
}