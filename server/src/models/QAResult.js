const mongoose = require("mongoose");

const qaResultSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true,
        },

        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },

        passed: {
            type: Boolean,
            default: false,
        },

        score: {
            type: Number,
            default: 0,
        },

        checks: {
            type: [
                {
                    name: String,
                    passed: Boolean,
                    message: String,
                },
            ],
            default: [],
        },

        issues: {
            type: [String],
            default: [],
        },

        warnings: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "passed",
                "failed",
                "needs_review",
            ],
            default: "needs_review",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "QAResult",
        qaResultSchema
    );