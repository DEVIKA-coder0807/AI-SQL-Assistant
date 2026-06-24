const { prisma } = require("../config/database");

const ensureAnalytics = (userId) =>
  prisma.analytics.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });

const incrementAnalytics = async (userId, type, durationMs = 0) => {
  await ensureAnalytics(userId);

  const data = {};

  if (type === "generated") {
    data.totalGenerated = { increment: 1 };
    data.lastGeneratedAt = new Date();
  }

  if (type === "validated") {
    data.totalValidated = { increment: 1 };
  }

  if (type === "executed") {
    data.totalExecuted = { increment: 1 };
    data.lastExecutedAt = new Date();
  }

  if (type === "failed") {
    data.totalFailed = { increment: 1 };
  }

  if (type === "saved") {
    data.totalSaved = { increment: 1 };
  }

  const current = await prisma.analytics.findUnique({ where: { userId } });
  if (durationMs > 0 && current) {
    const completedExecutions = current.totalExecuted + (type === "executed" ? 1 : 0);
    data.averageExecutionMs = Math.round(
      (current.averageExecutionMs * current.totalExecuted + durationMs) / Math.max(completedExecutions, 1)
    );
  }

  return prisma.analytics.update({
    where: { userId },
    data
  });
};

module.exports = { ensureAnalytics, incrementAnalytics };
