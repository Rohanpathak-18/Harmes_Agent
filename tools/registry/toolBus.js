const { getTool } = require("./toolRegistry");
const { executeWithFallback } = require("./providerExecutor");

const executeTool = async (toolId, input, context = {}) => {
    const tool = getTool(toolId);

    if (!tool) {
        throw new Error(`Tool not found: ${toolId}`);
    }

    // Provider-backed tool
    if (tool.capability) {
        return await executeWithFallback(
            tool.capability,
            input,
            context
        );
    }

    // Normal internal tool
    return await tool.execute(input, context);
};

module.exports = {
    executeTool,
};