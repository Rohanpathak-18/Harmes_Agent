const Agent = require("../core/agent");

const {
    retrieveContext,
} = require("../../memory/services/rag.service");

class ContextAgent extends Agent {
    constructor() {
        super({
            id: "context-agent",
            name: "Context Retrieval Agent",
            capabilities: [
                "memory.read",
                "research.retrieve",
            ],
        });
    }

    async execute(context) {
        if (!context.query) {
            throw new Error(
                "Context Agent requires a query"
            );
        }

        const results =
            await retrieveContext({
                query: context.query,
                limit: context.limit || 5,
            });

        return {
            agent: this.id,
            success: true,
            query: context.query,
            results,
        };
    }
}

module.exports = ContextAgent;