const { prisma } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");
const { ensureAnalytics } = require("../services/analyticsService");

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await ensureAnalytics(req.user.id);
  const [savedQueries, historyCount, recentExecutions] = await Promise.all([
    prisma.savedQuery.count({ where: { userId: req.user.id } }),
    prisma.queryHistory.count({ where: { userId: req.user.id } }),
    prisma.queryExecution.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
  ]);
  res.json({
    success: true,
    data: { ...analytics, savedQueries, historyCount, recentExecutions }
  });
});

const getDashboard = asyncHandler(async (req, res) => {
  const [totalGenerated, totalSaved, totalExecuted, totalFailed] = await Promise.all([
    prisma.queryHistory.count({ where: { userId: req.user.id } }),
    prisma.savedQuery.count({ where: { userId: req.user.id } }),
    prisma.queryExecution.count({ where: { userId: req.user.id, success: true } }),
    prisma.queryExecution.count({ where: { userId: req.user.id, success: false } }),
  ]);

  const totalExec = totalExecuted + totalFailed;
  const successRate = totalExec > 0
    ? Math.round((totalExecuted / totalExec) * 100)
    : 0;

  const avgExec = await prisma.queryExecution.aggregate({
    where: { userId: req.user.id },
    _avg: { durationMs: true }
  });

  res.json({
    success: true,
    data: {
      totalGenerated,
      totalExecuted,
      totalSaved,
      successRate: `${successRate}%`,
      avgLatency: avgExec._avg.durationMs
        ? `${Math.round(avgExec._avg.durationMs)}ms`
        : "N/A",
    }
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const days = 7;
  const trends = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    const [queries, executions] = await Promise.all([
      prisma.queryHistory.count({
        where: { userId: req.user.id, createdAt: { gte: start, lte: end } }
      }),
      prisma.queryExecution.count({
        where: { userId: req.user.id, createdAt: { gte: start, lte: end } }
      }),
    ]);

    trends.push({
      date: start.toLocaleDateString('en-US', { weekday: 'short' }),
      queries,
      executions,
    });
  }

  res.json({ success: true, data: trends });
});

const getTables = asyncHandler(async (req, res) => {
  const histories = await prisma.queryHistory.findMany({
    where: { userId: req.user.id },
    select: { sql: true },
    take: 100,
  });

  const tableCount = {};
  histories.forEach(({ sql }) => {
    const matches = sql.match(/FROM\s+(\w+)/gi) || [];
    matches.forEach((match) => {
      const table = match.replace(/FROM\s+/i, '').toLowerCase();
      tableCount[table] = (tableCount[table] || 0) + 1;
    });
  });

  const mostUsed = Object.entries(tableCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  res.json({ success: true, data: { mostUsed, tableCount } });
});

module.exports = { getAnalytics, getDashboard, getTrends, getTables };