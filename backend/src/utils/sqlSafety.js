const MUTATION_KEYWORDS = [
  "insert",
  "update",
  "delete",
  "drop",
  "truncate",
  "alter",
  "create",
  "grant",
  "revoke",
  "vacuum",
  "copy",
  "call",
  "merge"
];

const stripSqlComments = (sql) =>
  sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

const normalizeSql = (sql) => stripSqlComments(sql).replace(/\s+/g, " ").trim();

const hasMultipleStatements = (sql) => {
  const cleaned = stripSqlComments(sql);
  const statements = cleaned
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  return statements.length > 1;
};

const getFirstKeyword = (sql) => normalizeSql(sql).split(" ")[0]?.toLowerCase();

const isReadOnlyQuery = (sql) => {
  const normalized = normalizeSql(sql).toLowerCase();
  const firstKeyword = getFirstKeyword(normalized);
  const allowedStarts = ["select", "with", "explain"];

  return allowedStarts.includes(firstKeyword) && !MUTATION_KEYWORDS.some((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(normalized));
};

const addLimitToSelect = (sql, limit) => {
  const cleaned = stripSqlComments(sql).replace(/;+\s*$/, "");

  if (!isReadOnlyQuery(cleaned) || /\blimit\s+\d+/i.test(cleaned)) {
    return cleaned;
  }

  return `${cleaned} LIMIT ${limit}`;
};

module.exports = {
  addLimitToSelect,
  getFirstKeyword,
  hasMultipleStatements,
  isReadOnlyQuery,
  normalizeSql
};
