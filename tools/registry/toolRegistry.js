const tools = new Map();
const providers = new Map();



const registerTool = (tool) => {
    if (!tool?.id) {
        throw new Error("Tool must have an id");
    }

    if (tools.has(tool.id)) {
        throw new Error(
            `Tool already registered: ${tool.id}`
        );
    }

    tools.set(tool.id, tool);
};

const getTool = (toolId) => {
    return tools.get(toolId);
};

const getAllTools = () => {
    return Array.from(tools.values());
};

/*
|--------------------------------------------------------------------------
| Provider Registry
|--------------------------------------------------------------------------
|
| Providers are registered by capability.
|
| Example:
|
| web.search
|   ├── Tavily
|   ├── Brave
|   └── Serper
|
| llm.generate
|   ├── Hugging Face
|   ├── OpenAI
|   └── Anthropic
|
|--------------------------------------------------------------------------
*/

const registerProvider = ({
    capability,
    provider,
}) => {
    if (!capability) {
        throw new Error(
            "Provider capability is required"
        );
    }

    if (!provider) {
        throw new Error(
            "Provider is required"
        );
    }

    if (!providers.has(capability)) {
        providers.set(capability, []);
    }

    providers
        .get(capability)
        .push(provider);
};

const getProviders = (capability) => {
    return providers.get(capability) || [];
};

const getAllProviders = () => {
    return Array.from(
        providers.entries()
    ).map(
        ([capability, capabilityProviders]) => ({
            capability,
            providers: capabilityProviders,
        })
    );
};

module.exports = {
    // Tools
    registerTool,
    getTool,
    getAllTools,

    // Providers
    registerProvider,
    getProviders,
    getAllProviders,
};