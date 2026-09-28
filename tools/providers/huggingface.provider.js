const {
    InferenceClient,
} = require("@huggingface/inference");

const hf = new InferenceClient(
    process.env.HF_TOKEN
);

const MODEL =
    process.env.HF_MODEL ||
    "openai/gpt-oss-20b";

const generateText = async ({
    prompt,
    maxTokens = 2000,
    temperature = 0.3,
    responseFormat = null,
    reasoningEffort = "low",
}) => {
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is missing");
    }

    const request = {
        model: MODEL,

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],

        max_tokens: maxTokens,
        temperature,
        reasoning_effort: reasoningEffort,
    };

    if (responseFormat) {
        request.response_format = responseFormat;
    }

    const result =
        await hf.chatCompletion(request);

    const message =
        result.choices?.[0]?.message;

    const text =
        message?.content?.trim() || "";

    if (!text) {
        console.error(
            "[HUGGINGFACE] Empty LLM content"
        );

        console.error(
            "[HUGGINGFACE] Finish reason:",
            result.choices?.[0]?.finish_reason
        );

        console.error(
            "[HUGGINGFACE] Message keys:",
            Object.keys(message || {})
        );

        throw new Error(
            "Hugging Face returned an empty LLM response"
        );
    }

    return text;
};

module.exports = {
    generateText,
    MODEL,
};