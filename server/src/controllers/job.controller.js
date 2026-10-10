const {
    createJob,
    getJobById,
    getUserJobs,
} = require("../services/job.service");

const create = async (req, res, next) => {
    try {
        const { objective, priority } = req.body || {};

        if (typeof objective !== "string" || !objective.trim()) {
            return res.status(400).json({
                success: false,
                message: "Objective is required",
            });
        }

        if (priority && !["low", "normal", "high"].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Priority must be low, normal or high",
            });
        }

        const job = await createJob({
            userId: req.user._id,
            organizationId: req.organization._id,
            objective: objective.trim(),
            priority,
        });

        return res.status(201).json({
            success: true,
            message: "Hermes job created",
            job,
        });
    } catch (error) {
        next(error);
    }
};
const getOne = async (req, res, next) => {
    try {
        const job = await getJobById(
            req.params.id,
            req.user._id,
            req.organization._id
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
        const jobs = await getUserJobs(req.user._id, req.organization._id);

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
