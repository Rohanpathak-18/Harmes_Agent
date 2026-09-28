require("dotenv").config();

const connectDB = require("./src/config/database");
const Job = require("./src/models/Job");
const Approval = require("./src/models/Approval");
const {
    approveJob,
} = require("./src/services/approval.service");

const JOB_ID = "6aba902f73b0195d84028517";

const run = async () => {
    await connectDB();

    const job = await Job.findById(JOB_ID);

    if (!job) {
        throw new Error("Job not found");
    }

    console.log("\nBEFORE:");
    console.log({
        job: job._id.toString(),
        status: job.status,
        user: job.user.toString(),
    });

    const result = await approveJob({
        jobId: JOB_ID,
        userId: job.user.toString(),
        comment: "Approved for publishing test",
    });

    console.log("\nAPPROVAL RESULT:");
    console.log({
        approvalStatus: result.approval.status,
        jobStatus: result.job.status,
    });

    const approval = await Approval.findOne({
        job: JOB_ID,
    });

    const updatedJob = await Job.findById(JOB_ID);

    console.log("\nAFTER:");
    console.log({
        approval: approval.status,
        job: updatedJob.status,
    });

    process.exit(0);
};

run().catch((error) => {
    console.error("\nAPPROVAL TEST FAILED:");
    console.error(error);
    process.exit(1);
});