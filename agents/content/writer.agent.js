const Agent = require("../core/agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

const {
    createScript,
} = require("../../server/src/services/content.service");

class WriterAgent extends Agent {
    constructor() {
        super({
            id: "writer-agent",

            name: "Script Writer Agent",

            capabilities: [
                "content.write",
                "llm.generate",
            ],
        });
    }

    async execute(context) {
        if (!context.jobId) {
            throw new Error(
                "Writer Agent requires jobId"
            );
        }

        if (!context.contentPlan) {
            throw new Error(
                "Writer Agent requires content plan"
            );
        }

        const prompt = `
Write a high-quality YouTube script.

Content plan:
${JSON.stringify(
    context.contentPlan
)}

Research context:
${JSON.stringify(
    context.research || []
)}

Return ONLY valid JSON:

{
  "title": "video title",
  "hook": "strong opening hook",
  "introduction": "introduction",
  "sections": [
    {
      "heading": "section heading",
      "narration": "complete narration"
    }
  ],
  "conclusion": "conclusion",
  "callToAction": "natural CTA",
  "fullText": "complete script"
}

Do not invent facts that are not supported by the research context.
`;

        const result =
            await executeTool(
                "llm-generate",
                {
                    prompt,
                    maxTokens: 4000,
                    temperature: 0.6,
                }
            );

        let script;

        try {
            script = JSON.parse(
                result.text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim()
            );
        } catch {
            throw new Error(
                "LLM returned invalid script JSON"
            );
        }

        const savedScript =
            await createScript({
                jobId: context.jobId,
                contentPlanId:
                    context.contentPlan._id,
                script,
            });

        return {
            agent: this.id,
            success: true,
            scriptId:
                savedScript._id,
            script,
        };
    }
}

module.exports = WriterAgent;