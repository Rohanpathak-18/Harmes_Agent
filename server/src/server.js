const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

require("./bootstrap");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const workflowRoutes = require("./routes/workflow.routes");
const approvalRoutes = require("./routes/approval.routes");
const publicationRoutes = require("./routes/publication.routes");
const { errorHandler } = require("./middleware/error.middleware");
const analyticsRoutes = require("./routes/analytics.routes");
const learningRoutes = require("./routes/learning.routes");
const retryRoutes = require("./routes/retry.routes");
const healthRoutes = require("./routes/health.routes");
const systemRoutes = require("./routes/system.routes");

const app = express();

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/analytics", analyticsRoutes);
// Keep the browser-facing name neutral so privacy extensions do not mistake
// the first-party feature route for a third-party analytics tracker.
app.use("/api/job-insights", analyticsRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/retry", retryRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/system", systemRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hermes Core API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Hermes Core running on port ${PORT}`);
});
