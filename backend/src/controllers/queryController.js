const { prisma } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");
const { explainSql, generateSql, optimizeSql } = require("../services/ollamaService");
const { incrementAnalytics } = require("../services/analyticsService");
const { analyzeImpact, executeSql, validateWithDatabase } = require("../services/queryService");

const generateQuery = asyncHandler(async (req, res) => {
  const { question, schemaContext, dialect } = req.body;
  const sql = await generateSql({ question, schemaContext, dialect });
  const explanation = await explainSql(sql);

  const history = await prisma.queryHistory.create({
    data: {
      userId: req.user.id,
      prompt: question,
      sql,
      explanation,
      status: "GENERATED",
      metadata: { dialect: dialect || "PostgreSQL", schemaContextProvided: Boolean(schemaContext) }
    }
  });

  await incrementAnalytics(req.user.id, "generated");

  res.status(201).json({
    success: true,
    data: { id: history.id, sql, explanation }
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
  const { sql, schemaContext } = req.body;
  const suggestions = await optimizeSql({ sql, schemaContext });

  const history = await prisma.queryHistory.create({
    data: {
      userId: req.user.id,
      sql,
      optimizationNotes: suggestions,
      status: "GENERATED",
      metadata: { optimized: true, schemaContextProvided: Boolean(schemaContext) }
    }
  });

  res.json({
    success: true,
    data: {
      id: history.id,
      suggestions
    }
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
  impactQuery,
  optimizeQuery,
  validateQuery
};
