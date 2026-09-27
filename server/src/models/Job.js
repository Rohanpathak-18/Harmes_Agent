const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        objective: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },

        status: {
            type: String,
            enum: [
                "DISCOVERED",
                "RESEARCHING",
                "RESEARCH_READY",
                "SCRIPTING",
                "PRODUCTION",
                "FINAL_QA",
                "WAITING_APPROVAL",
                "APPROVED",
                "SCHEDULED",
                "PUBLISHED",
                "ANALYZING",
                "LEARNED",
                "FAILED",
                "CANCELLED",
            ],
            default: "DISCOVERED",
        },

        priority: {
            type: String,
            enum: ["low", "normal", "high"],
            default: "normal",
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        error: {
            message: {
                type: String,
                default: null,
            },

            code: {
                type: String,
                default: null,
            },
        },

        startedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);