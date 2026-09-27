const ResearchPack = require("../../server/src/models/ResearchPack");

const {
    chunkText,
} = require("./researchMemory.service");

const {
    embedText,
} = require("../embeddings/embedding.service");

const {
    getDatabase,
} = require("../vectorstore/vectorStore.service");

const indexResearchPack = async (researchPackId) => {
    const researchPack =
        await ResearchPack.findById(
            researchPackId
        ).lean();

    if (!researchPack) {
        throw new Error(
            "Research Pack not found"
        );
    }

    const records = [];

    for (const source of researchPack.sources) {
        const content =
            source.content ||
            source.snippet ||
            "";

        const chunks = chunkText(content);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            console.log(
                `Embedding chunk ${i + 1}/${chunks.length}`
            );

            const vector =
                await embedText(chunk);

            records.push({
                id: `${researchPack._id}-${records.length}`,

                jobId: String(
                    researchPack.job
                ),

                researchPackId: String(
                    researchPack._id
                ),

                sourceUrl: source.url,

                sourceTitle: source.title,

                content: chunk,

                vector,
            });
        }
    }

    if (records.length === 0) {
        throw new Error(
            "No content available to index"
        );
    }

    const db = await getDatabase();

    const tables = await db.tableNames();

    if (tables.includes("research_memory")) {
        await db.dropTable(
            "research_memory"
        );
    }

    await db.createTable(
        "research_memory",
        records
    );

    return {
        success: true,

        researchPackId,

        chunksIndexed: records.length,
    };
};

module.exports = {
    indexResearchPack,
};