const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        snippet: {
            type: String,
            default: "",
        },

        content: {
            type: String,
            default: "",
        },

        provider: {
            type: String,
            default: null,
        },
    },
    { _id: false }
);

const researchPackSchema = new mongoose.Schema(
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

        sources: {
            type: [sourceSchema],
            default: [],
        },

        facts: {
            type: [String],
            default: [],
        },

        claims: {
            type: [String],
            default: [],
        },

        interpretations: {
            type: [String],
            default: [],
        },

        unknowns: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ResearchPack", researchPackSchema);