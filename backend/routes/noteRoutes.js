import express from 'express';
import { createNote } from '../controller/noteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/meetings/:meetingId/notes", authMiddleware, createNote);

export default router;
