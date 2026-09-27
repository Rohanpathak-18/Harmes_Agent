const Job =
    require("../models/Job");

const {
    queuePublication,
    getPublication,
} = require("../services/publication.service");

const queue = async (req, res, next) => {
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

        const publication =
            await queuePublication({
                jobId: job._id,
            });

        res.status(201).json({
            success: true,
            publication,
        });
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const publication =
            await getPublication(
                req.params.id
            );

        res.json({
            success: true,
            publication,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    queue,
    get,
};