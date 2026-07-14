import express from 'express';
import { createProject, getProjectById, getAllProjects, updateProject, deleteProject } from '../controller/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post("/projects", authMiddleware, isOwner, createProject);
router.get("/projects", authMiddleware, getAllProjects);
router.get("/projects/:id", authMiddleware, getProjectById);
router.put("/projects/:id", authMiddleware, isOwner, updateProject);
router.delete("/projects/:id", authMiddleware, isOwner, deleteProject);

export default router;
