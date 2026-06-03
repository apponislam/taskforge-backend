import { Router } from "express";
import { DashboardControllers } from "./dashboard.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/stats", auth, DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
