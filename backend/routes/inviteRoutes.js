import express from 'express';
import { createInviteLink, acceptInvite, getProjectMembers } from '../controller/inviteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post("/projects/:id/invite", authMiddleware, isOwner, createInviteLink);
router.post("/invite/:token/accept", authMiddleware, acceptInvite);
router.get("/projects/:id/members", authMiddleware, getProjectMembers);

export default router;
