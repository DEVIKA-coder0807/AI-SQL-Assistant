const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");

const generateWithOllama = async (prompt, options = {}) => {
  console.log("=== OLLAMA START ===");
  console.log("URL:", `${env.ollamaBaseUrl}/api/generate`);
  console.log("MODEL:", options.model || env.ollamaModel);
  console.log("Before fetch");

  const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model || env.ollamaModel,
      prompt,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.1,
        num_predict: options.numPredict ?? 900,
      },
    }),
  });

  console.log("After fetch");

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Response:", data);

  if (!response.ok) {
    throw new ApiError(502, "Ollama request failed", {
      status: response.status,
    });
  }

  console.log("=== OLLAMA END ===");

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
 const prompt = `
You are an expert SQL teacher.

Explain the following SQL query in simple English so that a beginner can understand it.

Follow this EXACT format and do not skip any section.

# Purpose
Explain in 1-2 sentences what this query does.

# Tables Used
Mention the table(s) used.

# Columns Used
List the columns involved. If * is used, mention that it selects all columns.

# Conditions
Explain every WHERE condition. If none, say "No conditions - all rows are returned."

# SQL Keywords
Explain each keyword used:
- SELECT: what it does
- FROM: what it does
- * (asterisk): what it means if used
- WHERE: what it does if used
- GROUP BY: what it does if used
- ORDER BY: what it does if used
- LIMIT: what it does if used

# Step-by-Step Execution
Explain how the database executes the query step by step.

# Example Table
Show a sample input table with 4-5 rows of realistic fake data.
Use this EXACT markdown table format with pipe characters:

| column1 | column2 | column3 |
|---------|---------|---------|
| value1  | value2  | value3  |
| value1  | value2  | value3  |

# Query Result
Show which rows from the example table would be returned by this query.
Use the same markdown table format.

# Performance Tips
Mention whether an index would help.

SQL:
${sql}

`;

  const result = await generateWithOllama(prompt, {
  temperature: 0.2,
  numPredict: 1500,
});

console.log("EXPLAIN RESULT:");
console.log(result);

return result;
};

const optimizeSql = async ({ sql, schemaContext }) => {
  const prompt = `
You are an expert SQL performance advisor.

Analyze the following SQL query and provide:

# Performance Issues
List any performance problems with this query.

# Optimization Suggestions
Give practical suggestions to improve this query.
Use bullet points.
Mention indexes, query rewrites, and risk tradeoffs.

# Optimized SQL
Write an improved version of the query.
Use this exact format:

\`\`\`sql
-- optimized query here
\`\`\`

# Why It's Better
Explain in simple points why the optimized version is better.

${schemaContext ? `Schema context:\n${schemaContext}` : "No schema context was provided. Use conventional table and column names."}

SQL:
${sql}
`;

  return generateWithOllama(prompt, { temperature: 0.2, numPredict: 1500 });
};

module.exports = { explainSql, generateSql, generateWithOllama, optimizeSql };
