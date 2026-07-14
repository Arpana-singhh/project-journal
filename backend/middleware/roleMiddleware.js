import userModel from '../models/userModel.js';

export const isOwner = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access denied. Owner role required" });
        }

        next();
    }
    catch (error) {
        console.error("Role Check Error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
