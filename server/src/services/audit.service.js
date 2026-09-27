const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    user = null,
    organization = null,
    action,
    resourceType = null,
    resourceId = null,
    req = null,
    metadata = {},
}) => {
    try {
        await AuditLog.create({
            user,
            organization,
            action,
            resourceType,
            resourceId,
            ipAddress: req?.ip || null,
            userAgent: req?.headers?.["user-agent"] || null,
            metadata,
        });
    } catch (error) {
        console.error("Audit log error:", error.message);
    }
};

module.exports = {
    createAuditLog,
};