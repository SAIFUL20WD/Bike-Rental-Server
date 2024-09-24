import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import loginValidationSchema from "./auth.validation";

const router = express.Router();

router.post("/signup", validateRequest(userValidations.createUserValidationSchema), AuthControllers.signUpUser);

router.post("/login", validateRequest(loginValidationSchema), AuthControllers.loginUser);

export const AuthRoutes = router;
