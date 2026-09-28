const { registerProvider } = require("./toolRegistry");

const tavilyProvider =
    require("../providers/tavily.provider");

const huggingfaceProvider =
    require("../providers/huggingface.provider");

const mediaProvider =
    require("../providers/media.provider");

const youtubeProvider =
    require("../providers/youtube.provider");

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

registerProvider({
    capability: "media.generate",
    provider: {
        id: "mock-media",
        priority: 1,
        enabled: true,
        execute: mediaProvider.generate,
    },
});

registerProvider({
    capability: "youtube.publish",
    provider: {
        id: "youtube",
        priority: 1,
        enabled: true,
        execute: youtubeProvider.publishVideo,
    },
});

module.exports = {
    tavilyProvider,
    huggingfaceProvider,
    mediaProvider,
    youtubeProvider,
};