const ContentPlan = require("../models/ContentPlan");
const Script = require("../models/Script");

const createContentPlan = async ({
    jobId,
    objective,
    plan,
}) => {
    return await ContentPlan.findOneAndUpdate(
        { job: jobId },
        {
            job: jobId,
            objective,
            title: plan.title || "",
            angle: plan.angle || "",
            audience: plan.audience || "",
            format: plan.format || "youtube",
            outline: plan.outline || [],
            keywords: plan.keywords || [],
            status: "ready",
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );
};

const createScript = async ({
    jobId,
    contentPlanId,
    script,
}) => {
    return await Script.findOneAndUpdate(
        { job: jobId },
        {
            job: jobId,
            contentPlan: contentPlanId,
            title: script.title || "",
            hook: script.hook || "",
            introduction:
                script.introduction || "",
            sections: script.sections || [],
            conclusion:
                script.conclusion || "",
            callToAction:
                script.callToAction || "",
            fullText:
                script.fullText || "",
            status: "ready",
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );
};

module.exports = {
    createContentPlan,
    createScript,
};