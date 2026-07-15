import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9001;

// Database
connectDB();

// Global middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "WardTech API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to WardTech Digital Ward API",
    version: "1.0.0",
  });
});

// API routes — Backend Member 1 modules
app.use("/api/auth", authRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`WardTech server running on port ${PORT}`);
});

export default app;
