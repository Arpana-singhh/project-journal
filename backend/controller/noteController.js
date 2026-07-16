import meetingModel from '../models/meetingModel.js';
import projectMemberModel from '../models/projectMemberModel.js';
import projectModel from '../models/projectModel.js';
import noteModel from '../models/noteModel.js';
import userModel from '../models/userModel.js';

export const createNote = async (req, res) => {
    const { meetingId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ success: false, message: "Note content is required" });
    }

    try {
        const meeting = await meetingModel.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        const project = await projectModel.findById(meeting.projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const isOwner = project.ownerId.toString() === req.userId;
        const membership = isOwner
            ? null
            : await projectMemberModel.findOne({ projectId: project._id, memberId: req.userId });

        if (!isOwner && !membership) {
            return res.status(403).json({ success: false, message: "Access denied. You are not a member of this project" });
        }

        const note = await noteModel.create({
            meetingId: meeting._id,
            projectId: project._id,
            authorId: req.userId,
            content,
        });

        meeting.notesCount += 1;
        await meeting.save();

        const author = await userModel.findById(req.userId);

        return res.status(201).json({
            success: true,
            message: "Note added successfully",
                note,
        });
    }
    catch (error) {
        console.error("Create Note Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getNotesList = async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await meetingModel.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        const project = await projectModel.findById(meeting.projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const isOwner = project.ownerId.toString() === req.userId;
        const membership = isOwner
            ? null
            : await projectMemberModel.findOne({ projectId: project._id, memberId: req.userId });

        if (!isOwner && !membership) {
            return res.status(403).json({ success: false, message: "Access denied. You are not a member of this project" });
        }

        const notes = await noteModel
            .find({ meetingId: meeting._id })
            .populate('authorId', 'name email avatar')
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: {
                project: {
                    projectName: project.projectName,
                    projectKey: project.projectKey,
                    description: project.description,
                },
                meeting: {
                    title: meeting.title,
                    meetingDateTime: meeting.meetingDateTime,
                    notesCount: meeting.notesCount,
                },
                notes,
            },
        });
    }
    catch (error) {
        console.error("Get Notes List Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ success: false, message: "Note content is required" });
    }

    try {
        const note = await noteModel.findById(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        if (note.authorId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Access denied. Only the author can edit this note" });
        }

        note.content = content;
        await note.save();
        await note.populate('authorId', 'name email avatar');

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note,
        });
    }
    catch (error) {
        console.error("Update Note Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findById(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        if (note.authorId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Access denied. Only the author can delete this note" });
        }

        await note.deleteOne();

        const meeting = await meetingModel.findById(note.meetingId);
        if (meeting && meeting.notesCount > 0) {
            meeting.notesCount -= 1;
            await meeting.save();
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Note Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
