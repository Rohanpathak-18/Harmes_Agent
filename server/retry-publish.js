require("dotenv").config();

const connectDB = require("./src/config/database");
const Job = require("./src/models/Job");
const { publishingQueue } = require("./src/queues/publishing.queue");

const JOB_ID = "6aba902f73b0195d84028517";

const run = async () => {
    await connectDB();

    const job = await Job.findById(JOB_ID);

    if (!job) {
        throw new Error("Job not found");
    }

    console.log("CURRENT STATUS:", job.status);

    if (job.status !== "SCHEDULED") {
        throw new Error(`Expected SCHEDULED, got ${job.status}`);
    }

    const queueJob = await publishingQueue.add(
        "publish-job",
        {
            jobId: job._id.toString(),
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

    console.log("REPUBLISHED TO QUEUE:");
    console.log({
        jobId: job._id.toString(),
        queueJobId: queueJob.id,
    });

    await publishingQueue.close();
    process.exit(0);
};

run().catch((error) => {
    console.error("RETRY PUBLISH FAILED:");
    console.error(error);
    process.exit(1);
});