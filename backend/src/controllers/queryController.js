const { prisma } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");
const { explainSql, generateSql, optimizeSql } = require("../services/ollamaService");
const { incrementAnalytics } = require("../services/analyticsService");
const { analyzeImpact, executeSql, validateWithDatabase } = require("../services/queryService");

const generateQuery = asyncHandler(async (req, res) => {
  try {
    console.log("===== GENERATE QUERY START =====");

    const { question, schemaContext, dialect } = req.body;

    console.log("Question:", question);

    const sql = await generateSql({
      question,
      schemaContext,
      dialect,
    });

    console.log("Generated SQL:");
    console.log(sql);
    const explanation = "Explanation will be generated later.";
   



    console.log("Saving history...");
    const history = await prisma.queryHistory.create({
      data: {
        userId: req.user.id,
        prompt: question,
        sql,
        explanation,
        status: "GENERATED",
        metadata: {
          dialect: dialect || "PostgreSQL",
          schemaContextProvided: Boolean(schemaContext),
        },
      },
    });
    
    console.log("History saved");

    await incrementAnalytics(req.user.id, "generated");

    console.log("===== GENERATE QUERY END =====");
    console.log("Sending response...");
    res.status(201).json({
      success: true,
      data: {
        id: history.id,
        sql,
        explanation,
      },
    });
  } catch (err) {
    console.error("===== ERROR =====");
    console.error(err);
    throw err;
  }
});

const explainQuery = asyncHandler(async (req, res) => {
  console.log("Explain API Started");

  const { sql } = req.body;

  const explanation = await explainSql(sql);

  console.log("Explain generated");

  console.log("Sending response...");

  return res.status(200).json({
    success: true,
    data: {
      explanation,
    },
  });
});

const validateQuery = asyncHandler(async (req, res) => {
  const { sql, allowMutation } = req.body;
  const result = await validateWithDatabase(sql, allowMutation);

  await prisma.queryHistory.create({
    data: {
      userId: req.user.id,
      sql,
      status: result.valid ? "VALIDATED" : "FAILED",
      metadata: result
    }
  });

  await incrementAnalytics(req.user.id, result.valid ? "validated" : "failed");

  res.json({
    success: true,
    data: result
  });
});

const impactQuery = asyncHandler(async (req, res) => {
  const { sql, allowMutation } = req.body;
  const result = await analyzeImpact(sql, allowMutation);

  res.json({
    success: true,
    data: result
  });
});

const optimizeQuery = asyncHandler(async (req, res) => {
  console.log("Optimize API Started");

  const { sql, schemaContext } = req.body;

  if (!sql) {
    return res.status(400).json({ success: false, message: "SQL is required" });
  }

  const optimization = await optimizeSql({ sql, schemaContext });

  console.log("Optimization generated");

  return res.status(200).json({
    success: true,
    data: {
      optimization,
    },
  });
});

const executeQuery = asyncHandler(async (req, res) => {
  const { sql, historyId, allowMutation, limit } = req.body;
  const result = await executeSql({
    userId: req.user.id,
    sql,
    historyId,
    allowMutation,
    limit
  });

  await incrementAnalytics(req.user.id, "executed", result.durationMs);

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  executeQuery,
  generateQuery,
  explainQuery,
  impactQuery,
  optimizeQuery,
  validateQuery
};
