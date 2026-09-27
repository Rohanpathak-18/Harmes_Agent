const { getTool } = require("./toolRegistry");

const executeTool = async (toolId, input, context = {}) => {
    const tool = getTool(toolId);

    if (!tool) {
        throw new Error(`Tool not found: ${toolId}`);
    }

    return await tool.execute(input, context);
};

module.exports = {
    executeTool,
};