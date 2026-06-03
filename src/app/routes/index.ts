import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ActivityRoutes } from "../modules/activity/activity.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },

    {
        path: "/activity",
        route: ActivityRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
