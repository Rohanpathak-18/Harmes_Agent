const mongoose = require("mongoose");

const scriptSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true,
        },

        contentPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContentPlan",
            required: true,
        },

        title: {
            type: String,
            default: "",
        },

        hook: {
            type: String,
            default: "",
        },

        introduction: {
            type: String,
            default: "",
        },

        sections: {
            type: [
                {
                    heading: String,
                    narration: String,
                },
            ],
            default: [],
        },

        conclusion: {
            type: String,
            default: "",
        },

        callToAction: {
            type: String,
            default: "",
        },

        fullText: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "draft",
                "ready",
                "approved",
            ],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Script",
        scriptSchema
    );