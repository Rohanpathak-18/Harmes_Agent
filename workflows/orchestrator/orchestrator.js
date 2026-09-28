const Job = require("../../server/src/models/Job");

const {
    runAgent,
} = require("../../server/src/services/agent.service");

const ContentPlan = require("../../server/src/models/ContentPlan");
const Script = require("../../server/src/models/Script");

const learningService = require("../../server/src/services/Learning.service");

const { generateLearning } = learningService;

const executeWorkflowStage = async (job) => {
    switch (job.status) {
        case "RESEARCHING":
            return await runAgent("research-agent", {
                jobId: job._id,
                objective: job.objective,
            });

        case "RESEARCH_READY":
            return await runAgent("context-agent", {
                query: job.objective,
                limit: 5,
            });

        case "SCRIPTING": {
            const plannerResult = await runAgent(
                "content-planner-agent",
                {
                    jobId: job._id,
                    objective: job.objective,
                }
            );

            const contentPlan = await ContentPlan.findOne({
                job: job._id,
            });

            if (!contentPlan) {
                throw new Error(
                    "Content Plan was not created"
                );
            }

            const writerResult = await runAgent(
                "writer-agent",
                {
                    jobId: job._id,
                    contentPlan,
                }
            );

            return {
                plannerResult,
                writerResult,
            };
        }

        case "PRODUCTION": {
            const contentPlan = await ContentPlan.findOne({
                job: job._id,
            });

            if (!contentPlan) {
                throw new Error(
                    "Content Plan not found"
                );
            }

            const script = await Script.findOne({
                job: job._id,
            });

            if (!script) {
                throw new Error(
                    "Script not found"
                );
            }

            return await runAgent(
                "production-agent",
                {
                    jobId: job._id,
                    contentPlan,
                    script,
                }
            );
        }

        case "FINAL_QA":
            return await runAgent(
                "qa-agent",
                {
                    jobId: job._id,
                }
            );

        case "ANALYZING":
            return await generateLearning(
                job._id
            );

        default:
            throw new Error(
                `No agent configured for workflow state: ${job.status}`
            );
    }
};


/*
|--------------------------------------------------------------------------
| Run Complete Job Workflow
|--------------------------------------------------------------------------
*/

const runJobWorkflow = async (jobId) => {
    let job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    let result = null;

    try {
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

        // ANALYZING → LEARNED
        if (job.status === "ANALYZING") {
            result = await executeWorkflowStage(job);

            job.status = "LEARNED";
            job.completedAt = new Date();

            await job.save();
        }

        return {
            success: true,
            jobId: job._id,
            status: job.status,
            result,
        };

    } catch (error) {
        job.status = "FAILED";

        job.error = {
            message: error.message,
            timestamp: new Date(),
        };

        await job.save();

        throw error;
    }
};


module.exports = {
    executeWorkflowStage,
    runJobWorkflow,
};