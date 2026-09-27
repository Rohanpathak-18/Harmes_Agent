const Agent = require("../core/agent");

const Video =
    require("../../server/src/models/Video");

const Script =
    require("../../server/src/models/Script");

const {
    saveQAResult,
} = require("../../server/src/services/qa.service");

class QAAgent extends Agent {
    constructor() {
        super({
            id: "qa-agent",

            name: "QA and Compliance Agent",

            capabilities: [
                "content.validate",
                "compliance.check",
                "quality.check",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "QA Agent requires jobId"
            );
        }

        const video =
            await Video.findOne({
                job: context.jobId,
            });

        if (!video) {
            throw new Error(
                "Video not found for QA"
            );
        }

        const script =
            await Script.findOne({
                job: context.jobId,
            });

        if (!script) {
            throw new Error(
                "Script not found for QA"
            );
        }

        const checks = [];
        const issues = [];
        const warnings = [];

        // 1. Title check
        const titlePassed =
            Boolean(
                video.title &&
                video.title.trim().length >= 5
            );

        checks.push({
            name: "title",
            passed: titlePassed,
            message: titlePassed
                ? "Title is valid"
                : "Title is missing or too short",
        });

        if (!titlePassed) {
            issues.push(
                "Video title is missing or too short"
            );
        }

        // 2. Script check
        const scriptPassed =
            Boolean(
                script.fullText &&
                script.fullText.trim().length >= 100
            );

        checks.push({
            name: "script",
            passed: scriptPassed,
            message: scriptPassed
                ? "Script is present"
                : "Script is missing or too short",
        });

        if (!scriptPassed) {
            issues.push(
                "Script is missing or too short"
            );
        }

        // 3. Scenes check
        const scenesPassed =
            Array.isArray(video.scenes) &&
            video.scenes.length > 0;

        checks.push({
            name: "scenes",
            passed: scenesPassed,
            message: scenesPassed
                ? "Video contains scenes"
                : "No scenes found",
        });

        if (!scenesPassed) {
            issues.push(
                "Video has no scenes"
            );
        }

        // 4. Asset check
        const assetsPassed =
            Array.isArray(video.scenes) &&
            video.scenes.every(
                (scene) =>
                    Boolean(scene.assetId)
            );

        checks.push({
            name: "assets",
            passed: assetsPassed,
            message: assetsPassed
                ? "All scenes have assets"
                : "One or more scenes are missing assets",
        });

        if (!assetsPassed) {
            issues.push(
                "One or more scenes are missing assets"
            );
        }

        // 5. CTA warning
        if (
            !script.callToAction ||
            !script.callToAction.trim()
        ) {
            warnings.push(
                "No call-to-action found"
            );
        }

        checks.push({
            name: "cta",
            passed:
                Boolean(
                    script.callToAction &&
                    script.callToAction.trim()
                ),
            message:
                script.callToAction
                    ? "CTA present"
                    : "CTA not present",
        });

        // 6. Basic originality/content safety signal
        const suspiciousPatterns = [
            "copy this article",
            "reupload this video",
            "scrape and upload",
        ];

        const text =
            `${script.fullText} ${script.title}`
                .toLowerCase();

        const suspicious =
            suspiciousPatterns.some(
                (pattern) =>
                    text.includes(pattern)
            );

        checks.push({
            name: "originality",
            passed: !suspicious,
            message: suspicious
                ? "Potential reuse instruction detected"
                : "No obvious reuse instruction detected",
        });

        if (suspicious) {
            issues.push(
                "Potential content reuse detected"
            );
        }

        const passed =
            issues.length === 0;

        const score =
            Math.round(
                (checks.filter(
                    (check) =>
                        check.passed
                ).length /
                    checks.length) *
                    100
            );

        const qaResult =
            await saveQAResult({
                jobId: context.jobId,

                videoId: video._id,

                passed,

                score,

                checks,

                issues,

                warnings,
            });

        return {
            agent: this.id,

            success: true,

            passed,

            score,

            qaResultId:
                qaResult._id,

            checks,

            issues,

            warnings,
        };
    }
}

module.exports = QAAgent;