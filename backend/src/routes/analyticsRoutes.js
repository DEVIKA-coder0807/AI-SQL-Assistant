const express = require("express");
const { getAnalytics, getDashboard, getTrends, getTables } = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getAnalytics);
router.get("/dashboard", authenticate, getDashboard);
router.get("/trends", authenticate, getTrends);
router.get("/tables", authenticate, getTables);

module.exports = router;