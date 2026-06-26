const getComplexityFromPlan = (plan) => {
  if (!plan) {
    return {
      complexity: "Unknown",
      strategy: "Unknown",
      estimatedRows: 0,
    };
  }

  const type = plan.type;
  const rows = Number(plan.rows || 0);

  let complexity = "O(n)";
  let strategy = type;

  switch (type) {
    case "const":
    case "system":
        complexity = "O(1)";
        strategy = "Constant Lookup";
        break;

    case "eq_ref":
    case "ref":
        complexity = "O(log n)";
        strategy = "Indexed Lookup";
        break;

    case "range":
        complexity = "O(log n)";
        strategy = "Range Scan";
        break;

    case "index":
        complexity = "O(n)";
        strategy = "Index Scan";
        break;

    case "ALL":
        complexity = "O(n)";
        strategy = "Full Table Scan";
        break;

    default:
        complexity = "O(n)";
        strategy = type || "Unknown";
  }

  return {
      complexity,
      strategy,
      estimatedRows: rows
  };
};

module.exports = {
    getComplexityFromPlan
};