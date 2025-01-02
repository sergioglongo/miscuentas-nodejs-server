import { areasInitials } from "../config/initialData/area.init.js";
import AreaModel from "../models/areas.model.js";
import { areaCreateEditService, areaDefaultsCreateService } from "../services/area.service.js";

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
export const getAllAreasByUnitId = async (req, res) => {
  try {
   const unitId = req.params.unitId;
   const type = req.params.type;
   const where = type ? { type, unitId: parseInt(unitId) } : { unitId: parseInt(unitId) };
   
   const lista = await AreaModel.findAll({
     where
   });

    res.status(200).send({
      success: true,
      result: lista,
      count: lista?.length || 0
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}
export const getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await AreaModel.findByPk(id);
    if (area) {
      res.status(200).send({
        success: true,
        result: area,
        message: 'Area obtenida con exito',
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Area no encontrada',
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}
export async function createEditArea(req, res, next) {
  let data = req.body;

  try {
    //   let area = await userCreateService(data);
    let area = await areaCreateEditService(data);

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