import express from 'express';
import { getAllUser } from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.get("/getall", getAllUser);

export default usersRouter;