import express from 'express';
import { createMeeting, getMeetingsList, updateMeeting, deleteMeeting } from '../controller/meetingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/projects/:projectId/meetings", authMiddleware, createMeeting);
router.get("/projects/:projectId/meetings", authMiddleware, getMeetingsList);
router.put("/meetings/:meetingId", authMiddleware, updateMeeting);
router.delete("/meetings/:meetingId", authMiddleware, deleteMeeting);

export default router;
