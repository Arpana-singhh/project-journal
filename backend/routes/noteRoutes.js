import express from 'express';
import { createNote, getNotesList, updateNote, deleteNote } from '../controller/noteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/meetings/:meetingId/notes", authMiddleware, createNote);
router.get("/meetings/:meetingId/notes", authMiddleware, getNotesList);
router.put("/notes/:noteId", authMiddleware, updateNote);
router.delete("/notes/:noteId", authMiddleware, deleteNote);

export default router;
