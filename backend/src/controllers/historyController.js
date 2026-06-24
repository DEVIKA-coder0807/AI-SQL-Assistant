const { prisma } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");
const { incrementAnalytics } = require("../services/analyticsService");

const getHistory = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.queryHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        savedQuery: true,
        executions: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      }
    }),
    prisma.queryHistory.count({ where: { userId: req.user.id } })
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

const saveQuery = asyncHandler(async (req, res) => {
  const { title, description, sql, historyId, tags = [] } = req.body;

  const savedQuery = await prisma.savedQuery.create({
    data: {
      userId: req.user.id,
      historyId,
      title,
      description,
      sql,
      tags
    }
  });

  if (historyId) {
    await prisma.queryHistory.updateMany({
      where: { id: historyId, userId: req.user.id },
      data: { status: "SAVED" }
    });
  }

  await incrementAnalytics(req.user.id, "saved");

  res.status(201).json({
    success: true,
    data: savedQuery
  });
});

module.exports = { getHistory, saveQuery };
