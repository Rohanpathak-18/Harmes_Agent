const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const {
    createResearchPack,
} = require("../../server/src/services/research.service");

const {
    indexResearchPack,
} = require("../../memory/services/indexResearch.service");

class ResearchAgent extends Agent {
    constructor() {
        super({
            id: "research-agent",

            name: "Research Agent",

            capabilities: [
                "research.read",
                "sources.collect",
                "web.search",
                "memory.write",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "Research Agent requires a jobId"
            );
        }

        if (!context.objective) {
            throw new Error(
                "Research Agent requires an objective"
            );
        }

        // 1. Search the web
        const searchResult =
            await executeTool(
                "web-search",
                {
                    query: context.objective,
                    maxResults: 5,
                }
            );

        // 2. Create Research Pack
        const researchPack =
            await createResearchPack({
                jobId: context.jobId,

                objective:
                    context.objective,

                searchResults:
                    searchResult.results,
            });

        // 3. Convert research into vectors
        const memoryResult =
            await indexResearchPack(
                researchPack._id
            );

        return {
            agent: this.id,

            success: true,

            jobId: context.jobId,

            researchPackId:
                researchPack._id,

            sourcesFound:
                searchResult.results.length,

            chunksIndexed:
                memoryResult.chunksIndexed,
        };
    }
}

module.exports = ResearchAgent;