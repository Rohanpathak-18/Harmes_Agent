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

const run = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected\n"
        );

        // Create a temporary test Job ID
        const jobId =
            new mongoose.Types.ObjectId();

        /*
         * STEP 1
         * Create Content Plan
         */

        const contentPlan = {
            _id:
                new mongoose.Types.ObjectId(),

            job: jobId,

            title:
                "Latest Technology Opportunities",

            angle:
                "Explain emerging technology opportunities in a simple and useful way",

            audience:
                "Technology enthusiasts",

            format:
                "youtube",

            outline: [
                "Introduction",
                "Current technology opportunities",
                "Why they matter",
                "Future opportunities",
                "Conclusion",
            ],

            keywords: [
                "technology",
                "AI",
                "future",
                "innovation",
            ],
        };

        console.log(
            "Content Plan created\n"
        );

        /*
         * STEP 2
         * Writer Agent
         */

        console.log(
            "Running Writer Agent...\n"
        );

        const writerResult =
            await executeAgent(
                "writer-agent",
                {
                    jobId,

                    contentPlan,

                    research: [
                        {
                            content:
                                "Artificial intelligence and automation continue to create new opportunities across software, content and business workflows.",
                        },
                    ],
                }
            );

        console.log(
            "Writer Agent Result:\n"
        );

        console.dir(
            writerResult,
            {
                depth: null,
            }
        );

        /*
         * STEP 3
         * Production Agent
         */

        console.log(
            "\nRunning Production Agent...\n"
        );

        const script =
            writerResult.script;

        script._id =
            writerResult.scriptId;

        const productionResult =
            await executeAgent(
                "production-agent",
                {
                    jobId,

                    script,
                }
            );

        console.log(
            "\nProduction Result:\n"
        );

        console.dir(
            productionResult,
            {
                depth: null,
            }
        );

        console.log(
            "\n================================"
        );

        console.log(
            "CONTENT PIPELINE SUCCESS"
        );

        console.log(
            "Writer → Production completed"
        );

        console.log(
            "================================"
        );
    } catch (error) {
        console.error(
            "\nPipeline failed:"
        );

        console.error(
            error.message
        );

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