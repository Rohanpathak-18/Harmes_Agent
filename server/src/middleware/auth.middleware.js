const Session = require("../models/Session");
const User = require("../models/User");
const { hashToken } = require("../utils/token");

const requireAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies.hermes_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const tokenHash = hashToken(sessionToken);

        const session = await Session.findOne({
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired or invalid",
            });
        }

        const user = await User.findById(session.user);

        if (!user || user.status !== "active") {
            return res.status(401).json({
                success: false,
                message: "User account is not available",
            });
        }

        req.user = user;
        req.session = session;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requireAuth,
};