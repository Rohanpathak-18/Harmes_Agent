const Job = require("../../server/src/models/Job");

const {
    executeWorkflowStage,
} = require("./orchestrator");

const ContentPlan =
    require("../../server/src/models/ContentPlan");

const Script =
    require("../../server/src/models/Script");

const runJobWorkflow = async (jobId) => {
    let job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    let result = null;

    // Research
    if (job.status === "RESEARCHING") {
        result =
            await executeWorkflowStage(job);

        job.status = "RESEARCH_READY";
        await job.save();
    }

    // Context
    if (job.status === "RESEARCH_READY") {
        result =
            await executeWorkflowStage(job);

        job.status = "SCRIPTING";
        await job.save();
    }

    // Content planning
    if (job.status === "SCRIPTING") {
        result =
            await executeWorkflowStage(job);

        job.status = "PRODUCTION";
        await job.save();
    }

    // Production
    if (job.status === "PRODUCTION") {
        const contentPlan =
            await ContentPlan.findOne({
                job: job._id,
            });

        if (!contentPlan) {
            throw new Error(
                "Content Plan not found"
            );
        }

        /*
         * Generate script before production.
         */
        const writerResult =
            await require(
                "../../server/src/services/agent.service"
            ).runAgent(
                "writer-agent",
                {
                    jobId: job._id,
                    contentPlan,
                }
            );

        const script =
            await Script.findOne({
                job: job._id,
            });

        if (!script) {
            throw new Error(
                "Script was not created by Writer Agent"
            );
        }

        result =
            await executeWorkflowStage({
                ...job.toObject(),
                status: "PRODUCTION",
                script,
                contentPlan,
            });

        job.status = "FINAL_QA";
        await job.save();

        return {
            success: true,
            jobId: job._id,
            status: job.status,
            writerResult,
            productionResult: result,
        };
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