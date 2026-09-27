const path = require("path");

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
        const result =
            await executeAgent(
                "context-agent",
                {
                    query:
                        "What are the latest opportunities in technology content?",
                    limit: 3,
                }
            );

        console.log(
            "\nContext Agent Result:\n"
        );

        console.dir(result, {
            depth: null,
        });
    } catch (error) {
        console.error(
            "\nContext Agent failed:"
        );

        console.error(
            error.message
        );
    }
};

run();