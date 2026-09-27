const path = require("path");
const mongoose = require("../server/node_modules/mongoose");

require("dotenv").config({
    path: path.resolve(
        __dirname,
        "../server/.env"
    ),
});

require("../tools/registry/bootstrap");
require("../agents/core/bootstrap");

const {
    executeAgent,
} = require("../agents/core/runtime");

const Video =
    require("../server/src/models/Video");

const run = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected\n"
        );

        // Find a job that actually has a generated video
        const video =
            await Video.findOne()
                .sort({
                    createdAt: -1,
                });

        if (!video) {
            throw new Error(
                "No Video found. Run test-production-agent.js first."
            );
        }

        console.log(
            "Testing Job:",
            video.job.toString()
        );

        console.log(
            "Testing Video:",
            video._id.toString()
        );

        const result =
            await executeAgent(
                "qa-agent",
                {
                    jobId: video.job,
                }
            );

        console.log(
            "\nQA Result:\n"
        );

        console.dir(result, {
            depth: null,
        });
    } catch (error) {
        console.error(
            "\nQA failed:"
        );

        console.error(
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
};

run();