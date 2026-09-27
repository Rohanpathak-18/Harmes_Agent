const Publication =
    require("../models/Publication");

const Video =
    require("../models/Video");

const {
    requireApprovedJob,
} = require("../../../agents/approval/publisher.guard");

const queuePublication = async ({
    jobId,
}) => {
    const job =
        await requireApprovedJob(jobId);

    const video =
        await Video.findOne({
            job: job._id,
        });

    if (!video) {
        throw new Error(
            "Video not found for publication"
        );
    }

    const existing =
        await Publication.findOne({
            job: job._id,
            platform: "youtube",
        });

    if (existing) {
        return existing;
    }

    const publication =
        await Publication.create({
            job: job._id,
            video: video._id,
            platform: "youtube",
            status: "queued",
        });

    job.status = "SCHEDULED";
    await job.save();

    return publication;
};

const getPublication = async (jobId) => {
    return await Publication.findOne({
        job: jobId,
    });
};

module.exports = {
    queuePublication,
    getPublication,
};