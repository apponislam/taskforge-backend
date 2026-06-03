import { Router } from "express";
import { AuthControllers } from "./auth.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validations";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

router.post("/signup", validateRequest(AuthValidations.signupValidationSchema), AuthControllers.signup);

router.post("/login", validateRequest(AuthValidations.loginValidationSchema), AuthControllers.login);

router.get("/users", auth, AuthControllers.getAllUsers);

router.post("/seed-demo", AuthControllers.seedDemoUsers);

export const AuthRoutes = router;
