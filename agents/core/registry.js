const agents = new Map();

const registerAgent = (agent) => {
    if (!agent?.id) {
        throw new Error("Agent must have an id");
    }

    if (agents.has(agent.id)) {
        throw new Error(`Agent already registered: ${agent.id}`);
    }

    agents.set(agent.id, agent);
};

const getAgent = (agentId) => {
    return agents.get(agentId);
};

const getAllAgents = () => {
    return Array.from(agents.values());
};

module.exports = {
    registerAgent,
    getAgent,
    getAllAgents,
};