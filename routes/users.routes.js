import express from 'express';
import {
    createDefaultsUsers,
    createEditUser,
    getAllUser,
    signIn,
    signUp
} from '../controllers/user.controller.js';

const usersRouter = express.Router();

usersRouter.get("/getall", getAllUser);
usersRouter.post("/createEdit", createEditUser);
usersRouter.post("/signin", signIn);
usersRouter.post("/signUp", signUp);
usersRouter.post("/initDefault", createDefaultsUsers);

export default usersRouter;