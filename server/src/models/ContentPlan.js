const mongoose = require("mongoose");

const contentPlanSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true,
        },

        objective: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            default: "",
        },

        angle: {
            type: String,
            default: "",
        },

        audience: {
            type: String,
            default: "",
        },

        format: {
            type: String,
            default: "youtube",
        },

        outline: {
            type: [String],
            default: [],
        },

        keywords: {
            type: [String],
            default: [],
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
        "ContentPlan",
        contentPlanSchema
    );