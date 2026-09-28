const Job = require("../models/Job");
const { retryJob } = require("../services/retry.service");

const retry = async (req, res, next) => {
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

        const updatedJob = await retryJob(job._id);

        res.json({
            success: true,
            message: "Job retry started",
            job: updatedJob,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    retry,
};