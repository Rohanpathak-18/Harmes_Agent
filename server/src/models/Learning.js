const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "performance",
                "content",
                "audience",
                "topic",
                "failure",
            ],
            required: true,
        },

        insight: {
            type: String,
            required: true,
        },

        recommendation: {
            type: String,
            default: "",
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.5,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Learning",
    learningSchema
);