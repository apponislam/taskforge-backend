import { Router } from "express";
import { ProjectControllers } from "./project.controllers";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

router.post("/", auth, authorize(["admin", "project_manager"]), ProjectControllers.createProject);
router.get("/", auth, ProjectControllers.getAllProjects);
router.get("/:id", auth, ProjectControllers.getProjectById);
router.patch("/:id", auth, authorize(["admin", "project_manager"]), ProjectControllers.updateProject);
router.delete("/:id", auth, authorize(["admin"]), ProjectControllers.deleteProject);
router.post("/:projectId/members/:memberId", auth, authorize(["admin", "project_manager"]), ProjectControllers.addTeamMember);
router.delete("/:projectId/members/:memberId", auth, authorize(["admin", "project_manager"]), ProjectControllers.removeTeamMember);

export const ProjectRoutes = router;
