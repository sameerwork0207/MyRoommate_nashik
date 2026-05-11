// Server entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// API routes - MUST come before static files
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/leads", leadRoutes);

// Serve static files (CSS, JS, images, etc) but not HTML files
app.use(express.static(path.join(__dirname, "../public"), { 
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Serve frontend - catch-all route (MUST be after API routes AND static files)
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// connect DB and start server
if (!MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
