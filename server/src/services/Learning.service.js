const Learning = require("../models/Learning");
const Analytics = require("../models/Analytics");

const generateLearning = async (jobId) => {
    const analytics = await Analytics.find({
        job: jobId,
    }).sort({
        collectedAt: -1,
    });

    if (!analytics.length) {
        throw new Error(
            "No analytics available for learning"
        );
    }

    const latest = analytics[0];

    let insight;
    let recommendation;

    if (latest.views >= 10000) {
        insight =
            "Content achieved strong view volume.";

        recommendation =
            "Consider creating more content around this topic.";
    } else if (latest.views < 1000) {
        insight =
            "Content received relatively low view volume.";

        recommendation =
            "Review topic selection, title, thumbnail and opening hook.";
    } else {
        insight =
            "Content achieved moderate view volume.";

        recommendation =
            "Continue monitoring this topic and test different hooks and thumbnails.";
    }

    if (latest.retention >= 60) {
        insight +=
            " Audience retention is relatively strong.";
    } else if (latest.retention > 0) {
        insight +=
            " Audience retention may need improvement.";
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
            comments: latest.comments,
            shares: latest.shares,
            watchTime: latest.watchTime,
            retention: latest.retention,
            ctr: latest.ctr,
        },
    });
};

const getJobLearning = async (jobId) => {
    return await Learning.find({
        job: jobId,
    }).sort({
        createdAt: -1,
    });
};

module.exports = {
    generateLearning,
    getJobLearning,
};