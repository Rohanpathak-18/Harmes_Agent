const { transitionJob } = require("../services/workflow.service");

const transition = async (req, res, next) => {
    try {
        const { nextState } = req.body || {};
        const { id } = req.params;

        if (!nextState) {
            return res.status(400).json({
                success: false,
                message: "nextState is required",
            });
        }

        const job = await transitionJob(
            id,
            nextState,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: `Job moved to ${nextState}`,
            job,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    transition,
};