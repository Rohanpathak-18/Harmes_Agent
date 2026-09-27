const Job =
    require("../models/Job");

const {
    createApproval,
    approveJob,
    rejectJob,
    getApproval,
} = require("../services/approval.service");

const create = async (req, res, next) => {
    try {
        const job =
            await Job.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const approval =
            await createApproval({
                jobId: job._id,
                userId: req.user._id,
            });

        res.status(201).json({
            success: true,
            approval,
        });
    } catch (error) {
        next(error);
    }
};

const approve = async (req, res, next) => {
    try {
        const approval =
            await approveJob({
                jobId: req.params.id,
                userId: req.user._id,
                comment:
                    req.body.comment || "",
            });

        if (!approval) {
            return res.status(404).json({
                success: false,
                message:
                    "Approval request not found",
            });
        }

        const job =
            await Job.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (job) {
            job.status = "APPROVED";
            await job.save();
        }

        res.json({
            success: true,
            approval,
        });
    } catch (error) {
        next(error);
    }
};

const reject = async (req, res, next) => {
    try {
        const approval =
            await rejectJob({
                jobId: req.params.id,
                userId: req.user._id,
                comment:
                    req.body.comment || "",
            });

        if (!approval) {
            return res.status(404).json({
                success: false,
                message:
                    "Approval request not found",
            });
        }

        const job =
            await Job.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (job) {
            job.status = "FINAL_QA";
            await job.save();
        }

        res.json({
            success: true,
            approval,
        });
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const approval =
            await getApproval({
                jobId: req.params.id,
                userId: req.user._id,
            });

        res.json({
            success: true,
            approval,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    approve,
    reject,
    get,
};