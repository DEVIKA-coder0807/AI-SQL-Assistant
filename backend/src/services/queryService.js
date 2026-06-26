const { Prisma } = require("@prisma/client");
const { prisma } = require("../config/database");
const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");
const { addLimitToSelect, hasMultipleStatements, isReadOnlyQuery, normalizeSql } = require("../utils/sqlSafety");
const { getComplexityFromPlan } = require("./complexityService");

const validateSqlSafety = (sql, allowMutation = false) => {
  if (!sql || typeof sql !== "string") {
    throw new ApiError(400, "SQL is required");
  }

  if (hasMultipleStatements(sql)) {
    throw new ApiError(400, "Only one SQL statement is allowed");
  }

  if (!allowMutation && !isReadOnlyQuery(sql)) {
    throw new ApiError(400, "Only read-only SELECT/CTE queries are allowed by default");
  }
};

const validateWithDatabase = async (sql, allowMutation = false) => {
  validateSqlSafety(sql, allowMutation);
  const normalizedSql = normalizeSql(sql).replace(/;+\s*$/, "");

  try {
    await prisma.$queryRawUnsafe(`EXPLAIN ${normalizedSql}`);
    return {
      valid: true,
      normalizedSql,
      message: "SQL is valid for MySQL/PostgreSQL",
    };
  } catch (error) {
    return {
      valid: false,
      normalizedSql,
      message: "SQL validation failed",
      error: error.message
    };
  }
};

const analyzeImpact = async (sql, allowMutation = false) => {

  const validation = await validateWithDatabase(sql, allowMutation);

  if (!validation.valid) {
    return {
      ...validation,
      impact: {
        riskLevel: "high",
        summary: "The database rejected this query during planning."
      }
    };
  }


  const plan = await prisma.$queryRawUnsafe(`EXPLAIN (FORMAT JSON) ${validation.normalizedSql}`);
  
    const firstPlan = plan?.[0]?.["QUERY PLAN"]?.[0]?.Plan || null;
    const complexity = getComplexityFromPlan(firstPlan);
    const planRows = Number(firstPlan?.rows || 0);
    const totalCost = 0;
  const readOnly = isReadOnlyQuery(validation.normalizedSql);

  let riskLevel = "low";
  if (!readOnly ||  planRows > 100000) riskLevel = "high";
  else if ( planRows > 10000) riskLevel = "medium";

  return {
    valid: true,
    sql: validation.normalizedSql,
    impact: {
      riskLevel,
      readOnly,
      estimatedRows: planRows,
      estimatedCost: null,
      summary: `${readOnly ? "Read-only" : "Mutation"} query with ${riskLevel} estimated impact.`,
       complexity

    },
    plan
  };
};
const analyzeComplexity = async (sql) => {
  const normalizedSql = normalizeSql(sql).replace(/;+\s*$/, "");

  const plan = await prisma.$queryRawUnsafe(
  `EXPLAIN ${normalizedSql}`
);

const firstPlan = plan?.[0] || null;

  return getComplexityFromPlan(firstPlan);
};

const executeSql = async ({ userId, sql, historyId, allowMutation = false, limit = env.defaultQueryLimit }) => {
  const normalizedSql = normalizeSql(sql).trim().toUpperCase();

if (!normalizedSql.startsWith("SELECT")) {
  return {
    blocked: true,
    success: false,
    message:
      "Only SELECT queries can be executed. Other SQL statements are blocked for security reasons."
  };
}
  validateSqlSafety(sql, allowMutation || env.allowMutationQueries);

  const safeLimit = Math.min(Number(limit) || env.defaultQueryLimit, env.maxQueryLimit);
  const readOnly = isReadOnlyQuery(sql);
  const executableSql = readOnly ? addLimitToSelect(sql, safeLimit) : normalizeSql(sql).replace(/;+\s*$/, "");
  const startedAt = Date.now();

  try {
    const rows = readOnly ? await prisma.$queryRawUnsafe(executableSql) : [];
    const affectedRows = readOnly ? 0 : await prisma.$executeRawUnsafe(executableSql);
    const durationMs = Date.now() - startedAt;
    const rowCount = readOnly && Array.isArray(rows) ? rows.length : affectedRows;

    const execution = await prisma.queryExecution.create({
      data: {
        userId,
        historyId,
        sql: executableSql,
        rowCount,
        durationMs,
        success: true
      }
    });

    return { execution, rows, durationMs, rowCount, sql: executableSql };
  } catch (error) {
    const durationMs = Date.now() - startedAt;

    await prisma.queryExecution.create({
      data: {
        userId,
        historyId,
        sql,
        durationMs,
        success: false,
        errorMessage: error.message
      }
    });

    throw new ApiError(400, "Query execution failed", { error: error.message });
  }
};

const toPrismaJson = (value) => value === undefined ? Prisma.JsonNull : value;

module.exports = {
  analyzeImpact,
  analyzeComplexity,
  executeSql,
  toPrismaJson,
  validateSqlSafety,
  validateWithDatabase
};
