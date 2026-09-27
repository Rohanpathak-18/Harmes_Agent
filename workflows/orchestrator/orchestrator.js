const { runAgent } = require("../../server/src/services/agent.service");

const executeWorkflowStage = async (job) => {
    switch (job.status) {
        case "RESEARCHING":
            return await runAgent("research-agent", {
                jobId: job._id,
                objective: job.objective,
            });

        default:
            throw new Error(
                `No agent configured for workflow state: ${job.status}`
            );
    }
};

module.exports = {
    executeWorkflowStage,
};