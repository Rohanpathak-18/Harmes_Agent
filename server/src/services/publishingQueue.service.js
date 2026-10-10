const Job = require("../models/Job");
const { publishingQueue } = require("../queues/publishing.queue");

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

    const queueJob = await publishingQueue.add(
        "publish-job",
        { jobId: job._id.toString() },
        {
            jobId: job._id.toString(),
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
            removeOnComplete: 100,
            removeOnFail: 100,
        }
    );

    return {
        job,
        queueJobId: queueJob.id,
    };
};

module.exports = {
    schedulePublishing,
};
