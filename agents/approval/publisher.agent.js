const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const Job =
    require("../../server/src/models/Job");

const Video =
    require("../../server/src/models/Video");

const Publication =
    require("../../server/src/models/Publication");

const Approval =
    require("../../server/src/models/Approval");

class PublisherAgent extends Agent {
    constructor() {
        super({
            id: "publisher-agent",
            name: "Publisher Agent",
            capabilities: [
                "youtube.publish",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "Publisher Agent requires jobId"
            );
        }

        const job =
            await Job.findById(
                context.jobId
            );

        if (!job) {
            throw new Error(
                "Job not found"
            );
        }

        // HARD APPROVAL GATE
        const approval =
            await Approval.findOne({
                job: job._id,
                status: "approved",
            });

        if (!approval) {
            throw new Error(
                "Publishing blocked: job has not been approved"
            );
        }

        // Publisher should only process scheduled jobs.
        if (job.status !== "SCHEDULED") {
            throw new Error(
                `Publishing blocked: job must be SCHEDULED, current status is ${job.status}`
            );
        }

        const video =
            await Video.findOne({
                job: job._id,
            });

        if (!video) {
            throw new Error(
                "Video not found"
            );
        }

        const result =
            await executeTool(
                "youtube-publish",
                {
                    title: video.title,
                    description:
                        video.description,
                    videoUrl:
                        video.outputUrl ||
                        "mock-video-url",
                }
            );

        const publication =
            await Publication.findOneAndUpdate(
                {
                    job: job._id,
                    platform: "youtube",
                },
                {
                    job: job._id,
                    video: video._id,
                    platform: "youtube",
                    status: "published",
                    publishedAt: new Date(),
                    externalId:
                        result.externalId,
                    url: result.url,
                },
                {
                    upsert: true,
                    returnDocument: "after",
                }
            );

        job.status = "PUBLISHED";
        job.completedAt = new Date();

        await job.save();

        return {
            agent: this.id,
            success: true,
            jobId: job._id,
            publicationId:
                publication._id,
            externalId:
                result.externalId,
            status: "PUBLISHED",
        };
    }
}

module.exports = PublisherAgent;