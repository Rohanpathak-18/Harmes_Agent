const Job = require("../models/Job");
const { runJobWorkflow } = require("../../../workflows/orchestrator/orchestrator");

const retryJob = async (jobId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "FAILED") {
        throw new Error("Only failed jobs can be retried");
    }

    job.status = "RESEARCHING";
    job.error = null;
    job.startedAt = new Date();
    job.completedAt = null;

    await job.save();

    // Resume the workflow
    const result = await runJobWorkflow(job._id);

    return result;
};

module.exports = {
    retryJob,
};