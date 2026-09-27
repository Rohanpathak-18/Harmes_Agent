const Agent = require("./agent");

const {
    executeTool,
} = require("../../tools/registry/toolBus");

class MasterAgent extends Agent {
    constructor() {
        super({
            id: "master-agent",

            name: "Hermes Master Agent",

            capabilities: [
                "objective.analyze",
                "workflow.plan",
                "llm.generate",
            ],
        });
    }

    async execute(context) {
        if (!context.objective) {
            throw new Error(
                "Master Agent requires an objective"
            );
        }

        const prompt = `
You are Hermes, an AI content operating system.

Analyze the user's objective and create a concise execution plan.

Objective:
${context.objective}

Return ONLY valid JSON in this format:

{
  "goal": "clear goal",
  "researchRequired": true,
  "steps": [
    {
      "type": "research",
      "description": "what needs to be researched"
    },
    {
      "type": "content",
      "description": "what content needs to be created"
    },
    {
      "type": "qa",
      "description": "what needs to be validated"
    }
  ]
}

Do not execute tools.
Do not publish anything.
Only create the plan.
`;

        const result =
            await executeTool(
                "llm-generate",
                {
                    prompt,
                    maxTokens: 1200,
                    temperature: 0.2,
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
            plan = {
                goal: context.objective,
                researchRequired: true,
                steps: [
                    {
                        type: "research",
                        description:
                            context.objective,
                    },
                ],
                raw: result.text,
            };
        }

        return {
            agent: this.id,
            success: true,
            objective: context.objective,
            plan,
        };
    }
}

module.exports = MasterAgent;