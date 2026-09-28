require("dotenv").config();

const connectDB = require("./src/config/database");
const Job = require("./src/models/Job");

const run = async () => {
    await connectDB();

    const jobs = await Job.find({
        objective: "Create a YouTube video about the latest AI agent trends",
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("_id status objective error createdAt updatedAt");

    console.log("\nLATEST HERMES JOBS:\n");

    jobs.forEach((job) => {
        console.log({
            id: job._id.toString(),
            status: job.status,
            error: job.error?.message || null,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        });
    });

    process.exit(0);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});