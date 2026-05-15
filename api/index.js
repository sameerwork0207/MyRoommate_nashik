import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Listing from "../models/Listing.js";
import Lead from "../models/Lead.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "../routes/auth.js";
import adminRoutes from "../routes/admin.js";
import userRoutes from "../routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Connect DB inside function for serverless or at startup
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MyRoommate API is running" });
});

// Listings API
app.get("/api/listings", async (req, res) => {
  try {
    const { type, isPremium, location } = req.query;
    let query = { status: "approved" };
    
    if (type) query.type = type.toLowerCase();
    if (isPremium) query.isPremium = isPremium === 'true';
    if (location) query.location = { $regex: location, $options: 'i' };

    const listings = await Listing.find(query);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

// Leads API
app.post("/api/leads", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit lead request" });
  }
});

// Local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
