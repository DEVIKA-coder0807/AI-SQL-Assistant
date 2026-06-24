const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getAnalytics);

module.exports = router;
