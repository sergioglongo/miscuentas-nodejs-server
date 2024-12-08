import { areasInitials } from "../config/initialData/area.init.js";
import AreaModel from "../models/areas.model.js";
import { areaCreateService, areaDefaultsCreateService } from "../services/area.service.js";

export const getAllAreas = async (req, res) => {
  try {
    const where = { ...req.query };
    const lista = await AreaModel.findAll({ where });

    res.status(200).send({
      success: true,
      result: lista,
      count: lista?.length || 0
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

export async function createArea(req, res, next) {
  let data = req.body;

  try {
    //   let area = await userCreateService(data);
    let area = await areaCreateService(data);

    if (area) {
      return res.json({
        success: true,
        message: "Area created",
        area: area,
      });
    }
  } catch (error) {
    console.log(error);

    let error_message = error.message;

    res.status(500).send({ success: false, message: error_message, error: error });
  }
}

export const createDefaultsAreas = async (req, res) => {
  try {
    let areas = await AreaModel.bulkCreate(areasInitials);

    res.status(200).send({
      success: true,
      result: areas,
      message: 'Areas por defecto insertadas con exito'
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}