require("dotenv").config();

const connectDB = require("./src/config/database");
const Job = require("./src/models/Job");

const {
    schedulePublishing,
} = require("./src/services/publishingQueue.service");

const JOB_ID = "6aba902f73b0195d84028517";

const run = async () => {
    await connectDB();

    const job = await Job.findById(JOB_ID);

    if (!job) {
        throw new Error("Job not found");
    }

    console.log("CURRENT STATUS:", job.status);

    const result = await schedulePublishing({
        jobId: JOB_ID,
        userId: job.user,
    });

    console.log("\nSCHEDULED:");
    console.log({
        job: result.job._id.toString(),
        status: result.job.status,
        queueJobId: result.queueJobId,
    });

    process.exit(0);
};

run().catch((error) => {
    console.error("\nPUBLISH TEST FAILED:");
    console.error(error);
    process.exit(1);
});