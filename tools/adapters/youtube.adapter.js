const {
    publishVideo,
} = require("../providers/youtube.provider");

const youtubeAdapter = {
    id: "youtube-publish",

    capability: "youtube.publish",

    async execute(input) {
        if (!input?.title) {
            throw new Error(
                "YouTube title is required"
            );
        }

        return await publishVideo({
            title: input.title,
            description: input.description || "",
            videoUrl: input.videoUrl,
        });
    },
};

module.exports = youtubeAdapter;