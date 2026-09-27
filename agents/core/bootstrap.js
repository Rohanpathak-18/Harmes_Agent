const { registerAgent } = require("./registry");
const ResearchAgent = require("../research/research.agent");

const researchAgent = new ResearchAgent();

registerAgent(researchAgent);

module.exports = {
    researchAgent,
};