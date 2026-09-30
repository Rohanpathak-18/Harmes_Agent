const Session = require("../models/Session");
const User = require("../models/User");
const { hashToken } = require("../utils/token");

const requireAuth = async (req, res, next) => {
    try {
        const authorization = req.get("authorization") || "";
        const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
        const sessionToken = req.cookies.hermes_session || bearerToken;

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

// Session discovery is used during app startup on public pages too. A missing
// or expired session means "signed out" there, not an API error.
const optionalAuth = async (req, res, next) => {
    try {
        const authorization = req.get("authorization") || "";
        const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
        const sessionToken = req.cookies?.hermes_session || bearerToken;
        if (!sessionToken) {
            req.user = null;
            return next();
        }

        const session = await Session.findOne({
            tokenHash: hashToken(sessionToken),
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });

        if (!session) {
            req.user = null;
            return next();
        }

        const user = await User.findById(session.user);
        req.user = user?.status === "active" ? user : null;
        req.session = req.user ? session : null;
        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    requireAuth,
    optionalAuth,
};
