require("dotenv").config();

require("../bootstrap");

const { Worker } = require("bullmq");

const connectDB = require("../config/database");
const databaseReady = connectDB();
const { getRedisConnection } = require("../config/redis");

const Job = require("../models/Job");
const Video = require("../models/Video");

const { runAgent } = require("../services/agent.service");

const worker = new Worker(
  "hermes-publishing",
  async (queueJob) => {
    await databaseReady;
    const { jobId } = queueJob.data;

    console.log(`[PUBLISHER] Processing ${jobId}`);

    const job = await Job.findById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    if (job.status !== "SCHEDULED") {
      throw new Error(`Job cannot be published from ${job.status}`);
    }

    const video = await Video.findOne({
      job: job._id,
    });

    if (!video) {
      throw new Error("Video not found for publishing");
    }

    const result = await runAgent("publisher-agent", {
      jobId: job._id,
      video,
    });

    console.log(`[PUBLISHER] Completed ${jobId} with status ${result.status}`);

    return result;
  },
  {
    connection: getRedisConnection(),
    concurrency: 1,
  },
);

worker.on("completed", (job) => {
  console.log(`[PUBLISHER] Queue job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`[PUBLISHER] Queue job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
  console.error("[PUBLISHER] Worker error:", error.message);
});

databaseReady.then(() => {
  console.log("Hermes Publishing Worker connected to MongoDB");
  console.log("Hermes Publishing Worker listening");
}).catch((error) => {
  console.error("Hermes Publishing Worker could not connect to MongoDB:", error.message);
});

module.exports = worker;
