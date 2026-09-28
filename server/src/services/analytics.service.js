const Analytics = require("../models/Analytics");

const saveAnalytics = async ({
    jobId,
    platform = "youtube",
    externalId = "",
    metrics = {},
    metadata = {},
}) => {
    return await Analytics.create({
        job: jobId,
        platform,
        externalId,

        views: metrics.views || 0,
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        shares: metrics.shares || 0,
        watchTime: metrics.watchTime || 0,
        retention: metrics.retention || 0,
        ctr: metrics.ctr || 0,

        metadata,
    });
};

const getJobAnalytics = async (jobId) => {
    return await Analytics.find({
        job: jobId,
    }).sort({
        collectedAt: -1,
    });
};

module.exports = {
    saveAnalytics,
    getJobAnalytics,
};