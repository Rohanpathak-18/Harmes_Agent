const {
    generateText,
} = require("../providers/huggingface.provider");

const llmAdapter = {
    id: "llm-generate",

    capability: "llm.generate",

    async execute(input) {
        if (!input?.prompt) {
            throw new Error(
                "LLM prompt is required"
            );
        }

        const text =
            await generateText({
                prompt: input.prompt,
                maxTokens:
                    input.maxTokens || 1000,
                temperature:
                    input.temperature ?? 0.7,
            });

        return {
            success: true,
            capability: "llm.generate",
            text,
        };
    },
};

module.exports = llmAdapter;