const path = require("path");
const mongoose = require("../server/node_modules/mongoose");

require("dotenv").config({
    path: path.resolve(__dirname, "../server/.env"),
});

// Initialize Hermes tools and agents
require("../tools/registry/bootstrap");
require("../agents/core/bootstrap");

const { executeAgent } = require("../agents/core/runtime");

const run = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        const result = await executeAgent(
            "research-agent",
            {
                jobId: new mongoose.Types.ObjectId(),
                objective:
                    "Find the latest technology content opportunities for a YouTube channel",
            }
        );

        console.log("\nResearch Agent result:\n");

        console.dir(result, {
            depth: null,
        });
    } catch (error) {
        console.error(
            "\nResearch Agent failed:"
        );

        console.error(error.message);

        if (error.response?.data) {
            console.error(
                error.response.data
            );
        }
    } finally {
        await mongoose.disconnect();
    }
};

run();