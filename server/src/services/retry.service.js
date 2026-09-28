const Job = require("../models/Job");
const { enqueueJob } = require("./jobQueue.service");

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

    const queueJob = await enqueueJob(job._id);

    return {
        job,
        queueJobId: queueJob.id,
    };
};

module.exports = {
    retryJob,
};