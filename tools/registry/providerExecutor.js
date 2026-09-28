const { getProviders } = require("./toolRegistry");

const executeWithFallback = async (capability, input, context = {}) => {
    const providers = getProviders(capability)
        .filter((provider) => provider.enabled !== false)
        .sort((a, b) => (a.priority || 999) - (b.priority || 999));

    if (!providers.length) {
        throw new Error(
            `No enabled providers available for capability: ${capability}`
        );
    }

    let lastError = null;

    for (const provider of providers) {
        try {
            console.log(
                `Trying provider: ${provider.id} for ${capability}`
            );

            const result = await provider.execute(input, context);

            console.log(`Provider ${provider.id} succeeded`);

            return {
                ...result,
                provider: provider.id,
            };
        } catch (error) {
            console.error(
                `Provider ${provider.id} failed:`,
                error.message
            );

            lastError = error;
        }
    }

    throw new Error(
        `All providers failed for capability: ${capability}. ` +
        `Last error: ${lastError?.message || "Unknown error"}`
    );
};

module.exports = {
    executeWithFallback,
};