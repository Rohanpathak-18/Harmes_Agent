const {
    registerProvider,
} = require("./toolRegistry");

const tavilyProvider = require("../providers/tavily.provider");
const huggingfaceProvider = require("../providers/huggingface.provider");

registerProvider({
    capability: "web.search",
    provider: {
        id: "tavily",
        priority: 1,
        enabled: true,
        execute: tavilyProvider.search,
    },
});

registerProvider({
    capability: "llm.generate",
    provider: {
        id: "huggingface",
        priority: 1,
        enabled: true,
        execute: huggingfaceProvider.generateText,
    },
});

module.exports = {
    tavilyProvider,
    huggingfaceProvider,
};