const Job = require("../models/Job");
const { enqueueJob } = require("../services/jobQueue.service");

const runWorkflow = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
            organization: req.organization._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (job.status !== "DISCOVERED") {
            return res.status(409).json({
                success: false,
                message: `Job cannot be started from ${job.status}`,
                status: job.status,
            });
        }

        // Mark the job as running before enqueueing so the UI can show progress
        // while the worker performs the potentially long agent calls.
        job.status = "RESEARCHING";
        job.startedAt = new Date();
        await job.save();

        try {
            const queueJob = await enqueueJob(job._id);
            return res.status(202).json({
                success: true,
                message: "Workflow queued",
                jobId: job._id,
                queueJobId: queueJob.id,
                status: job.status,
            });
        } catch (error) {
            job.status = "DISCOVERED";
            job.startedAt = null;
            await job.save();
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    runWorkflow,
};
