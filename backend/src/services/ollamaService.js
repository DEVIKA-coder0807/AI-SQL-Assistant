const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");

const generateWithOllama = async (prompt, options = {}) => {
  const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: options.model || env.ollamaModel,
      prompt,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.1,
        num_predict: options.numPredict ?? 900
      }
    })
  });

  if (!response.ok) {
    throw new ApiError(502, "Ollama request failed", { status: response.status });
  }

  const data = await response.json();
  return data.response?.trim() || "";
};

const extractSql = (text) => {
  const fenced = text.match(/```sql\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return raw.replace(/^sql\s*/i, "").trim().replace(/;+\s*$/, "");
};

const generateSql = async ({ question, schemaContext, dialect = "PostgreSQL" }) => {
  const prompt = [
    "You are a senior database engineer.",
    `Generate one safe ${dialect} query for the user's request.`,
    "Return only the SQL. Do not include markdown, prose, placeholders, or multiple statements.",
    "Prefer SELECT queries. Never use DROP, TRUNCATE, ALTER, GRANT, REVOKE, or destructive SQL.",
    schemaContext ? `Database schema context:\n${schemaContext}` : "No schema context was provided. Use clear, conventional table and column names.",
    `User request:\n${question}`
  ].join("\n\n");

  return extractSql(await generateWithOllama(prompt));
};

const explainSql = async (sql) => {
  const prompt = [
    "Explain this PostgreSQL query in beginner-friendly language.",
    "Include what it reads, filters, groups, sorts, and returns. Keep it concise.",
    `SQL:\n${sql}`
  ].join("\n\n");

  return generateWithOllama(prompt, { temperature: 0.2, numPredict: 700 });
};

const optimizeSql = async ({ sql, schemaContext }) => {
  const prompt = [
    "You are a PostgreSQL performance advisor.",
    "Suggest practical optimizations for this query. Mention indexes, query rewrites, and risk tradeoffs when relevant.",
    "Return concise bullet points.",
    schemaContext ? `Schema context:\n${schemaContext}` : "No schema context was provided.",
    `SQL:\n${sql}`
  ].join("\n\n");

  return generateWithOllama(prompt, { temperature: 0.2, numPredict: 900 });
};

module.exports = { explainSql, generateSql, generateWithOllama, optimizeSql };
