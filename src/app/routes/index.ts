import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ActivityRoutes } from "../modules/activity/activity.routes";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { TaskRoutes } from "../modules/task/task.routes";
import { ProjectRoutes } from "../modules/project/project.routes";

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
    {
        path: "/projects",
        route: ProjectRoutes,
    },
    {
        path: "/tasks",
        route: TaskRoutes,
    },
    {
        path: "/dashboard",
        route: DashboardRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
