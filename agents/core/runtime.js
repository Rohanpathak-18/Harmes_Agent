const { getAgent } = require("./registry");

const executeAgent = async (agentId, context = {}) => {
    const agent = getAgent(agentId);

    if (!agent) {
        throw new Error(`Agent not found: ${agentId}`);
    }

    return await agent.execute(context);
};

module.exports = {
    executeAgent,
};