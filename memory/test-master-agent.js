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
                "master-agent",
                {
                    objective:
                        "Find today's best technology opportunities and create five YouTube videos for my channel",
                }
            );

        console.log(
            "\nMaster Agent Result:\n"
        );

        console.dir(result, {
            depth: null,
        });
    } catch (error) {
        console.error(
            "\nMaster Agent failed:"
        );

        console.error(error.message);

        if (error.response?.data) {
            console.error(
                error.response.data
            );
        }
    }
};

run();