const { registerTool } = require("./toolRegistry");

const webSearchAdapter = require("../adapters/webSearch.adapter");

const llmAdapter = require("../adapters/llm.adapter");

const mediaAdapter = require("../adapters/media.adapter");
const youtubeAdapter = require("../adapters/youtube.adapter");

registerTool(webSearchAdapter);
registerTool(llmAdapter);
registerTool(mediaAdapter);
registerTool(youtubeAdapter);

require("./providerBootstrap");

module.exports = {
  webSearchAdapter,
  llmAdapter,
  mediaAdapter,
  youtubeAdapter,
};
