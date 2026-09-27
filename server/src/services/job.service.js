const Job = require("../models/Job");

const createJob = async ({
    userId,
    organizationId,
    objective,
    priority = "normal",
}) => {
    const job = await Job.create({
        user: userId,
        organization: organizationId,
        objective,
        priority,
        status: "DISCOVERED",
    });

    return job;
};

const getJobById = async (jobId, userId) => {
    return Job.findOne({
        _id: jobId,
        user: userId,
    });
};

const getUserJobs = async (userId) => {
    return Job.find({
        user: userId,
    }).sort({
        createdAt: -1,
    });
};

module.exports = {
    createJob,
    getJobById,
    getUserJobs,
};