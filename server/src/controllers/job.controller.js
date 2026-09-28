const {
    createJob,
    getJobById,
    getUserJobs,
} = require("../services/job.service");

const { enqueueJob } = require("../services/jobQueue.service");

const create = async (req, res, next) => {
    try {
        const { objective, priority } = req.body || {};

        if (!objective || !objective.trim()) {
            return res.status(400).json({
                success: false,
                message: "Objective is required",
            });
        }

        const job = await createJob({
            userId: req.user._id,
            organizationId: req.organization._id,
            objective: objective.trim(),
            priority,
        });

        const queueJob = await enqueueJob(job._id);

        return res.status(201).json({
            success: true,
            message: "Hermes job created and queued",
            job,
            queueJobId: queueJob.id,
        });
    } catch (error) {
        next(error);
    }
};
const getOne = async (req, res, next) => {
    try {
        const job = await getJobById(
            req.params.id,
            req.user._id
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const jobs = await getUserJobs(req.user._id);

        return res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getOne,
    getAll,
};