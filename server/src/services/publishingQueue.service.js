const Job = require("../models/Job");
const { enqueueJob } = require("./jobQueue.service");

const schedulePublishing = async ({
    jobId,
    userId,
}) => {
    const job = await Job.findOne({
        _id: jobId,
        user: userId,
        status: "APPROVED",
    });

    if (!job) {
        throw new Error(
            "Only approved jobs can be scheduled"
        );
    }

    job.status = "SCHEDULED";
    await job.save();

    const queueJob = await enqueueJob(job._id);

    return {
        job,
        queueJobId: queueJob.id,
    };
};

module.exports = {
    schedulePublishing,
};