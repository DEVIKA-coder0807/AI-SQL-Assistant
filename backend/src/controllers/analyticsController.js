const { prisma } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");
const { ensureAnalytics } = require("../services/analyticsService");

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await ensureAnalytics(req.user.id);

  const [recentExecutions, savedQueries, historyCount] = await Promise.all([
    prisma.queryExecution.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.savedQuery.count({ where: { userId: req.user.id } }),
    prisma.queryHistory.count({ where: { userId: req.user.id } })
  ]);

  res.json({
    success: true,
    data: {
      ...analytics,
      savedQueries,
      historyCount,
      recentExecutions
    }
  });
});

module.exports = { getAnalytics };
