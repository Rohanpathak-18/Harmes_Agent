const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        platform: {
            type: String,
            enum: ["youtube"],
            required: true,
        },

        externalId: {
            type: String,
            default: "",
        },

        views: {
            type: Number,
            default: 0,
        },

        likes: {
            type: Number,
            default: 0,
        },

        comments: {
            type: Number,
            default: 0,
        },

        shares: {
            type: Number,
            default: 0,
        },

        watchTime: {
            type: Number,
            default: 0,
        },

        retention: {
            type: Number,
            default: 0,
        },

        ctr: {
            type: Number,
            default: 0,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        collectedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Analytics",
    analyticsSchema
);