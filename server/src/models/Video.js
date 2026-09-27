const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true,
        },

        script: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Script",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        scenes: {
            type: [
                {
                    order: Number,
                    narration: String,
                    visualPrompt: String,
                    assetId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Asset",
                        default: null,
                    },
                },
            ],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "planned",
                "assembling",
                "rendered",
                "failed",
            ],
            default: "planned",
        },

        outputUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model("Video", videoSchema);