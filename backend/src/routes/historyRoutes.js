const express = require("express");
const { body, query } = require("express-validator");
const { getHistory, saveQuery } = require("../controllers/historyController");
const { authenticate } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100")
  ],
  validateRequest,
  getHistory
);

router.post(
  "/save",
  [
    body("title").trim().isLength({ min: 2, max: 120 }).withMessage("Title must be 2-120 characters"),
    body("description").optional().isString().isLength({ max: 500 }),
    body("sql").trim().isLength({ min: 1, max: 10000 }).withMessage("SQL is required"),
    body("historyId").optional().isUUID().withMessage("historyId must be a valid UUID"),
    body("tags").optional().isArray({ max: 20 }).withMessage("tags must be an array with at most 20 items")
  ],
  validateRequest,
  saveQuery
);

module.exports = router;
