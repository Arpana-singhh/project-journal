import projectModel from '../models/projectModel.js';
import projectMemberModel from '../models/projectMemberModel.js';
import inviteLinkModel from '../models/inviteLinkModel.js';

const DEFAULT_EXPIRY_DAYS = 7;

export const createInviteLink = async (req, res) => {
    const { projectId } = req.params;
    const { expiresInDays, maxMembers } = req.body || {};

    try {
        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Access denied. Only the project owner can invite members" });
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (expiresInDays || DEFAULT_EXPIRY_DAYS));

        await projectMemberModel.updateOne(
            { projectId: project._id, memberId: req.userId },
            { $setOnInsert: { role: 'owner' } },
            { upsert: true }
        );

        const invite = await inviteLinkModel.create({
            projectId: project._id,
            createdBy: req.userId,
            expiresAt,
            maxMembers: maxMembers || null,
            memberCount: 1,
        });

        const inviteLink = `${process.env.FRONTEND_URL}/invite/${invite.token}`;

        return res.status(201).json({
            success: true,
            message: "Invite link created successfully",
            inviteLink,
        });
    }
    catch (error) {
        console.error("Create Invite Link Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const acceptInvite = async (req, res) => {
    const { token } = req.params;

    try {
        const inviteLink = await inviteLinkModel.findOne({ token });

        if (!inviteLink) {
            return res.status(404).json({ success: false, message: "Invite link not found" });
        }

        if (inviteLink.expiresAt < new Date()) {
            return res.status(410).json({ success: false, message: "Invite link has expired" });
        }

        if (inviteLink.maxMembers !== null && inviteLink.memberCount >= inviteLink.maxMembers) {
            return res.status(410).json({ success: false, message: "Invite link has reached its usage limit" });
        }

        const existingMember = await projectMemberModel.findOne({
            projectId: inviteLink.projectId,
            memberId: req.userId,
        });

        if (existingMember) {
            return res.status(200).json({
                success: true,
                message: "You are already a member of this project",
                member: existingMember,
            });
        }

        const member = await projectMemberModel.create({
            projectId: inviteLink.projectId,
            memberId: req.userId,
            role: 'editor',
        });

        inviteLink.memberCount += 1;
        await inviteLink.save();

        return res.status(201).json({
            success: true,
            message: "Joined project successfully",
            member,
        });
    }
    catch (error) {
        console.error("Accept Invite Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getProjectMembers = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const members = await projectMemberModel
            .find({ projectId })
            .populate('memberId', 'name email avatar');

        return res.status(200).json({
            success: true,
            message: "Members fetched successfully",
            members,
        });
    }
    catch (error) {
        console.error("Get Project Members Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
