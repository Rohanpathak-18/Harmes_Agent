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
    maxTokens = 1000,
    temperature = 0.7,
}) => {
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is missing");
    }

    const result =
        await hf.chatCompletion({
            model: MODEL,

            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],

            max_tokens: maxTokens,
            temperature,
        });

    return (
        result.choices?.[0]?.message?.content ||
        ""
    );
};

module.exports = {
    generateText,
    MODEL,
};