const Job =
    require("../../server/src/models/Job");

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

    if (job.status !== "APPROVED") {
        throw new Error(
            "Publishing blocked: job requires human approval"
        );
    }

    return job;
};

module.exports = {
    requireApprovedJob,
};