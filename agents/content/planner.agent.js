const Agent = require("../core/agent");

const { executeTool } = require("../../tools/registry/toolBus");

const {
  createContentPlan,
} = require("../../server/src/services/content.service");

class ContentPlannerAgent extends Agent {
  constructor() {
    super({
      id: "content-planner-agent",

      name: "Content Planning Agent",

      capabilities: ["content.plan", "llm.generate", "content.write"],
    });
  }

  async execute(context) {
    if (!context.jobId) {
      throw new Error("Content Planner requires jobId");
    }

    if (!context.objective) {
      throw new Error("Content Planner requires objective");
    }

    const prompt = `
You are a professional YouTube content strategist.

Create a YouTube content plan for this objective:

${context.objective}

Research context:
${JSON.stringify(context.research || [])}

IMPORTANT:
- Return ONLY a valid JSON object.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT add explanations before or after the JSON.
- Use double quotes for all JSON keys and string values.
- Do not include trailing commas.

Required JSON structure:

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

    const result = await executeTool("llm-generate", {
      prompt,

      maxTokens: 2000,

      temperature: 0.2,

      reasoningEffort: "low",

      responseFormat: {
        type: "json_object",
      },
    });

    if (!result || !result.text) {
      throw new Error("LLM returned empty content plan");
    }

    let rawText = result.text;

    if (typeof rawText !== "string") {
      rawText = JSON.stringify(rawText);
    }

    // Remove markdown code fences
    rawText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let plan;

    try {
      // First attempt: direct JSON parsing
      plan = JSON.parse(rawText);
    } catch {
      try {
        // Second attempt:
        // extract JSON object from surrounding text
        const start = rawText.indexOf("{");
        const end = rawText.lastIndexOf("}");

        if (start === -1 || end === -1 || end <= start) {
          throw new Error("No JSON object found in LLM response");
        }

        const jsonText = rawText.slice(start, end + 1);

        plan = JSON.parse(jsonText);
      } catch (error) {
        console.error("[CONTENT PLANNER] Invalid LLM response:");

        console.error(rawText);

        throw new Error(
          `LLM returned invalid content plan JSON: ${error.message}`,
        );
      }
    }

    // Validate required fields
    if (
      !plan.title ||
      !plan.angle ||
      !plan.audience ||
      !plan.format ||
      !Array.isArray(plan.outline) ||
      !Array.isArray(plan.keywords)
    ) {
      throw new Error("LLM content plan is missing required fields");
    }

    const contentPlan = await createContentPlan({
      jobId: context.jobId,
      objective: context.objective,
      plan,
    });

    return {
      agent: this.id,
      success: true,
      contentPlanId: contentPlan._id,
      plan,
    };
  }
}

module.exports = ContentPlannerAgent;
