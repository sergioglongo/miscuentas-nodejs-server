import AreaModel from "../models/areas.model";

// Inserta datos por defecto en la tabla de usuarios
AreaModel.bulkCreate([
  { name: 'Mercado', description: 'Tiendas de compras de productos de consumo, comestibles, limpieza, etc' },
  { name: 'Transporte', description: 'Gastos en transporte' },
  { name: 'Salud', description: 'Visitas medicas, gastos en medicamentos, etc' },
  { name: 'Entretenimiento', description: 'Exparcimiento, paseos, cine, etc' },
  { name: 'Educacion', description: 'Colegio, Universidad, Cursos, etc' },
  { name: 'Viaje', description: 'Viajes, pasajes, hospedaje, etc' },
  { name: 'Vestimenta', description: 'Ropa, calzado, accesorios, etc' },
]).then(() => {
  console.log('Datos de areas por defecto insertados con éxito');
});