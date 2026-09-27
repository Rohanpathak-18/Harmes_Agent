const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },

        comment: {
            type: String,
            default: "",
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        rejectedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model("Approval", approvalSchema);