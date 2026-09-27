const {
    embedText,
} = require("../embeddings/embedding.service");

const {
    searchResearchVectors,
} = require("../vectorstore/vectorStore.service");

const retrieveRelevantChunks = async ({
    query,
    limit = 5,
}) => {
    if (!query || !query.trim()) {
        throw new Error(
            "Query is required for retrieval"
        );
    }

    // Convert question into a vector
    const queryVector =
        await embedText(query);

    // Search vector database
    const results =
        await searchResearchVectors(
            queryVector,
            limit
        );

    return results.map((result) => ({
        content: result.content,

        sourceTitle:
            result.sourceTitle,

        sourceUrl:
            result.sourceUrl,

        jobId:
            result.jobId,

        researchPackId:
            result.researchPackId,

        score:
            result._distance,
    }));
};

module.exports = {
    retrieveRelevantChunks,
};
