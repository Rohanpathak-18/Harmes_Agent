const { jobQueue } = require("../queues/job.queue");

const enqueueJob = async (jobId, queueJobId = jobId.toString()) => {
    return await jobQueue.add(
        "run-job",
        {
            jobId: jobId.toString(),
        },
        {
            // A job can be submitted from the UI more than once while its
            // first queue entry is still active. Keep one active run per job.
            jobId: queueJobId,
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
