import  {Router} from "express";
import { registerUser,loginUser,updateAccountDetails,forgotPassword,resetPassword,verifyResetToken} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";


const routes=Router();
routes.post("/register",registerUser);
routes.post("/login",loginUser);
routes.patch("/update",verifyJWT, updateAccountDetails);
routes.post("/forget-password",forgotPassword);
routes.get("/reset-password/:token", verifyResetToken);
routes.post("/reset-password/:token",resetPassword);


export  default routes;