const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const workflowRoutes = require("./routes/workflow.routes");
const approvalRoutes = require("./routes/approval.routes");
const publicationRoutes = require("./routes/publication.routes");

dotenv.config();

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
