const {
    registerProvider,
} = require("./toolRegistry");

const tavilyProvider = require("../providers/tavily.provider");
const huggingfaceProvider = require("../providers/huggingface.provider");

registerProvider({
    capability: "web.search",
    provider: {
        id: "tavily",
        execute: tavilyProvider.search,
    },
});

registerProvider({
    capability: "llm.generate",
    provider: {
        id: "huggingface",
        execute: huggingfaceProvider.generateText,
    },
});

module.exports = {
    tavilyProvider,
    huggingfaceProvider,
};