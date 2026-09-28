require("dotenv").config();

require("../bootstrap");

const { Worker } = require("bullmq");

const connectDB = require("../config/database");

const Job = require("../models/Job");
const Video = require("../models/Video");

const {
    runAgent,
} = require("../services/agent.service");

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
    "hermes-publishing",
    async (queueJob) => {
        const { jobId } = queueJob.data;

        console.log(
            `[PUBLISHER] Processing ${jobId}`
        );

        const job = await Job.findById(jobId);

        if (!job) {
            throw new Error("Job not found");
        }

        if (job.status !== "SCHEDULED") {
            throw new Error(
                `Job cannot be published from ${job.status}`
            );
        }

        const video = await Video.findOne({
            job: job._id,
        });

        if (!video) {
            throw new Error(
                "Video not found for publishing"
            );
        }

        const result = await runAgent(
            "publisher-agent",
            {
                jobId: job._id,
                video,
            }
        );

        job.status = "PUBLISHED";
        job.completedAt = new Date();

        await job.save();

        console.log(
            `[PUBLISHER] Published ${jobId}`
        );

        return result;
    },
    {
        connection,
        concurrency: 1,
    }
);

worker.on("completed", (job) => {
    console.log(
        `[PUBLISHER] Queue job ${job.id} completed`
    );
});

worker.on("failed", (job, error) => {
    console.error(
        `[PUBLISHER] Queue job ${job?.id} failed:`,
        error.message
    );
});

worker.on("error", (error) => {
    console.error(
        "[PUBLISHER] Worker error:",
        error.message
    );
});

const start = async () => {
    await connectDB();

    console.log(
        "Hermes Publishing Worker connected to MongoDB"
    );

    console.log(
        "Hermes Publishing Worker listening"
    );
};

start();

module.exports = worker;