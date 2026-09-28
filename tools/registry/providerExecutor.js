const {
    getProviders,
} = require("./toolRegistry");

const executeWithFallback = async (
    capability,
    input,
    context = {}
) => {
    const providers = getProviders(capability);

    if (!providers.length) {
        throw new Error(
            `No providers available for capability: ${capability}`
        );
    }

    let lastError = null;

    for (const provider of providers) {
        try {
            console.log(
                `Trying provider: ${provider.id}`
            );

            const result = await provider.execute(
                input,
                context
            );

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
        `All providers failed for capability: ${capability}. Last error: ${
            lastError?.message || "Unknown error"
        }`
    );
};

module.exports = {
    executeWithFallback,
};