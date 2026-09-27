const path = require("path");
const mongoose = require("../server/node_modules/mongoose");

require("dotenv").config({
    path: path.resolve(__dirname, "../server/.env"),
});

const ResearchPack = require("../server/src/models/ResearchPack");

const {
    indexResearchPack,
} = require("./services/indexResearch.service");

const run = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        const researchPack =
            await ResearchPack.findOne()
                .sort({ createdAt: -1 });

        if (!researchPack) {
            throw new Error(
                "No Research Pack found in MongoDB"
            );
        }

        console.log(
            "\nResearch Pack found:"
        );

        console.log(
            researchPack._id.toString()
        );

        console.log(
            "Sources:",
            researchPack.sources.length
        );

        console.log(
            "\nStarting indexing...\n"
        );

        const result =
            await indexResearchPack(
                researchPack._id
            );

        console.log(
            "\nIndexing completed successfully:"
        );

        console.dir(result, {
            depth: null,
        });
    } catch (error) {
        console.error(
            "\nIndexing failed:"
        );

        console.error(
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
};

run();