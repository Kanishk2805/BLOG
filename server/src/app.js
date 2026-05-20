import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Core middleware stack for CORS, JSON payloads, and request logs.
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to ScreenScope API"
  });
});

app.use("/api", apiRoutes);
// Standardized 404 and error handling should be registered last.
app.use(notFound);
app.use(errorHandler);

export default app;
