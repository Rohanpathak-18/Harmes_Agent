const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const {
    createContentPlan,
} = require("../../server/src/services/content.service");

class ContentPlannerAgent extends Agent {
    constructor() {
        super({
            id: "content-planner-agent",

            name: "Content Planning Agent",

            capabilities: [
                "content.plan",
                "llm.generate",
                "content.write",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "Content Planner requires jobId"
            );
        }

        if (!context.objective) {
            throw new Error(
                "Content Planner requires objective"
            );
        }

        const prompt = `
Create a YouTube content plan.

Objective:
${context.objective}

Research context:
${JSON.stringify(
    context.research || []
)}

Return ONLY valid JSON:

{
  "title": "video title",
  "angle": "unique editorial angle",
  "audience": "target audience",
  "format": "youtube",
  "outline": [
    "section 1",
    "section 2",
    "section 3"
  ],
  "keywords": [
    "keyword1",
    "keyword2"
  ]
}
`;

        const result =
            await executeTool(
                "llm-generate",
                {
                    prompt,
                    maxTokens: 1200,
                    temperature: 0.5,
                }
            );

        let plan;

        try {
            plan = JSON.parse(
                result.text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim()
            );
        } catch {
            throw new Error(
                "LLM returned invalid content plan JSON"
            );
        }

        const contentPlan =
            await createContentPlan({
                jobId: context.jobId,
                objective: context.objective,
                plan,
            });

        return {
            agent: this.id,
            success: true,
            contentPlanId:
                contentPlan._id,
            plan,
        };
    }
}

module.exports =
    ContentPlannerAgent;