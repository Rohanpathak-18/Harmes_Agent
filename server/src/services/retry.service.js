const Job = require("../models/Job");
const { enqueueJob } = require("./jobQueue.service");
const crypto = require("crypto");

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

    let queueJob;
    try {
        queueJob = await enqueueJob(
            job._id,
            `${job._id}-retry-${crypto.randomUUID()}`
        );
    } catch (error) {
        job.status = "FAILED";
        job.error = { message: error.message, timestamp: new Date() };
        await job.save();
        throw error;
    }

    return {
        job,
        queueJobId: queueJob.id,
    };
};

module.exports = {
    retryJob,
};
