const express = require("express");
const { body } = require("express-validator");
const {
  executeQuery,
  generateQuery,
  explainQuery,
  impactQuery,
  optimizeQuery,
  validateQuery
} = require("../controllers/queryController");
const { authenticate } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimiter");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(authenticate);

router.post(
  "/generate",
  aiLimiter,
  [
    body("question").trim().isLength({ min: 5, max: 2000 }).withMessage("Question must be 5-2000 characters"),
    body("schemaContext").optional().isString().isLength({ max: 10000 }),
    body("dialect").optional().isString().isLength({ max: 50 })
  ],
  validateRequest,
  generateQuery
);
router.post(
  "/explain",
  //aiLimiter,
  [
    body("sql")
      .trim()
      .isLength({ min: 1, max: 10000 })
      .withMessage("SQL is required")
  ],
  validateRequest,
  explainQuery
);

router.post(
  "/validate",
  [
    body("sql").trim().isLength({ min: 1, max: 10000 }).withMessage("SQL is required"),
    body("allowMutation").optional().isBoolean().withMessage("allowMutation must be a boolean")
  ],
  validateRequest,
  validateQuery
);

router.post(
  "/impact",
  [
    body("sql").trim().isLength({ min: 1, max: 10000 }).withMessage("SQL is required"),
    body("allowMutation").optional().isBoolean().withMessage("allowMutation must be a boolean")
  ],
  validateRequest,
  impactQuery
);

router.post(
  "/optimize",
  //aiLimiter,
  [
    body("sql").trim().isLength({ min: 1, max: 10000 }).withMessage("SQL is required"),
    body("schemaContext").optional().isString().isLength({ max: 10000 })
  ],
  validateRequest,
  optimizeQuery
);

router.post(
  "/execute",
  [
    body("sql").trim().isLength({ min: 1, max: 10000 }).withMessage("SQL is required"),
    body("historyId").optional().isUUID().withMessage("historyId must be a valid UUID"),
    body("limit").optional().isInt({ min: 1, max: 1000 }).withMessage("limit must be between 1 and 1000"),
    body("allowMutation").optional().isBoolean().withMessage("allowMutation must be a boolean")
  ],
  validateRequest,
  executeQuery
);

module.exports = router;
