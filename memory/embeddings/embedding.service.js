const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

const embedText = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required for embedding");
  }

  if (!process.env.HF_TOKEN) {
    throw new Error("HF_TOKEN is missing from environment variables");
  }

  const result = await hf.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: text,
  });

  return Array.isArray(result[0]) ? result[0] : result;
};

module.exports = {
  embedText,
  EMBEDDING_MODEL,
};
