const Job = require("../models/Job");

const retryJob = async (jobId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "FAILED") {
        throw new Error(
            "Only failed jobs can be retried"
        );
    }

    job.status = "RESEARCHING";

    job.error = null;

    await job.save();

    return job;
};

module.exports = {
    retryJob,
};