import projectModel from '../models/projectModel.js';
import projectMemberModel from '../models/projectMemberModel.js';

export const createProject = async (req, res) => {
    const { projectName, projectKey, description } = req.body;

    if (!projectName || !projectKey) {
        return res.status(400).json({ success: false, message: "Project name, project key and client name are required" });
    }

    try {
        const existingProject = await projectModel.findOne({ projectKey });
        if (existingProject) {
            return res.status(409).json({ success: false, message: "Project key already in use" });
        }

        const project = await projectModel.create({
            projectName,
            projectKey,
            description,
            ownerId: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    }
    catch (error) {
        console.error("Create Project Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await projectModel.findById(id);

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

        const memberCount = await projectMemberModel.countDocuments({ projectId: project._id });

        const projectObj = project.toJSON();
        projectObj.role = isOwner ? 'owner' : membership.role;
        projectObj.memberCount = memberCount;

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            project: projectObj,
        });
    }
    catch (error) {
        console.error("Get Project Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const memberships = await projectMemberModel.find({ memberId: req.userId });
        const memberProjectIds = memberships.map((m) => m.projectId);

        const projects = await projectModel
            .find({ $or: [{ ownerId: req.userId }, { _id: { $in: memberProjectIds } }] })
            .sort({ createdAt: -1 });

        const projectIds = projects.map((p) => p._id);

        const counts = await projectMemberModel.aggregate([
            { $match: { projectId: { $in: projectIds } } },
            { $group: { _id: "$projectId", count: { $sum: 1 } } },
        ]);
        const countByProjectId = new Map(counts.map((c) => [c._id.toString(), c.count]));
        const roleByProjectId = new Map(memberships.map((m) => [m.projectId.toString(), m.role]));

        const projectsWithMeta = projects.map((project) => {
            const projectObj = project.toJSON();
            projectObj.role = project.ownerId.toString() === req.userId
                ? 'owner'
                : roleByProjectId.get(project._id.toString());
            projectObj.memberCount = countByProjectId.get(project._id.toString()) || 0;
            return projectObj;
        });

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            projects: projectsWithMeta,
        });
    }
    catch (error) {
        console.error("Get All Projects Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { projectName, projectKey, description } = req.body;

    try {
        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Access denied. Only the project owner can edit this project" });
        }

        if (projectKey && projectKey !== project.projectKey) {
            const existingProject = await projectModel.findOne({ projectKey });
            if (existingProject) {
                return res.status(409).json({ success: false, message: "Project key already in use" });
            }
        }

        if (projectName !== undefined) project.projectName = projectName;
        if (projectKey !== undefined) project.projectKey = projectKey;
        if (description !== undefined) project.description = description;

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    }
    catch (error) {
        console.error("Update Project Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Access denied. Only the project owner can delete this project" });
        }

        await project.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Project Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
