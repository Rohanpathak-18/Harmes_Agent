const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../server/.env"),
});

const {
    retrieveRelevantChunks,
} = require("./services/retriever.service");

const run = async () => {
    try {
        console.log(
            "Starting retrieval...\n"
        );

        const results =
            await retrieveRelevantChunks({
                query:
                    "What are the latest opportunities in technology content?",
                limit: 3,
            });

        if (!results.length) {
            console.log(
                "No relevant chunks found."
            );

            return;
        }

        console.log(
            "\nRetrieved chunks:\n"
        );

        results.forEach(
            (result, index) => {
                console.log(
                    `--- Result ${index + 1} ---`
                );

                console.log(
                    "Source:",
                    result.sourceTitle
                );

                console.log(
                    "URL:",
                    result.sourceUrl
                );

                console.log(
                    "Score:",
                    result.score
                );

                console.log(
                    "Content:",
                    result.content
                );

                console.log("");
            }
        );
    } catch (error) {
        console.error(
            "\nRetrieval failed:"
        );

        console.error(
            error.message
        );
    }
};

run();