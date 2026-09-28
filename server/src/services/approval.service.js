const Approval = require("../models/Approval");
const Job = require("../models/Job");

const createApproval = async ({ jobId, userId }) => {
    return await Approval.findOneAndUpdate(
        { job: jobId },
        {
            job: jobId,
            user: userId,
            status: "pending",
        },
        {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
        }
    );
};

const approveJob = async ({
    jobId,
    userId,
    comment = "",
}) => {
    const approval = await Approval.findOneAndUpdate(
        {
            job: jobId,
            user: userId,
        },
        {
            status: "approved",
            comment,
            approvedAt: new Date(),
        },
        {
            returnDocument: "after",
        }
    );

    if (!approval) {
        throw new Error("Approval request not found");
    }

    const job = await Job.findOneAndUpdate(
        {
            _id: jobId,
            user: userId,
            status: "WAITING_APPROVAL",
        },
        {
            status: "APPROVED",
        },
        {
            returnDocument: "after",
        }
    );

    if (!job) {
        throw new Error(
            "Job cannot be approved from its current state"
        );
    }

    return {
        approval,
        job,
    };
};

const rejectJob = async ({
    jobId,
    userId,
    comment = "",
}) => {
    const approval = await Approval.findOneAndUpdate(
        {
            job: jobId,
            user: userId,
        },
        {
            status: "rejected",
            comment,
            rejectedAt: new Date(),
        },
        {
            returnDocument: "after",
        }
    );

    if (!approval) {
        throw new Error("Approval request not found");
    }

    const job = await Job.findOneAndUpdate(
        {
            _id: jobId,
            user: userId,
            status: "WAITING_APPROVAL",
        },
        {
            status: "FINAL_QA",
        },
        {
            returnDocument: "after",
        }
    );

    return {
        approval,
        job,
    };
};

const getApproval = async ({
    jobId,
    userId,
}) => {
    return await Approval.findOne({
        job: jobId,
        user: userId,
    });
};

module.exports = {
    createApproval,
    approveJob,
    rejectJob,
    getApproval,
};