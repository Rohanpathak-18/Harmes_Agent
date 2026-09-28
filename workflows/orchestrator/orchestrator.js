const { runAgent } = require("../../server/src/services/agent.service");

const ContentPlan = require("../../server/src/models/ContentPlan");
const Script = require("../../server/src/models/Script");

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
      const plannerResult = await runAgent("content-planner-agent", {
        jobId: job._id,
        objective: job.objective,
      });

      const contentPlan = await ContentPlan.findOne({
        job: job._id,
      });

      if (!contentPlan) {
        throw new Error("Content Plan was not created");
      }

      const writerResult = await runAgent("writer-agent", {
        jobId: job._id,
        contentPlan,
      });

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
        throw new Error("Content Plan not found");
      }

      const script = await Script.findOne({
        job: job._id,
      });

      if (!script) {
        throw new Error("Script not found");
      }

      return await runAgent("production-agent", {
        jobId: job._id,
        contentPlan,
        script,
      });
    }

    case "FINAL_QA":
      return await runAgent("qa-agent", {
        jobId: job._id,
      });

    default:
      throw new Error(`No agent configured for workflow state: ${job.status}`);
  }
};

const runJobWorkflow = async (jobId) => {
    let job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    try {
        // existing workflow logic
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
};
