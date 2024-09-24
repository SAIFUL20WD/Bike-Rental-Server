import express from "express";
import auth from "../../middleware/auth";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/", auth(true), UserControllers.getAllUser);

router.get("/me", auth(false), UserControllers.getUser);

router.put("/me", auth(false), validateRequest(userValidations.updateUserValidationSchema), UserControllers.updateUser);

router.put("/:id", auth(true), UserControllers.updateUserById);

router.delete("/:id", auth(true), UserControllers.deleteUser);

export const UserRoutes = router;
