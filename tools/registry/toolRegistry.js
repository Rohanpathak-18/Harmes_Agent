const tools = new Map();

const registerTool = (tool) => {
    if (!tool?.id) {
        throw new Error("Tool must have an id");
    }

    if (tools.has(tool.id)) {
        throw new Error(`Tool already registered: ${tool.id}`);
    }

    tools.set(tool.id, tool);
};

const getTool = (toolId) => {
    return tools.get(toolId);
};

const getAllTools = () => {
    return Array.from(tools.values());
};

module.exports = {
    registerTool,
    getTool,
    getAllTools,
};
