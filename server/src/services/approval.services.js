const Approval = require("../models/Approval");

const createApproval = async ({
    jobId,
    userId,
}) => {
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
        }
    );
};

const approveJob = async ({
    jobId,
    userId,
    comment = "",
}) => {
    return await Approval.findOneAndUpdate(
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
};

const rejectJob = async ({
    jobId,
    userId,
    comment = "",
}) => {
    return await Approval.findOneAndUpdate(
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