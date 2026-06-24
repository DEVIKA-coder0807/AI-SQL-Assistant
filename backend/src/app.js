const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { env } = require("./config/env");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");
const historyRoutes = require("./routes/historyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

const allowedOrigins = env.corsOrigin.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "AI SQL Assistant Backend Running",
    docs: {
      health: "/health",
      auth: ["/auth/register", "/auth/login", "/auth/profile"],
      query: ["/query/generate", "/query/validate", "/query/impact", "/query/optimize", "/query/execute"]
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "ai-sql-assistant-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/auth", authRoutes);
app.use("/query", queryRoutes);
app.use("/history", historyRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
