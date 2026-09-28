const Job = require("../models/Job");

const {
    saveAnalytics,
    getJobAnalytics,
} = require("../services/analytics.service");

const create = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const analytics = await saveAnalytics({
            jobId: job._id,
            platform: req.body.platform || "youtube",
            externalId: req.body.externalId || "",
            metrics: req.body.metrics || {},
            metadata: req.body.metadata || {},
        });

        res.status(201).json({
            success: true,
            analytics,
        });
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const analytics =
            await getJobAnalytics(job._id);

        res.json({
            success: true,
            analytics,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    get,
};