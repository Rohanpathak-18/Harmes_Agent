const Membership = require("../models/Membership");
const Organization = require("../models/Organization");

const requireOrganization = async (req, res, next) => {
    try {
        const membership = await Membership.findOne({
            user: req.user._id,
            status: "active",
        }).populate("organization");

        if (!membership || !membership.organization) {
            return res.status(403).json({
                success: false,
                message: "No active organization found",
            });
        }

        if (membership.organization.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Organization is not active",
            });
        }

        req.organization = membership.organization;
        req.membership = membership;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requireOrganization,
};