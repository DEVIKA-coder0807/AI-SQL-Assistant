const express = require("express");
const { body } = require("express-validator");
const { authenticate } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { prisma } = require("../config/database");

const router = express.Router();
router.use(authenticate);

// Save a query
router.post(
  "/",
  [
    body("sql").trim().isLength({ min: 1 }).withMessage("SQL is required"),
    body("title").trim().isLength({ min: 1, max: 120 }).withMessage("Title is required"),
    body("description").optional().isString().isLength({ max: 500 }),
    body("tags").optional().isArray(),
    body("historyId").optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    const { sql, title, description, tags, historyId } = req.body;

    const saved = await prisma.savedQuery.create({
      data: {
        userId: req.user.id,
        sql,
        title,
        description: description || "",
        tags: tags || [],
        historyId: historyId || null,
      },
    });

    res.status(201).json({ success: true, data: saved });
  }
);

// Get all saved queries
router.get("/", async (req, res) => {
  const saved = await prisma.savedQuery.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: saved });
});

// Delete a saved query
router.delete("/:id", async (req, res) => {
  await prisma.savedQuery.delete({
    where: { id: req.params.id, userId: req.user.id },
  });

  res.json({ success: true, message: "Deleted successfully" });
});

module.exports = router;