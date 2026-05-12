// Vercel serverless function wrapper for Express app
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "../server/routes/authRoutes.js";
import leadRoutes from "../server/routes/leadRoutes.js";
import listingRoutes from "../server/routes/listingRoutes.js";

dotenv.config();

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/leads", leadRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all for frontend routing
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Connect to MongoDB on first request (not on every request)
let mongoConnected = false;

const ensureDbConnected = async () => {
  if (mongoConnected) return;
  
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }
  
  try {
    await mongoose.connect(MONGO_URI);
    mongoConnected = true;
    console.log("DB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

// Export as Vercel serverless function
export default async (req, res) => {
  try {
    await ensureDbConnected();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed" });
  }
  
  return app(req, res);
};
