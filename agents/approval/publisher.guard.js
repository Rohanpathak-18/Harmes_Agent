const Job =
    require("../../server/src/models/Job");

const Approval =
    require("../../server/src/models/Approval");

const requireApprovedJob = async (
    jobId
) => {
    const job =
        await Job.findById(jobId);

    if (!job) {
        throw new Error(
            "Job not found"
        );
    }

    const approval =
        await Approval.findOne({
            job: job._id,
            status: "approved",
        });

    if (!approval) {
        throw new Error(
            "Publishing blocked: job requires human approval"
        );
    }

    if (job.status !== "SCHEDULED") {
        throw new Error(
            `Publishing blocked: job must be SCHEDULED, current status is ${job.status}`
        );
    }

    return job;
};

module.exports = {
    requireApprovedJob,
};