const Learning = require("../models/Learning");
const Analytics = require("../models/Analytics");

const generateLearning = async (jobId) => {
    const analytics = await Analytics.find({
        job: jobId,
    }).sort({
        collectedAt: -1,
    });

    if (!analytics.length) {
        return null;
    }

    const latest = analytics[0];

    let insight = "Performance data collected.";
    let recommendation =
        "Continue monitoring performance.";

    if (latest.views > 10000) {
        insight =
            "Content achieved strong view volume.";
        recommendation =
            "Consider producing more content around this topic.";
    } else if (latest.views < 1000) {
        insight =
            "Content received relatively low view volume.";
        recommendation =
            "Review topic selection, title, thumbnail and opening hook.";
    }

    return await Learning.create({
        job: jobId,
        type: "performance",
        insight,
        recommendation,
        confidence: 0.7,
        metadata: {
            views: latest.views,
            likes: latest.likes,
            retention: latest.retention,
            ctr: latest.ctr,
        },
    });
};

const getLearning = async (jobId) => {
    return await Learning.find({
        job: jobId,
    }).sort({
        createdAt: -1,
    });
};

module.exports = {
    generateLearning,
    getLearning,
};