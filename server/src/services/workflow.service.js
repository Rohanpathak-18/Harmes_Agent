const Job = require("../models/Job");
const { canTransition } = require("../../../workflows/states/transitions");

const transitionJob = async (jobId, nextState, userId) => {
    const job = await Job.findOne({
        _id: jobId,
        user: userId,
    });

    if (!job) {
        throw new Error("Job not found");
    }

    if (!canTransition(job.status, nextState)) {
        throw new Error(
            `Invalid transition: ${job.status} -> ${nextState}`
        );
    }

    job.status = nextState;

    if (nextState === "RESEARCHING") {
        job.startedAt = new Date();
    }

    if (
        nextState === "LEARNED" ||
        nextState === "CANCELLED"
    ) {
        job.completedAt = new Date();
    }

    await job.save();

    return job;
};

module.exports = {
    transitionJob,
};