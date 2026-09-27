const { executeAgent } = require("../../../agents/core/runtime");

const runAgent = async (agentId, context) => {
    return await executeAgent(agentId, context);
};

module.exports = {
    runAgent,
};