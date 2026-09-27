const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },

        platform: {
            type: String,
            enum: ["youtube"],
            required: true,
        },

        status: {
            type: String,
            enum: [
                "queued",
                "publishing",
                "published",
                "failed",
            ],
            default: "queued",
        },

        scheduledAt: {
            type: Date,
            default: null,
        },

        publishedAt: {
            type: Date,
            default: null,
        },

        externalId: {
            type: String,
            default: "",
        },

        url: {
            type: String,
            default: "",
        },

        error: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

publicationSchema.index({
    job: 1,
    platform: 1,
});

module.exports =
    mongoose.model(
        "Publication",
        publicationSchema
    );