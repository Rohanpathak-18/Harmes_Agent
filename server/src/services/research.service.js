const ResearchPack = require("../models/ResearchPack");

const createResearchPack = async ({
    jobId,
    objective,
    searchResults,
}) => {
    const sources = (searchResults || []).map((result) => ({
        title: result.title || "Untitled source",

        url: result.url || "",

        snippet: result.snippet || "",

        content: result.content || result.snippet || "",

        provider: result.provider || "tavily",
    }));

    const researchPack = await ResearchPack.findOneAndUpdate(
        { job: jobId },

        {
            job: jobId,
            objective,
            sources,
        },

        {
            new: true,
            upsert: true,
        }
    );

    return researchPack;
};

module.exports = {
    createResearchPack,
};