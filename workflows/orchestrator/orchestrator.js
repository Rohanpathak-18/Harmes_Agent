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
      const result = await runAgent("content-planner-agent", {
        jobId: job._id,
        objective: job.objective,
      });

      return result;
    }

    case "FINAL_QA": {
      const result = await runAgent("qa-agent", {
        jobId: job._id,
      });

      if (!result.passed) {
        throw new Error("QA failed. Job cannot proceed to approval.");
      }

      return result;
    }

    case "PRODUCTION": {
      const contentPlan = await ContentPlan.findOne({
        job: job._id,
      });

      if (!contentPlan) {
        throw new Error("Content Plan not found for job");
      }

      const script = await Script.findOne({
        job: job._id,
      });

      if (!script) {
        throw new Error("Script not found for job");
      }

      return await runAgent("production-agent", {
        jobId: job._id,
        contentPlan,
        script,
      });
    }

    default:
      throw new Error(`No agent configured for workflow state: ${job.status}`);
  }
};

module.exports = {
  executeWorkflowStage,
};
