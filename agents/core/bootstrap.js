const { registerAgent } = require("./registry");

const ResearchAgent = require("../research/research.agent");

const ContextAgent = require("../research/context.agent");

const MasterAgent = require("./master.agent");

const ContentPlannerAgent = require("../content/planner.agent");

const WriterAgent = require("../content/writer.agent");

const ProductionAgent = require("../production/production.agent");

const QAAgent = require("../qa/qa.agent");

const PublisherAgent = require("../approval/publisher.agent");

const qaAgent = new QAAgent();

const researchAgent = new ResearchAgent();

const contextAgent = new ContextAgent();

const masterAgent = new MasterAgent();

const contentPlannerAgent = new ContentPlannerAgent();

const writerAgent = new WriterAgent();

const productionAgent = new ProductionAgent();

registerAgent(researchAgent);
registerAgent(contextAgent);
registerAgent(masterAgent);
registerAgent(contentPlannerAgent);
registerAgent(writerAgent);
registerAgent(productionAgent);
registerAgent(qaAgent);
registerAgent(
    new PublisherAgent()
);

module.exports = {
  researchAgent,
  contextAgent,
  masterAgent,
  contentPlannerAgent,
  writerAgent,
  productionAgent,
  qaAgent,
};
