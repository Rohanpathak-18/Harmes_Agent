require("dotenv").config();


require("../bootstrap");

const { Worker } = require("bullmq");
const connectDB = require("../config/database");
const { runJobWorkflow } = require("../../../workflows/orchestrator/orchestrator");

const databaseReady = connectDB();

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
    "hermes-jobs",
    async (job) => {
        await databaseReady;
        console.log(`[WORKER] Processing ${job.id}`);

        if (!job.data?.jobId) {
            throw new Error("Queue jobId is missing");
        }

        const result = await runJobWorkflow(job.data.jobId);

        console.log(`[WORKER] Completed ${job.id}`);

        return result;
    },
    {
        connection,
        concurrency: 2,
    }
);

worker.on("completed", (job) => {
    console.log(`[WORKER] Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`[WORKER] Job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
    console.error("[WORKER] Redis/Worker error:", error.message);
});

databaseReady.then(() => {
    console.log("Hermes Worker connected to MongoDB");
    console.log("Hermes Worker listening on hermes-jobs");
}).catch((error) => {
    console.error("Hermes Worker could not connect to MongoDB:", error.message);
});

module.exports = worker;
