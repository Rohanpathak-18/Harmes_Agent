const QAResult =
    require("../models/QAResult");

const saveQAResult = async ({
    jobId,
    videoId,
    passed,
    score,
    checks,
    issues,
    warnings,
}) => {
    return await QAResult.findOneAndUpdate(
        {
            job: jobId,
        },
        {
            job: jobId,
            video: videoId,
            passed,
            score,
            checks,
            issues,
            warnings,
            status: passed
                ? "passed"
                : issues.length
                ? "failed"
                : "needs_review",
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );
};

module.exports = {
    saveQAResult,
};