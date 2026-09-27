const {
    retrieveRelevantChunks,
} = require("./retriever.service");

const retrieveContext = async ({
    query,
    limit = 5,
}) => {
    const results =
        await retrieveRelevantChunks({
            query,
            limit,
        });

    return results.map((result) => ({
        content: result.content,
        sourceTitle: result.sourceTitle,
        sourceUrl: result.sourceUrl,
        score: result.score,
    }));
};

module.exports = {
    retrieveContext,
};