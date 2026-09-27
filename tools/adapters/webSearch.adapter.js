const tavilyProvider = require("../providers/tavily.provider");

const webSearchAdapter = {
    id: "web-search",

    capability: "web.search",

    async execute(input) {
        if (!input?.query) {
            throw new Error("Search query is required");
        }

        const result = await tavilyProvider.search({
            query: input.query,
            maxResults: input.maxResults || 5,
        });

        return {
            success: true,
            capability: "web.search",
            provider: "tavily",
            query: input.query,

            results: (result.results || []).map((item) => ({
                title: item.title || "Untitled source",
                url: item.url || "",
                snippet: item.snippet || "",
                content: item.content || item.snippet || "",
            })),
        };
    },
};

module.exports = webSearchAdapter;