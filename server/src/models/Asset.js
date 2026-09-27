const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "image",
                "video",
                "audio",
                "voiceover",
                "music",
                "thumbnail",
            ],
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        provider: {
            type: String,
            default: null,
        },

        url: {
            type: String,
            default: "",
        },

        storageKey: {
            type: String,
            default: "",
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        status: {
            type: String,
            enum: [
                "requested",
                "processing",
                "completed",
                "failed",
            ],
            default: "requested",
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

assetSchema.index({
    job: 1,
    type: 1,
});

module.exports =
    mongoose.model("Asset", assetSchema);