const Job = require("../../server/src/models/Job");
const {
    executeWorkflowStage,
} = require("./orchestrator");

const runJobWorkflow = async (jobId) => {
    let job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    let result = null;

    // DISCOVERED → RESEARCHING
    if (job.status === "DISCOVERED") {
        job.status = "RESEARCHING";
        job.startedAt = new Date();

        await job.save();
    }

    // RESEARCHING → RESEARCH_READY
    if (job.status === "RESEARCHING") {
        result = await executeWorkflowStage(job);

        job.status = "RESEARCH_READY";

        await job.save();
    }

    // RESEARCH_READY → SCRIPTING
    if (job.status === "RESEARCH_READY") {
        result = await executeWorkflowStage(job);

        job.status = "SCRIPTING";

        await job.save();
    }

    // SCRIPTING → PRODUCTION
    if (job.status === "SCRIPTING") {
        result = await executeWorkflowStage(job);

        job.status = "PRODUCTION";

        await job.save();
    }

    // PRODUCTION → FINAL_QA
    if (job.status === "PRODUCTION") {
        result = await executeWorkflowStage(job);

        job.status = "FINAL_QA";

        await job.save();
    }

    // FINAL_QA → WAITING_APPROVAL
    if (job.status === "FINAL_QA") {
        result = await executeWorkflowStage(job);

        if (!result.passed) {
            throw new Error(
                "QA failed. Job cannot enter approval."
            );
        }

        job.status = "WAITING_APPROVAL";

        await job.save();
    }

    return {
        success: true,
        jobId: job._id,
        status: job.status,
        result,
    };
};

module.exports = {
    runJobWorkflow,
};