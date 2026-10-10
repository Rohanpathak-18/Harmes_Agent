const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const {
    createResearchPack,
} = require("../../server/src/services/research.service");

class ResearchAgent extends Agent {
    constructor() {
        super({
            id: "research-agent",

            name: "Research Agent",

            capabilities: [
                "research.read",
                "sources.collect",
                "web.search",
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

        console.log(`[RESEARCH] Searching sources for job ${context.jobId}`);
        const searchResult =
            await executeTool(
                "web-search",
                {
                    query: context.objective,
                    maxResults: 5,
                }
            );

        console.log(`[RESEARCH] Saving ${searchResult.results.length} sources for job ${context.jobId}`);
        const researchPack =
            await createResearchPack({
                jobId: context.jobId,

                objective:
                    context.objective,

                searchResults:
                    searchResult.results,
            });

        return {
            agent: this.id,

            success: true,

            jobId: context.jobId,

            researchPackId:
                researchPack._id,

            sourcesFound: researchPack.sources.length,
        };
    }
}

module.exports = ResearchAgent;
