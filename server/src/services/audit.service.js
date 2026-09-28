const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    userId = null,
    organizationId = null,
    action,
    resourceType = "",
    resourceId = null,
    metadata = {},
}) => {
    return await AuditLog.create({
        user: userId,
        organization: organizationId,
        action,
        resourceType,
        resourceId,
        metadata,
    });
};

module.exports = {
    createAuditLog,
};