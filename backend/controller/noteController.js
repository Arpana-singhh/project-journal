import meetingModel from '../models/meetingModel.js';
import projectMemberModel from '../models/projectMemberModel.js';
import projectModel from '../models/projectModel.js';
import noteModel from '../models/noteModel.js';

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

        await note.populate({ path: 'authorId', select: 'name email avatar' });

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
