import dotenv from "dotenv";

// Load environment variables FIRST before importing config
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { config } from "./config";

const app = express();
const PORT = config.PORT;

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration for video streaming
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
    exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (videos, images, etc.) with proper headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Range, Content-Type");
    res.header(
      "Access-Control-Expose-Headers",
      "Content-Range, Accept-Ranges, Content-Length"
    );
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Beer Rating API",
    version: "1.0.0",
    endpoints: {
      "/api/beers/search/:query": "GET - Search for beers",
      "/api/beers/name/:name": "GET - Get specific beer by name",
      "/api/ratings": "POST - Save beer rating, GET - Get all beer ratings",
      "/api/ratings/beer/:name": "GET - Get ratings for specific beer",
    },
  });
});

// API Routes
import apiRoutes from "./routes/api";
import supabaseRoutes from "./routes/supabase-api";
import { errorHandler } from "./middleware/errorHandler";
app.use("/api", apiRoutes);
// Use clean architecture with dependency injection
app.use("/api/supabase", supabaseRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}`);
});

export default app;
