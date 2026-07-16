import projectModel from '../models/projectModel.js';
import projectMemberModel from '../models/projectMemberModel.js';
import meetingModel from '../models/meetingModel.js';

export const createMeeting = async (req, res) => {
    const { projectId } = req.params;
    const { title, meetingDateTime } = req.body;

    if (!title || !meetingDateTime) {
        return res.status(400).json({ success: false, message: "Meeting title and date & time are required" });
    }

    try {
        const project = await projectModel.findById(projectId);

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

        const meeting = await meetingModel.create({
            projectId: project._id,
            title,
            meetingDateTime,
            createdBy: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            project: {
                projectName: project.projectName,
                projectKey: project.projectKey,
                description: project.description,
            },
            meeting,
        });
    }
    catch (error) {
        console.error("Create Meeting Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getMeetingsList = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await projectModel.findById(projectId);

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

        const meetings = await meetingModel
            .find({ projectId: project._id })
            .sort({ meetingDateTime: 1 });

        return res.status(200).json({
            success: true,
            message: "Meetings fetched successfully",
            project: {
                projectName: project.projectName,
                projectKey: project.projectKey,
                description: project.description,
            },
            meetings,
        });
    }
    catch (error) {
        console.error("Get Meetings List Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateMeeting = async (req, res) => {
    const { meetingId } = req.params;
    const { title, meetingDateTime } = req.body;

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

        if (title !== undefined) meeting.title = title;
        if (meetingDateTime !== undefined) meeting.meetingDateTime = meetingDateTime;

        await meeting.save();


        return res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            project: {
                projectName: project.projectName,
                projectKey: project.projectKey,
                description: project.description,
            },
            meeting,
        });
    }
    catch (error) {
        console.error("Update Meeting Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteMeeting = async (req, res) => {
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

        await meeting.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Meeting deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Meeting Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
