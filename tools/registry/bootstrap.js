const { registerTool } = require("./toolRegistry");
const webSearchAdapter = require("../adapters/webSearch.adapter");

registerTool(webSearchAdapter);

module.exports = {
    webSearchAdapter,
};