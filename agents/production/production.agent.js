const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const {
    createAsset,
} = require("../../server/src/services/asset.service");

const Video =
    require("../../server/src/models/Video");

class ProductionAgent extends Agent {
    constructor() {
        super({
            id: "production-agent",

            name: "Production Agent",

            capabilities: [
                "media.generate",
                "asset.create",
                "video.assemble",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "Production Agent requires jobId"
            );
        }

        if (!context.script) {
            throw new Error(
                "Production Agent requires script"
            );
        }

        const script = context.script;

        const scenes = [];

        const sections =
            script.sections || [];

        for (
            let i = 0;
            i < sections.length;
            i++
        ) {
            const section =
                sections[i];

            const media =
                await executeTool(
                    "media-generate",
                    {
                        type: "image",
                        prompt:
                            `Create a professional visual for this scene: ${section.narration}`,
                    }
                );

            const asset =
                await createAsset({
                    jobId: context.jobId,

                    type: "image",

                    name:
                        `scene-${i + 1}`,

                    provider:
                        media.provider,

                    metadata: {
                        prompt:
                            media.prompt,

                        scene:
                            i + 1,
                    },
                });

            scenes.push({
                order: i + 1,

                narration:
                    section.narration,

                visualPrompt:
                    media.prompt,

                assetId:
                    asset._id,
            });
        }

        const video =
            await Video.findOneAndUpdate(
                {
                    job: context.jobId,
                },
                {
                    job: context.jobId,

                    script:
                        context.script._id,

                    title:
                        script.title || "Untitled Video",

                    scenes,

                    status: "planned",
                },
                {
                    upsert: true,
                    returnDocument: "after",
                }
            );

        return {
            agent: this.id,

            success: true,

            jobId: context.jobId,

            videoId: video._id,

            assetsCreated:
                scenes.length,

            status: video.status,
        };
    }
}

module.exports =
    ProductionAgent;