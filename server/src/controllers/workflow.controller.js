const Job = require("../models/Job");
const {
    runJobWorkflow,
} = require("../../../workflows/orchestrator/workflowRunner");

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

        const result = await runJobWorkflow(
            job._id
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    runWorkflow,
};