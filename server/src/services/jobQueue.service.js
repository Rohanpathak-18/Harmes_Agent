const { jobQueue } = require("../queues/job.queue");

const enqueueJob = async (jobId) => {
    return await jobQueue.add(
        "run-job",
        {
            jobId: jobId.toString(),
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: 100,
            removeOnFail: 100,
        }
    );
};

module.exports = {
    enqueueJob,
};