import { Router } from "express";
import { TaskControllers } from "./task.controllers";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

router.post("/", auth, authorize(["admin", "project_manager"]), TaskControllers.createTask);
router.get("/", auth, TaskControllers.getAllTasks);
router.get("/:id", auth, TaskControllers.getTaskById);
router.patch("/:id", auth, TaskControllers.updateTask);
router.delete("/:id", auth, authorize(["admin", "project_manager"]), TaskControllers.deleteTask);
router.get("/workload/:memberId", auth, TaskControllers.getMemberWorkload);

export const TaskRoutes = router;
