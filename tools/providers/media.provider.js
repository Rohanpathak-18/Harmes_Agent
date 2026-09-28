const generate = async ({
    type = "image",
    prompt = "",
    metadata = {},
}) => {
    if (!prompt) {
        throw new Error("Media generation prompt is required");
    }

    console.log(
        `[MEDIA] Generating ${type} asset: ${prompt.slice(0, 100)}`
    );

    return {
        success: true,
        type,
        provider: "mock-media",
        url: `mock://media/${Date.now()}-${type}`,
        prompt,
        metadata,
    };
};

module.exports = {
    generate,
};