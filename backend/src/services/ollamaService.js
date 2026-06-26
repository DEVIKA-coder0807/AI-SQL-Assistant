const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");

// ✅ Timeout wrapper
const fetchWithTimeout = (url, options, timeoutMs = 60000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

// ✅ Core Ollama caller with retry
const generateWithOllama = async (prompt, options = {}) => {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`=== OLLAMA ATTEMPT ${attempt} ===`);

      const response = await fetchWithTimeout(
        `${env.ollamaBaseUrl}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: options.model || env.ollamaModel,
            prompt,
            stream: false,
            options: {
              temperature: options.temperature ?? 0.1,
              num_predict: options.numPredict ?? 1200,
            },
          }),
        },
        options.timeoutMs || 90000
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new ApiError(502, `Ollama error: ${errText}`, {
          status: response.status,
        });
      }

      const data = await response.json();
      const result = data.response?.trim() || "";

      if (!result) {
        throw new ApiError(502, "Ollama returned empty response");
      }

      console.log("=== OLLAMA SUCCESS ===");
      return result;

    } catch (err) {
      lastError = err;

      if (err.name === "AbortError") {
        console.error(`Ollama timeout on attempt ${attempt}`);
        lastError = new ApiError(504, "AI service timed out. Please try again.");
      } else {
        console.error(`Ollama attempt ${attempt} failed:`, err.message);
      }

      // Don't retry on last attempt
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw lastError;
};

// ✅ SQL extractor
const extractSql = (text) => {
  const fenced =
    text.match(/```sql\s*([\s\S]*?)```/i) ||
    text.match(/```\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return raw.replace(/^sql\s*/i, "").trim().replace(/;+\s*$/, "");
};

// ✅ Generate SQL — only existing tables/columns
const generateSql = async ({ question, schemaContext, dialect = "MySQL" }) => {
  if (!schemaContext) {
    throw new ApiError(400, "Schema context is required to generate accurate SQL. Please provide your table structure.");
  }

  const prompt = `You are an expert MySQL SQL engineer.

STRICT RULES:
- Use ONLY the tables and columns defined in the schema below.
- Do NOT invent or assume any table or column names.
- Generate exactly ONE valid MySQL SELECT query.
- Return ONLY the raw SQL query.
- No explanations, no markdown, no \`\`\`sql blocks.
- End with semicolon removed.

DATABASE SCHEMA:
${schemaContext}

USER REQUEST:
${question}

SQL:`;

  const raw = await generateWithOllama(prompt, {
    temperature: 0.05,
    numPredict: 500,
    timeoutMs: 60000,
  });

  return extractSql(raw);
};

// ✅ Explain SQL
const explainSql = async (sql) => {
  const prompt = `You are a SQL teacher. Explain this MySQL query briefly.

# Purpose
What does this query do? (2 sentences max)

# Tables & Columns
Which tables and columns are used?

# Conditions
Any WHERE conditions or filters?

# Example Result
Show 3 sample rows in a markdown table.

SQL:
${sql}`;

  return generateWithOllama(prompt, {
    temperature: 0.2,
    numPredict: 800,
    timeoutMs: 60000,
  });
};

// ✅ Optimize SQL
const optimizeSql = async ({ sql, schemaContext }) => {
  const prompt = `You are an expert MySQL performance advisor.

Analyze this SQL query and provide:

# Performance Issues
List any performance problems.

# Optimization Suggestions
Practical suggestions with indexes, rewrites, and tradeoffs.

# Optimized SQL
\`\`\`sql
-- write optimized query here
\`\`\`

# Why It's Better
Simple bullet points.

${schemaContext ? `Schema:\n${schemaContext}` : "No schema provided."}

SQL:
${sql}`;

  return generateWithOllama(prompt, {
    temperature: 0.2,
    numPredict: 1200,
    timeoutMs: 90000,
  });
};

module.exports = { explainSql, generateSql, generateWithOllama, optimizeSql };
