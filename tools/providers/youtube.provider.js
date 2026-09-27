const publishVideo = async ({
    title,
    description,
    videoUrl,
}) => {
    if (!title) {
        throw new Error("YouTube title is required");
    }

    if (!videoUrl) {
        throw new Error("Video URL is required");
    }

    // Provider integration will be added here.
    // For now this is a safe mock.

    return {
        success: true,
        provider: "youtube",
        externalId: `mock_${Date.now()}`,
        url: videoUrl,
        title,
        description,
        status: "published",
    };
};

module.exports = {
    publishVideo,
};